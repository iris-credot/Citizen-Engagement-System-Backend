const mongoose = require('mongoose');
const Complaint = require('../Models/ComplaintModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./NotificationController'); // Optional: if you notify users/agencies

const complaintController = {
  // Create a new complaint
  createComplaint: asyncWrapper(async (req, res, next) => {
    const user_id = req.userId;
    const { agency_id,category, title, description, attachments } = req.body;

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
    
        await sendNotification({
            user: user_id,
            message: `Complaint: ${title} has been submitted successfully.`,
            type: 'complaint'
          });
                  await sendNotification({
            user: agency_id,
            message: `A new complaint has been made ${title}.`,
            type: 'complaint'
          });
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
  getComplaintCategories: asyncWrapper(async (req, res) => {
  res.status(200).json({
    categories: [
      'Roads and Infrastructure',
      'Water and Sanitation',
      'Electricity',
      'Public Safety',
      'Health Services',
      'Education',
      'Waste Management',
      'Corruption',
      'Noise Pollution',
      'Environmental Issues',
      'Public Transport',
      'Social Services',
      'Illegal Construction',
      'Others',
    ],
  });
}),

  // Get a single complaint by ID
  getComplaintById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate('user_id')
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
  
    // Define allowed status values
    const allowedStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return next(new BadRequest('Invalid status value.'));
    }
  
    // Find the complaint and populate user and agency
    const complaint = await Complaint.findById(id)
      .populate({ path: 'user_id', model: 'User' })
      .populate({ path: 'agency_id', model: 'Agency' });
  
    if (!complaint) {
      return next(new NotFound(`No complaint found with ID ${id}`));
    }
  
    // Update the complaint's status
    complaint.status = status;
    const updatedComplaint = await complaint.save();
  
    // Prepare notifications
    const notifications = [];
  
    // Notify the user
    if (complaint.user_id && complaint.user_id._id) {
      notifications.push(
        sendNotification({
          user: complaint.user_id._id,
          message: `Complaint has been updated to ${status}.`,
          type: 'complaint',
        })
      );
      console.log(`✅ Notification sent to user ${complaint.user_id.email || complaint.user_id._id}`);
    } else {
      console.warn(`[WARN] Complaint ${complaint._id} is missing a valid user reference.`);
    }
  
    // Notify the agency (if assigned)
    if (complaint.agency_id && complaint.agency_id._id) {
      notifications.push(
        sendNotification({
          user: complaint.agency_id._id,
          message: `A complaint assigned to your agency is now "${status}".`,
          type: 'complaint',
        })
      );
      console.log(`✅ Notification sent to agency ${complaint.agency_id.name || complaint.agency_id._id}`);
    } else {
      console.warn(`[WARN] Complaint ${complaint._id} is not yet assigned to an agency.`);
    }
  
    // Attempt to send all notifications
    try {
      await Promise.all(notifications);
    } catch (error) {
      console.error('❌ Failed to send notifications:', error.message);
    }
  
    // Return response
    return res.status(200).json({
      message: 'Status updated successfully.',
      complaint: updatedComplaint,
    });
  }),
  
  
  
  
  // Get complaints by user
getComplaintsByUser: asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;

  const complaints = await Complaint.find({ user_id: userId })
    .populate("agency_id");

  // ✅ Don't throw error for empty results
  return res.status(200).json({ complaints }); // This will return [] if none found
}),

  // Get complaints by agency
  

getComplaintsByAgency: asyncWrapper(async (req, res, next) => {
  const { agencyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    return next(new BadRequest('Invalid agencyId'));
  }

  const complaints = await Complaint.find({ agency_id: agencyId }).populate('user_id');

  if (!complaints.length) {
    return next(new NotFound(`No complaints found for agency ID ${agencyId}`));
  }

  res.status(200).json({ complaints });
})

};

module.exports = complaintController;
