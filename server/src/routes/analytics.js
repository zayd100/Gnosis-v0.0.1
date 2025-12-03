const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getPerformanceMetrics,
  getMRRTrend
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/performance', protect, getPerformanceMetrics);
router.get('/mrr', protect, authorize('admin'), getMRRTrend);

module.exports = router;