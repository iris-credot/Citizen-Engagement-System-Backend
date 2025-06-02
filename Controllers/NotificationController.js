const Notification = require('../Models/NotificationModel');
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const User = require('../Models/UserModel'); // Assuming user has an email field
const sendEmail = require('../Middleware/sendMail'); // A utility to send email

const sendNotification = async ({ user, message, type }) => {
  if (!user || !message) {
    throw new BadRequest('User and message are required.');
  }

  // Try to find user in User collection
  let userData = await User.findById(user);
  if (!userData || !userData.email) {
    throw new NotFound('User or email not found.');
  }

  const notification = new Notification({ user_id: user, message, type });

  try {
    await sendEmail(
      userData.email,
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
