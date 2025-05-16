const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agency name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  contact_email: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Please provide a valid email address'
    }
  }
}, { timestamps: true });

const Agency = mongoose.model('Agency', agencySchema);
module.exports = Agency;
