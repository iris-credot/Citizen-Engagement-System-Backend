const Notification = require('../Models/NotificationModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../Models/UserModel'); // Assuming user has an email field
const sendEmail = require('../Middleware/sendMail'); // A utility to send email

const sendNotification = async ({ user_id, agency_id, message, type }) => {
  if (!user_id || !message || !agency_id) {
    throw new BadRequest('User ID, agency ID, and message are required.');
  }

  // Fetch user and agency data
  const userData = await User.findById(user_id);
  const agencyData = await Agency.findById(agency_id);

  if (!userData || !userData.email) {
    throw new NotFound('User or user email not found.');
  }

  if (!agencyData || !agencyData.email) {
    throw new NotFound('Agency or agency email not found.');
  }

  const notification = new Notification({
    user_id: userData._id,
    agency_id: agencyData._id,
    message,
    type,
  });

  try {
    // Send email to user
    await sendEmail(
      userData.email,
      `New ${type} notification`,
      `<p>${message}</p>`
    );

    // Send email to agency
    await sendEmail(
      agencyData.email,
      `New ${type} notification`,
      `<p>${message}</p>`
    );

    notification.status = 'sent';
  } catch (error) {
    notification.status = 'failed';
    console.error('Email sending failed:', error);
  }

  await notification.save();
  return notification;
};



// Other controller methods
const notificationController = {
  getAllNotifications: asyncWrapper(async (req, res) => {
    const notifications = await Notification.find().populate('user_id');
    res.status(200).json({ notifications });
  }),
    deleteNotification: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return next(new NotFound(`No notification found with ID ${id}`));
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  }),

 getNotificationsByUser: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const notifications = await Notification.find({ user_id: id });

  // Return 200 OK with empty array if no notifications
  res.status(200).json({ notifications });
}),
 getNotificationsByAgency: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const notifications = await Notification.find({ agency_id: id });

  // Return 200 OK with empty array if no notifications
  res.status(200).json({ notifications });
})
};

module.exports = {
  sendNotification,
  notificationController
};
