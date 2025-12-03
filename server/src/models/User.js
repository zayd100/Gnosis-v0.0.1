const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'warmer', 'closer'],
    default: 'warmer'
  },
  tier: {
    type: String,
    enum: ['W1', 'W2', 'W3', 'C1', 'C2', 'C3', null],
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'away', 'offline'],
    default: 'offline'
  },
  phone: {
    type: String,
    default: null
  },
  // Performance metrics
  performanceScore: {
    type: Number,
    default: 0
  },
  leadsHandled: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  avgDealSize: {
    type: Number,
    default: 0
  },
  referrals: {
    type: Number,
    default: 0
  },
  // Availability
  availableHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '17:00' }
  },
  timezone: {
    type: String,
    default: 'EST'
  },
  // Notifications settings
  notifications: {
    newLeadAssignments: { type: Boolean, default: true },
    leadResponses: { type: Boolean, default: true },
    performanceReports: { type: Boolean, default: false },
    trainingUpdates: { type: Boolean, default: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);