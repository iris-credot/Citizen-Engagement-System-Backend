const mongoose = require('mongoose');

const userOtpAuthentication = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   token: {type:String},
   createdAt: { type: Date, default: Date.now },
   expirationDate:{type: Date}
  
  
}, { timestamps: true });


module.exports = mongoose.model('Otp', userOtpAuthentication);
 