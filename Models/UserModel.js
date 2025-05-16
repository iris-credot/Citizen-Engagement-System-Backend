const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String
    },
  names: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  bio: {
    type: String
     
  },
  image: {
    type: String
},
address: {type:String},
phoneNumber: { type: String },
dateOfBirth:{ type:Date},
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Please provide a valid email'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['citizen', 'agency', 'admin'],
    default: 'citizen'
  },
  agency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',  // Reference to Agency collection
    required: function() {
      return this.role === 'agency';
    },
    default: null
  },
  otpExpires:{type:String},
  otp: {
    type: String
},
  verified:{type:Boolean,default:false }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method for login
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
};

const User = mongoose.model('User', userSchema);
module.exports = User;
