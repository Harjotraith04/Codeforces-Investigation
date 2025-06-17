require('dotenv').config();
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { syncCodeforcesData } = require('./services/codeforcesService');
const { checkInactiveStudents } = require('./services/emailService');

// Routes
const studentRoutes = require('./routes/studentRoutes');
const configRoutes = require('./routes/configRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Schedule Codeforces data sync - default at 2 AM
// This can be configured via the config API
const defaultSchedule = '0 2 * * *'; // Every day at 2 AM
let syncSchedule = process.env.SYNC_SCHEDULE || defaultSchedule;

// Initialize cron job
let syncJob = cron.schedule(syncSchedule, async () => {
  console.log('Running Codeforces data sync...'.yellow.bold);
  await syncCodeforcesData();
  
  // Check for inactive students after sync
  await checkInactiveStudents();
}, {
  scheduled: true,
  timezone: "UTC"
});

// Start the cron job
syncJob.start();

// Update sync schedule function (can be called from config API)
const updateSyncSchedule = (newSchedule) => {
  try {
    syncJob.stop();
    syncJob = cron.schedule(newSchedule, async () => {
      console.log('Running Codeforces data sync...'.yellow.bold);
      await syncCodeforcesData();
      await checkInactiveStudents();
    }, {
      scheduled: true,
      timezone: "UTC"
    });
    syncJob.start();
    syncSchedule = newSchedule;
    return true;
  } catch (error) {
    console.error(`Error updating sync schedule: ${error}`.red.bold);
    return false;
  }
};

// Make updateSyncSchedule available to other modules
module.exports.updateSyncSchedule = updateSyncSchedule;

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.bold);
});
