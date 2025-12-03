const Activity = require('../models/Activity');

// @desc    Get activity log
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    let query = {};

    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by user if provided
    if (req.query.user) {
      query.user = req.query.user;
    }

    // Filter by search query (target field)
    if (req.query.search) {
      query.target = { $regex: req.query.search, $options: 'i' };
    }

    // Role-based filtering - non-admins only see their own activities
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const activities = await Activity.find(query)
      .populate('user', 'name email role')
      .populate('relatedLead', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create activity log
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const activity = await Activity.create(req.body);

    const populatedActivity = await Activity.findById(activity._id)
      .populate('user', 'name email role')
      .populate('relatedLead', 'name email');

    res.status(201).json({
      success: true,
      data: populatedActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/activities/recent
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const activities = await Activity.find(query)
      .populate('user', 'name email role')
      .populate('relatedLead', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};