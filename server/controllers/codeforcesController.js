const asyncHandler = require('express-async-handler');
const moment = require('moment');
const CodeforcesData = require('../models/codeforcesDataModel');
const Student = require('../models/studentModel');

// @desc    Get student Codeforces profile
// @route   GET /api/students/:id/codeforces
// @access  Public
const getCodeforcesProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const codeforcesData = await CodeforcesData.findOne({ student: student._id });

  if (!codeforcesData) {
    res.status(404);
    throw new Error('Codeforces data not found for this student');
  }

  res.status(200).json(codeforcesData);
});

// @desc    Get student contest history
// @route   GET /api/students/:id/contests
// @access  Public
const getContestHistory = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const daysToFilter = Number(days) || 30; // Default to 30 days if not specified

  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const codeforcesData = await CodeforcesData.findOne({ student: student._id });
  if (!codeforcesData) {
    res.status(404);
    throw new Error('Codeforces data not found for this student');
  }

  const cutoffDate = moment().subtract(daysToFilter, 'days').toDate();
  
  // Filter contests within the requested time period
  const filteredContests = codeforcesData.contests.filter(
    contest => new Date(contest.date) >= cutoffDate
  );

  // Sort by date (most recent first)
  filteredContests.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Prepare rating data for graph
  const ratingData = filteredContests.map(contest => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    date: contest.date,
    newRating: contest.newRating
  })).reverse(); // Reverse to get chronological order for graph

  res.status(200).json({
    handle: codeforcesData.handle,
    rating: codeforcesData.rating,
    maxRating: codeforcesData.maxRating,
    rank: codeforcesData.rank,
    contests: filteredContests,
    ratingData
  });
});

// @desc    Get student problem solving data
// @route   GET /api/students/:id/problems
// @access  Public
const getProblemSolvingData = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const daysToFilter = Number(days) || 30; // Default to 30 days if not specified

  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const codeforcesData = await CodeforcesData.findOne({ student: student._id });
  if (!codeforcesData) {
    res.status(404);
    throw new Error('Codeforces data not found for this student');
  }

  const cutoffDate = moment().subtract(daysToFilter, 'days').toDate();
  
  // Filter accepted submissions within the requested time period
  const acceptedSubmissions = codeforcesData.submissions.filter(
    sub => sub.verdict === 'OK' && new Date(sub.submissionTime) >= cutoffDate
  );

  // Remove duplicate problems (count only first accepted submission for each problem)
  const uniqueProblems = Array.from(
    new Map(
      acceptedSubmissions.map(sub => 
        [`${sub.problem.contestId}-${sub.problem.index}`, sub]
      )
    ).values()
  );

  // Most difficult problem
  const mostDifficultProblem = [...uniqueProblems].sort((a, b) => 
    (b.problem.rating || 0) - (a.problem.rating || 0)
  )[0]?.problem || null;

  // Total problems solved
  const totalProblemsSolved = uniqueProblems.length;

  // Average rating
  const problemsWithRating = uniqueProblems.filter(sub => sub.problem.rating);
  const averageRating = problemsWithRating.length > 0
    ? Math.round(
        problemsWithRating.reduce((sum, sub) => sum + sub.problem.rating, 0) / 
        problemsWithRating.length
      )
    : 0;

  // Average problems per day
  const daysDiff = Math.max(1, moment().diff(moment(cutoffDate), 'days'));
  const averageProblemsPerDay = (totalProblemsSolved / daysDiff).toFixed(2);

  // Problems by rating
  const problemsByRating = {};
  uniqueProblems.forEach(sub => {
    const rating = sub.problem.rating || 0;
    const bucket = Math.floor(rating / 100) * 100;
    problemsByRating[bucket] = (problemsByRating[bucket] || 0) + 1;
  });

  // Submission heatmap data (problems solved per day)
  const submissionHeatmap = {};
  uniqueProblems.forEach(sub => {
    const date = moment(sub.submissionTime).format('YYYY-MM-DD');
    submissionHeatmap[date] = (submissionHeatmap[date] || 0) + 1;
  });

  res.status(200).json({
    mostDifficultProblem,
    totalProblemsSolved,
    averageRating,
    averageProblemsPerDay,
    problemsByRating,
    submissionHeatmap
  });
});

module.exports = {
  getCodeforcesProfile,
  getContestHistory,
  getProblemSolvingData
};
