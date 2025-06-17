const express = require('express');
const router = express.Router();
const { 
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleEmails
} = require('../controllers/studentController');

const {
  getCodeforcesProfile,
  getContestHistory,
  getProblemSolvingData
} = require('../controllers/codeforcesController');

// Student CRUD routes
router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.route('/:id/toggle-emails')
  .put(toggleEmails);

// Codeforces data routes
router.route('/:id/codeforces')
  .get(getCodeforcesProfile);

router.route('/:id/contests')
  .get(getContestHistory);

router.route('/:id/problems')
  .get(getProblemSolvingData);

module.exports = router;
