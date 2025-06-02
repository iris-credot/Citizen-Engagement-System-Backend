const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
    agency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'Agency ID is required']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required']
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['Notification','complaint', 'response','category'],
     default:'Notification',
    required: true,
  },
 
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
