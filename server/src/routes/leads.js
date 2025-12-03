const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  autoAssignLeads,
  addNote,
  addMessage
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getLeads)
  .post(protect, authorize('admin'), createLead);

router.post('/assign', protect, authorize('admin'), autoAssignLeads);

router.route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, authorize('admin'), deleteLead);

router.post('/:id/notes', protect, addNote);
router.post('/:id/messages', protect, addMessage);

module.exports = router;