const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'lead_assigned',
      'call_scheduled',
      'deal_closed',
      'lead_responded',
      'call_completed',
      'lead_marked_hot',
      'lead_marked_warm',
      'lead_marked_cold',
      'message_sent',
      'task_created',
      'task_completed',
      'user_login',
      'user_logout'
    ],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  target: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    required: true
  },
  relatedLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1 });
activitySchema.index({ user: 1 });

module.exports = mongoose.model('Activity', activitySchema);