const Response = require('../Models/ResponseModel');
const Complaint = require('../Models/ComplaintModel');
const User = require('../Models/UserModel'); // Assuming you have a User model
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./NotificationController');

const responseController = {
  // Create a new response
  createResponse: asyncWrapper(async (req, res, next) => {
    const { complaint_id, message } = req.body;
    const responder_id = req.userId; // From JWT middleware

    if (!complaint_id || !message) {
      return next(new BadRequest('Complaint ID and response message are required.'));
    }

    // Verify complaint exists
    const complaint = await Complaint.findById(complaint_id);
    if (!complaint) {
      return next(new NotFound(`Complaint with ID ${complaint_id} not found.`));
    }

    // Verify responder exists and is authorized (admin or agency staff)
    const responder = await User.findById(responder_id);
    if (!responder) {
      return next(new NotFound('Responder user not found.'));
    }
    if (!['admin', 'agency-staff', 'super-admin'].includes(responder.role)) {
      return next(new BadRequest('Only admin or agency staff can respond to complaints.'));
    }

    const response = new Response({
      complaint_id,
      responder_id,
      message
    });

    const savedResponse = await response.save();

    // Optional: Notify the user who created the complaint
    await sendNotification({
      user: complaint.user_id,
      message: `Your complaint has a new response: "${message}"`,
      type: 'response'
    });

    res.status(201).json({ message: 'Response created successfully', response: savedResponse });
  }),

  // Get all responses
  getAllResponses: asyncWrapper(async (req, res) => {
    const responses = await Response.find()
      .populate('complaint_id')
      .populate('responder_id', '-password'); // omit password for security

    res.status(200).json({ responses });
  }),

  // Get response by ID
  getResponseById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const response = await Response.findById(id)
      .populate('complaint_id')
      .populate('responder_id', '-password');

    if (!response) {
      return next(new NotFound(`No response found with ID ${id}`));
    }

    res.status(200).json({ response });
  }),

  // Update a response
  updateResponse: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    // Optional: Only allow the original responder or admin to update
    const existingResponse = await Response.findById(id);
    if (!existingResponse) {
      return next(new NotFound(`No response found with ID ${id}`));
    }

    if (req.userId.toString() !== existingResponse.responder_id.toString() &&
        !['admin', 'super-admin'].includes(req.role)) {
      return res.status(403).json({ message: 'You are not authorized to update this response.' });
    }

    const updatedResponse = await Response.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ message: 'Response updated successfully', response: updatedResponse });
  }),

  // Delete a response
  deleteResponse: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const response = await Response.findById(id);
    if (!response) {
      return next(new NotFound(`No response found with ID ${id}`));
    }

    if (req.userId.toString() !== response.responder_id.toString() &&
        !['admin', 'super-admin'].includes(req.role)) {
      return res.status(403).json({ message: 'You are not authorized to delete this response.' });
    }

    await Response.findByIdAndDelete(id);

    res.status(200).json({ message: 'Response deleted successfully' });
  }),

  // Get responses by complaint
  getResponsesByComplaint: asyncWrapper(async (req, res, next) => {
    const { complaintId } = req.params;

    const responses = await Response.find({ complaint_id: complaintId })
      .populate('responder_id', '-password');

    if (!responses.length) {
      return next(new NotFound(`No responses found for complaint ID ${complaintId}`));
    }

    res.status(200).json({ responses });
  }),

  // Get responses by responder (admin/staff)
  getResponsesByResponder: asyncWrapper(async (req, res, next) => {
    const { responderId } = req.params;

    const responses = await Response.find({ responder_id: responderId })
      .populate('complaint_id');

    if (!responses.length) {
      return next(new NotFound(`No responses found for responder ID ${responderId}`));
    }

    res.status(200).json({ responses });
  })
};

module.exports = responseController;
