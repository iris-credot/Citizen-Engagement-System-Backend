const Complaint = require('../Models/ComplaintModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./NotificationController'); // Optional: if you notify users/agencies

const complaintController = {
  // Create a new complaint
  createComplaint: asyncWrapper(async (req, res, next) => {
    const { user_id, agency_id,category, title, description, attachments } = req.body;

    if (!user_id || !category || !agency_id || !title || !description) {
      return next(new BadRequest('Missing required fields.'));
    }

    const complaint = new Complaint({
      user_id,
      agency_id,
      category,
      title,
      description,
      attachments: attachments || []
    });

    const savedComplaint = await complaint.save();
    await Promise.all([
        await sendNotification({
            user: user_id,
            message: 'Your complaint has been submitted.',
            type: 'complaint'
          }),
          await sendNotification({
            user: agency_id, // notify both
            message: `New Complaint "${description}".`,
            type: 'complaint'
          })
      ]);
    // Optional: Notify agency or user
  

    res.status(201).json({ message: 'Complaint created successfully', complaint: savedComplaint });
  }),

  // Get all complaints
  getAllComplaints: asyncWrapper(async (req, res, next) => {
    const complaints = await Complaint.find()
      .populate('user_id')
      .populate('agency_id');

    res.status(200).json({ complaints });
  }),

  // Get a single complaint by ID
  getComplaintById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate('user_id')
      .populate('category_id')
      .populate('agency_id');

    if (!complaint) {
      return next(new NotFound(`No complaint found with ID ${id}`));
    }

    res.status(200).json({ complaint });
  }),

  // Update a complaint
  updateComplaint: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedComplaint) {
      return next(new NotFound(`No complaint found with ID ${id}`));
    }

    res.status(200).json({ message: 'Complaint updated successfully', complaint: updatedComplaint });
  }),

  // Delete a complaint
  deleteComplaint: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deletedComplaint = await Complaint.findByIdAndDelete(id);
    if (!deletedComplaint) {
      return next(new NotFound(`No complaint found with ID ${id}`));
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });
  }),

  // Filter complaints
  filterComplaints: asyncWrapper(async (req, res, next) => {
    const { user_id, agency_id, category_id, status } = req.query;

    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (agency_id) filter.agency_id = agency_id;
    if (category_id) filter.category_id = category_id;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('user_id')
      .populate('category_id')
      .populate('agency_id');

    res.status(200).json({ complaints });
  }),

  // Change complaint status
  changeComplaintStatus: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return next(new BadRequest('Invalid status value.'));
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return next(new NotFound(`No complaint found with ID ${id}`));
    }

    complaint.status = status;
    const updatedComplaint = await complaint.save();

    // Optional: notify user
    await Promise.all([
        await sendNotification({
            user: user_id,
            message: `Your complaint status has been updated to "${status}".`,
            type: 'complaint'
          }),
          await sendNotification({
            users: agency_id, // notify both
            message: `Your complaint status has been updated to "${status}".`,
            type: 'complaint'
          })
      ]);
   

    res.status(200).json({ message: 'Status updated successfully', complaint: updatedComplaint });
  }),

  // Get complaints by user
  getComplaintsByUser: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    const complaints = await Complaint.find({ user_id: userId })
      .populate('category_id')
      .populate('agency_id');

    if (!complaints.length) {
      return next(new NotFound(`No complaints found for user ID ${userId}`));
    }

    res.status(200).json({ complaints });
  }),

  // Get complaints by agency
  getComplaintsByAgency: asyncWrapper(async (req, res, next) => {
    const { agencyId } = req.params;

    const complaints = await Complaint.find({ agency_id: agencyId })
      .populate('user_id')
      .populate('category_id');

    if (!complaints.length) {
      return next(new NotFound(`No complaints found for agency ID ${agencyId}`));
    }

    res.status(200).json({ complaints });
  })
};

module.exports = complaintController;
