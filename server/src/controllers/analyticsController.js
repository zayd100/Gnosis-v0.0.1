const Lead = require('../models/Lead');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    let analytics = {};

    if (req.user.role === 'admin') {
      // Admin dashboard stats
      const totalLeads = await Lead.countDocuments();
      const hotLeads = await Lead.countDocuments({ status: 'hot' });
      const scheduledCalls = await Lead.countDocuments({ status: 'scheduled' });
      const closedWon = await Lead.countDocuments({ status: 'closed_won' });

      // Calculate MRR (sum of closed won deals)
      const closedDeals = await Lead.find({ status: 'closed_won' });
      const mrr = closedDeals.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

      // Get unassigned leads
      const unassignedLeads = await Lead.countDocuments({
        $or: [
          { assignedWarmer: null },
          { assignedCloser: null }
        ]
      });

      // Team stats
      const totalWarmers = await User.countDocuments({ role: 'warmer' });
      const totalClosers = await User.countDocuments({ role: 'closer' });
      const onlineWarmers = await User.countDocuments({ role: 'warmer', status: 'online' });
      const onlineClosers = await User.countDocuments({ role: 'closer', status: 'online' });

      analytics = {
        leads: {
          total: totalLeads,
          hot: hotLeads,
          scheduled: scheduledCalls,
          closed: closedWon,
          unassigned: unassignedLeads
        },
        revenue: {
          mrr,
          estimatedMrr: mrr
        },
        team: {
          warmers: {
            total: totalWarmers,
            online: onlineWarmers
          },
          closers: {
            total: totalClosers,
            online: onlineClosers
          }
        }
      };
    } else if (req.user.role === 'warmer') {
      // Warmer dashboard stats
      const myLeads = await Lead.countDocuments({ assignedWarmer: req.user.id });
      const hotLeads = await Lead.countDocuments({ assignedWarmer: req.user.id, status: 'hot' });
      const warmLeads = await Lead.countDocuments({ assignedWarmer: req.user.id, status: 'warm' });
      const coldLeads = await Lead.countDocuments({ assignedWarmer: req.user.id, status: 'cold' });
      const scheduledCalls = await Lead.countDocuments({ assignedWarmer: req.user.id, status: 'scheduled' });

      // Response rate calculation
      const contactedLeads = await Lead.countDocuments({ 
        assignedWarmer: req.user.id,
        lastContactedAt: { $ne: null }
      });
      const responseRate = myLeads > 0 ? Math.round((contactedLeads / myLeads) * 100) : 0;

      analytics = {
        leads: {
          total: myLeads,
          hot: hotLeads,
          warm: warmLeads,
          cold: coldLeads,
          scheduled: scheduledCalls
        },
        performance: {
          responseRate,
          score: req.user.performanceScore,
          leadsPerDay: req.user.leadsHandled
        }
      };
    } else if (req.user.role === 'closer') {
      // Closer dashboard stats
      const myLeads = await Lead.countDocuments({ assignedCloser: req.user.id });
      const scheduledCalls = await Lead.countDocuments({ 
        assignedCloser: req.user.id, 
        status: 'scheduled'
      });
      const activePipeline = await Lead.countDocuments({ 
        assignedCloser: req.user.id,
        status: { $in: ['contacted', 'qualified', 'demo', 'proposal', 'negotiation'] }
      });
      const closedWon = await Lead.countDocuments({ 
        assignedCloser: req.user.id,
        status: 'closed_won'
      });
      const closedLost = await Lead.countDocuments({ 
        assignedCloser: req.user.id,
        status: 'closed_lost'
      });

      // Calculate pipeline value
      const pipelineLeads = await Lead.find({ 
        assignedCloser: req.user.id,
        status: { $in: ['contacted', 'qualified', 'demo', 'proposal', 'negotiation'] }
      });
      const pipelineValue = pipelineLeads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

      // Conversion rate
      const totalClosed = closedWon + closedLost;
      const conversionRate = totalClosed > 0 
        ? Math.round((closedWon / totalClosed) * 100) 
        : 0;

      analytics = {
        leads: {
          total: myLeads,
          scheduled: scheduledCalls,
          activePipeline,
          closedWon,
          closedLost
        },
        performance: {
          conversionRate,
          pipelineValue,
          avgDealSize: req.user.avgDealSize,
          score: req.user.performanceScore
        }
      };
    }

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    // Check if user has permission to view these metrics
    if (req.user.role !== 'admin' && userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these metrics'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get weekly activity data (mock data for now - would need date-based queries)
    const weeklyActivity = [65, 72, 58, 81, 69, 75, 88];

    // Get lead status breakdown
    let leadStats = {};
    if (user.role === 'warmer') {
      const hot = await Lead.countDocuments({ assignedWarmer: userId, status: 'hot' });
      const warm = await Lead.countDocuments({ assignedWarmer: userId, status: 'warm' });
      const cold = await Lead.countDocuments({ assignedWarmer: userId, status: 'cold' });
      leadStats = { hot, warm, cold };
    } else if (user.role === 'closer') {
      const scheduled = await Lead.countDocuments({ assignedCloser: userId, status: 'scheduled' });
      const activePipeline = await Lead.countDocuments({ 
        assignedCloser: userId,
        status: { $in: ['contacted', 'qualified', 'demo', 'proposal', 'negotiation'] }
      });
      const closed = await Lead.countDocuments({ 
        assignedCloser: userId,
        status: { $in: ['closed_won', 'closed_lost'] }
      });
      leadStats = { scheduled, activePipeline, closed };
    }

    // Get recent activities
    const recentActivities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('relatedLead', 'name');

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          role: user.role,
          tier: user.tier,
          performanceScore: user.performanceScore
        },
        weeklyActivity,
        leadStats,
        recentActivities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get MRR trend data
// @route   GET /api/analytics/mrr
// @access  Private (Admin only)
exports.getMRRTrend = async (req, res) => {
  try {
    // Mock MRR data for 7 days
    // In production, this would query actual historical data
    const mrrData = [
      { day: 'D-6', value: 40000 },
      { day: 'D-5', value: 55000 },
      { day: 'D-4', value: 62000 },
      { day: 'D-3', value: 72000 },
      { day: 'D-2', value: 85000 },
      { day: 'D-1', value: 92000 },
      { day: 'Today', value: 95000 }
    ];

    res.status(200).json({
      success: true,
      data: mrrData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};