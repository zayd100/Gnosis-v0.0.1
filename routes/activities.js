const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  getRecentActivities
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getActivities)
  .post(protect, createActivity);

router.get('/recent', protect, getRecentActivities);

module.exports = router;