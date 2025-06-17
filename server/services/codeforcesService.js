const axios = require('axios');
const moment = require('moment');
const Student = require('../models/studentModel');
const CodeforcesData = require('../models/codeforcesDataModel');
const Config = require('../models/configModel');

// Helper function to add delay between API calls to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch user info from Codeforces API
const fetchUserInfo = async (handle) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    
    if (response.data.status === 'OK') {
      return response.data.result[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user info for ${handle}:`, error.message);
    return null;
  }
};

// Fetch user's contest history from Codeforces API
const fetchUserContests = async (handle) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    
    if (response.data.status === 'OK') {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching contests for ${handle}:`, error.message);
    return [];
  }
};

// Fetch user's submissions from Codeforces API
const fetchUserSubmissions = async (handle) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`);
    
    if (response.data.status === 'OK') {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching submissions for ${handle}:`, error.message);
    return [];
  }
};

// Calculate number of unsolved problems in a contest
const calculateUnsolvedProblems = async (handle, contestId) => {
  try {
    // Get all problems in the contest
    const contestResponse = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`);
    
    if (contestResponse.data.status !== 'OK') return 0;
    
    const problems = contestResponse.data.result.problems;
    
    // Get user's submissions in this contest
    const submissions = await fetchUserSubmissions(handle);
    const contestSubmissions = submissions.filter(sub => sub.contestId === contestId);
    
    // Find solved problems in the contest
    const solvedProblems = new Set();
    contestSubmissions.forEach(sub => {
      if (sub.verdict === 'OK') {
        solvedProblems.add(`${sub.problem.index}`);
      }
    });
    
    // Calculate unsolved problems
    return problems.length - solvedProblems.size;
  } catch (error) {
    console.error(`Error calculating unsolved problems for ${handle} in contest ${contestId}:`, error.message);
    return 0;
  }
};

// Fetch and update Codeforces data for a single student
const fetchCodeforcesUserData = async (student, forceUpdate = false) => {
  try {
    const handle = student.codeforcesHandle;
    
    // Check if we need to update data
    let existingData = await CodeforcesData.findOne({ student: student._id });
    const isNewStudent = !existingData;
    
    // If data exists and not forcing update, check if it was updated recently (within 6 hours)
    if (existingData && !forceUpdate && 
        moment().diff(moment(existingData.lastUpdated), 'hours') < 6) {
      return existingData;
    }
    
    console.log(`Fetching Codeforces data for ${handle}...`);
    
    // Fetch user info
    const userInfo = await fetchUserInfo(handle);
    if (!userInfo) {
      throw new Error(`Could not fetch info for ${handle}`);
    }
    
    // Fetch user contests
    const contests = await fetchUserContests(handle);
    
    // Process contest data
    const processedContests = await Promise.all(contests.map(async (contest) => {
      // Add delay to avoid Codeforces API rate limits when calculating unsolved problems
      await delay(500);
      
      const unsolvedProblems = await calculateUnsolvedProblems(
        handle, 
        contest.contestId
      );
      
      return {
        contestId: contest.contestId,
        contestName: contest.contestName,
        rank: contest.rank,
        oldRating: contest.oldRating,
        newRating: contest.newRating,
        ratingChange: contest.newRating - contest.oldRating,
        date: new Date(contest.ratingUpdateTimeSeconds * 1000),
        problemsUnsolved: unsolvedProblems
      };
    }));
    
    // Fetch user submissions
    const submissions = await fetchUserSubmissions(handle);
    
    // Process submission data
    const processedSubmissions = submissions.map(sub => ({
      submissionId: sub.id,
      contestId: sub.contestId,
      problem: {
        contestId: sub.problem.contestId,
        index: sub.problem.index,
        name: sub.problem.name,
        rating: sub.problem.rating,
        tags: sub.problem.tags
      },
      verdict: sub.verdict,
      submissionTime: new Date(sub.creationTimeSeconds * 1000)
    }));
    
    // Create or update Codeforces data
    const cfData = {
      student: student._id,
      handle: handle,
      rating: userInfo.rating || 0,
      maxRating: userInfo.maxRating || 0,
      rank: userInfo.rank || 'unrated',
      contests: processedContests,
      submissions: processedSubmissions,
      lastUpdated: new Date()
    };
    
    if (isNewStudent) {
      await CodeforcesData.create(cfData);
    } else {
      await CodeforcesData.findOneAndUpdate(
        { student: student._id },
        cfData,
        { new: true }
      );
    }
    
    console.log(`Data updated for ${handle}`);
    return cfData;
    
  } catch (error) {
    console.error(`Error updating Codeforces data for ${student.codeforcesHandle}:`, error.message);
    throw error;
  }
};

// Sync Codeforces data for all students
const syncCodeforcesData = async () => {
  try {
    console.log('Starting Codeforces data sync for all students...');
    
    // Update config to record sync time
    const config = await Config.getConfig();
    config.lastSync = new Date();
    await config.save();
    
    // Get all students
    const students = await Student.find({});
    
    // Process students one by one with delay to avoid rate limiting
    for (const student of students) {
      try {
        await fetchCodeforcesUserData(student);
        // Add delay between student processing
        await delay(2000);
      } catch (error) {
        console.error(`Error processing student ${student.name}:`, error.message);
        // Continue with next student even if one fails
        continue;
      }
    }
    
    console.log('Codeforces data sync completed successfully');
    return true;
  } catch (error) {
    console.error('Error in syncCodeforcesData:', error);
    throw error;
  }
};

module.exports = {
  fetchCodeforcesUserData,
  syncCodeforcesData
};
