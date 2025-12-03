const Lead = require('../models/Lead');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res) => {
  try {
    let query = {};

    // Role-based filtering
    if (req.user.role === 'warmer') {
      query.assignedWarmer = req.user.id;
    } else if (req.user.role === 'closer') {
      query.assignedCloser = req.user.id;
    }

    // Apply filters from query params
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.tier) {
      query.tier = parseInt(req.query.tier);
    }

    const leads = await Lead.find(query)
      .populate('assignedWarmer', 'name email tier')
      .populate('assignedCloser', 'name email tier')
      .sort({ score: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedWarmer', 'name email tier')
      .populate('assignedCloser', 'name email tier')
      .populate('notes.author', 'name');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check access rights
    if (req.user.role === 'warmer' && lead.assignedWarmer?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this lead'
      });
    }

    if (req.user.role === 'closer' && lead.assignedCloser?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this lead'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private (Admin only)
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    // Log activity
    await Activity.create({
      type: 'lead_assigned',
      user: req.user._id,
      target: lead.name,
      details: 'New lead created',
      relatedLead: lead._id
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check access rights
    if (req.user.role === 'warmer' && lead.assignedWarmer?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    if (req.user.role === 'closer' && lead.assignedCloser?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    // Log status changes
    if (req.body.status && req.body.status !== lead.status) {
      const activityTypes = {
        'hot': 'lead_marked_hot',
        'warm': 'lead_marked_warm',
        'cold': 'lead_marked_cold',
        'scheduled': 'call_scheduled',
        'closed_won': 'deal_closed',
        'closed_lost': 'deal_closed'
      };

      await Activity.create({
        type: activityTypes[req.body.status] || 'lead_assigned',
        user: req.user._id,
        target: lead.name,
        details: `Lead marked as ${req.body.status}`,
        relatedLead: lead._id
      });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Auto-assign leads to warmers and closers
// @route   POST /api/leads/assign
// @access  Private (Admin only)
exports.autoAssignLeads = async (req, res) => {
  try {
    const { prioritizeHighTier } = req.body;

    // Get unassigned leads
    let query = {
      $or: [
        { assignedWarmer: null },
        { assignedCloser: null }
      ]
    };

    const leads = await Lead.find(query).sort(
      prioritizeHighTier ? { tier: 1, score: -1 } : { score: -1 }
    );

    if (leads.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No leads to assign',
        data: []
      });
    }

    // Get available warmers and closers
    const warmers = await User.find({ 
      role: 'warmer',
      status: { $in: ['online', 'away'] }
    }).sort({ performanceScore: -1 });

    const closers = await User.find({ 
      role: 'closer',
      status: { $in: ['online', 'away'] }
    }).sort({ performanceScore: -1 });

    if (warmers.length === 0 || closers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No available warmers or closers'
      });
    }

    const assignments = [];
    let warmerIndex = 0;
    let closerIndex = 0;

    // Assign leads in round-robin fashion (weighted by performance)
    for (const lead of leads) {
      if (!lead.assignedWarmer) {
        lead.assignedWarmer = warmers[warmerIndex % warmers.length]._id;
        warmerIndex++;
      }

      if (!lead.assignedCloser) {
        lead.assignedCloser = closers[closerIndex % closers.length]._id;
        closerIndex++;
      }

      await lead.save();

      // Log activity
      await Activity.create({
        type: 'lead_assigned',
        user: req.user._id,
        target: lead.name,
        details: `Lead assigned to warmer and closer`,
        relatedLead: lead._id
      });

      assignments.push({
        leadId: lead._id,
        leadName: lead.name,
        tier: lead.tier,
        score: lead.score,
        warmer: warmers[warmerIndex % warmers.length].name,
        closer: closers[closerIndex % closers.length].name
      });
    }

    res.status(200).json({
      success: true,
      message: `${assignments.length} leads assigned successfully`,
      data: assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.notes.push({
      author: req.user._id,
      text: req.body.text
    });

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add message to lead conversation
// @route   POST /api/leads/:id/messages
// @access  Private
exports.addMessage = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.messages.push({
      sender: 'user',
      text: req.body.text
    });

    lead.lastContactedAt = Date.now();
    await lead.save();

    // Log activity
    await Activity.create({
      type: 'message_sent',
      user: req.user._id,
      target: lead.name,
      details: 'Message sent to lead',
      relatedLead: lead._id
    });

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};