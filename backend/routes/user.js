const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.route('/preferences')
  .get(protect, getPreferences)
  .put(protect, updatePreferences);

module.exports = router;
