const asyncHandler = require('express-async-handler');
const Config = require('../models/configModel');
const { updateSyncSchedule } = require('../server');
const { syncCodeforcesData } = require('../services/codeforcesService');

// @desc    Get current configuration
// @route   GET /api/config
// @access  Public
const getConfig = asyncHandler(async (req, res) => {
  const config = await Config.getConfig();
  res.status(200).json(config);
});

// @desc    Update configuration
// @route   PUT /api/config
// @access  Public
const updateConfig = asyncHandler(async (req, res) => {
  const config = await Config.getConfig();
  
  if (req.body.syncSchedule) {
    const scheduleUpdated = updateSyncSchedule(req.body.syncSchedule);
    if (!scheduleUpdated) {
      res.status(400);
      throw new Error('Invalid cron schedule expression');
    }
    config.syncSchedule = req.body.syncSchedule;
  }

  if (req.body.inactivityThreshold) {
    config.inactivityThreshold = req.body.inactivityThreshold;
  }

  await config.save();
  res.status(200).json(config);
});

// @desc    Force sync Codeforces data now
// @route   POST /api/config/sync
// @access  Public
const forceSyncNow = asyncHandler(async (req, res) => {
  const config = await Config.getConfig();

  // Start the sync process asynchronously
  syncCodeforcesData()
    .then(() => {
      console.log('Forced Codeforces data sync completed successfully');
      config.lastSync = new Date();
      return config.save();
    })
    .catch(err => console.error('Error in forced Codeforces sync:', err));

  // Respond immediately to the request
  res.status(200).json({ message: 'Codeforces data sync started' });
});

module.exports = {
  getConfig,
  updateConfig,
  forceSyncNow
};
