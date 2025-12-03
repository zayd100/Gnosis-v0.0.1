const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a lead name']
  },
  email: {
    type: String,
    required: [true, 'Please provide a lead email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    default: null
  },
  tier: {
    type: Number,
    enum: [1, 2, 3],
    required: [true, 'Please provide a tier'],
    default: 3
  },
  score: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  status: {
    type: String,
    enum: ['hot', 'warm', 'cold', 'contacted', 'scheduled', 'closed_won', 'closed_lost'],
    default: 'cold'
  },
  // Assignment tracking
  assignedWarmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedCloser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Lead intelligence
  intent: {
    type: String,
    default: '--'
  },
  responseSpeed: {
    type: String,
    default: '--'
  },
  lastContactedAt: {
    type: Date,
    default: null
  },
  // Deal information
  estimatedValue: {
    type: Number,
    default: null
  },
  probability: {
    type: String,
    default: null
  },
  stage: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'demo', 'proposal', 'negotiation', 'closed'],
    default: 'new'
  },
  // Call scheduling
  scheduledCallTime: {
    type: Date,
    default: null
  },
  // Notes and conversation
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'lead']
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Source tracking
  source: {
    type: String,
    default: 'manual'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
leadSchema.index({ status: 1, tier: 1, score: -1 });
leadSchema.index({ assignedWarmer: 1 });
leadSchema.index({ assignedCloser: 1 });

module.exports = mongoose.model('Lead', leadSchema);