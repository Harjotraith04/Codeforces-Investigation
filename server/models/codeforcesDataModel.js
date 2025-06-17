const mongoose = require('mongoose');

const codeforcesDataSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  },
  handle: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  rank: {
    type: String
  },
  contests: [
    {
      contestId: Number,
      contestName: String,
      rank: Number,
      oldRating: Number,
      newRating: Number,
      ratingChange: Number,
      date: Date,
      problemsUnsolved: {
        type: Number,
        default: 0
      }
    }
  ],
  submissions: [
    {
      submissionId: Number,
      contestId: Number,
      problem: {
        contestId: Number,
        index: String,
        name: String,
        rating: Number,
        tags: [String]
      },
      verdict: String,
      submissionTime: Date
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodeforcesData', codeforcesDataSchema);
