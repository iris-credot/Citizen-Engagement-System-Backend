const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  // Replaced category_id ref with enum-based category
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
      'Others'
    ]
  },
  agency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'Agency is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  attachments: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
