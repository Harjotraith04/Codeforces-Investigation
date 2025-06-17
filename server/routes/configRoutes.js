const express = require('express');
const router = express.Router();
const {
  getConfig,
  updateConfig,
  forceSyncNow
} = require('../controllers/configController');

router.route('/')
  .get(getConfig)
  .put(updateConfig);

router.route('/sync')
  .post(forceSyncNow);

module.exports = router;
