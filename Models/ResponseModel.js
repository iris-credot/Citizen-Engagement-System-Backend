const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  complaint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: [true, 'Complaint ID is required']
  },
  responder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Must be an admin or agency staff
    required: [true, 'Responder (admin user) is required']
  },
  message: {
    type: String,
    required: [true, 'Response message is required']
  }
}, { timestamps: true });

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
