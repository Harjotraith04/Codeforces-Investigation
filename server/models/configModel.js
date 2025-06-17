const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
  syncSchedule: {
    type: String,
    default: '0 2 * * *', // Default: Every day at 2 AM
    required: true
  },
  lastSync: {
    type: Date
  },
  inactivityThreshold: {
    type: Number,
    default: 7, // Default: 7 days
    required: true
  }
}, {
  timestamps: true
});

// Ensure only one config document exists
configSchema.statics.getConfig = async function() {
  const config = await this.findOne();
  if (config) {
    return config;
  }
  return this.create({});
};

module.exports = mongoose.model('Config', configSchema);
