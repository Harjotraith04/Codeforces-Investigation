const express = require('express');
const router = express.Router();
const { testInactivityEmail } = require('../controllers/testController');

// Test routes
router.route('/email/:id').post(testInactivityEmail);

module.exports = router;
