const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const CodeforcesData = require('../models/codeforcesDataModel');
const { fetchCodeforcesUserData } = require('../services/codeforcesService');

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).sort({ name: 1 });

  // Get Codeforces data for each student
  const studentsWithCFData = await Promise.all(
    students.map(async (student) => {
      const cfData = await CodeforcesData.findOne({ student: student._id });
      
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        codeforcesHandle: student.codeforcesHandle,
        disableEmails: student.disableEmails,
        emailsSent: student.emailsSent,
        currentRating: cfData ? cfData.rating : 0,
        maxRating: cfData ? cfData.maxRating : 0,
        lastUpdated: cfData ? cfData.lastUpdated : null,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
      };
    })
  );

  res.status(200).json(studentsWithCFData);
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const cfData = await CodeforcesData.findOne({ student: student._id });

  const studentWithCFData = {
    _id: student._id,
    name: student.name,
    email: student.email,
    phoneNumber: student.phoneNumber,
    codeforcesHandle: student.codeforcesHandle,
    disableEmails: student.disableEmails,
    emailsSent: student.emailsSent,
    cfData: cfData || null,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  };

  res.status(200).json(studentWithCFData);
});

// @desc    Create a student
// @route   POST /api/students
// @access  Public
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, codeforcesHandle } = req.body;

  if (!name || !email || !phoneNumber || !codeforcesHandle) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if student with email or CF handle exists
  const studentExists = await Student.findOne({ 
    $or: [
      { email },
      { codeforcesHandle }
    ]
  });

  if (studentExists) {
    res.status(400);
    throw new Error('Student with this email or Codeforces handle already exists');
  }

  // Create student
  const student = await Student.create({
    name,
    email,
    phoneNumber,
    codeforcesHandle
  });

  if (student) {
    // Fetch Codeforces data for the new student
    try {
      await fetchCodeforcesUserData(student);
      res.status(201).json(student);
    } catch (error) {
      res.status(201).json({ 
        ...student._doc, 
        cfError: 'Could not fetch Codeforces data. Will try again during next sync.' 
      });
    }
  } else {
    res.status(400);
    throw new Error('Invalid student data');
  }
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const oldHandle = student.codeforcesHandle;
  const newHandle = req.body.codeforcesHandle;
  const handleChanged = newHandle && oldHandle !== newHandle;

  // Update student data
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  // If Codeforces handle was changed, fetch new data
  if (handleChanged) {
    try {
      await fetchCodeforcesUserData(updatedStudent, true); // Force update
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(200).json({ 
        ...updatedStudent._doc, 
        cfError: 'Could not fetch new Codeforces data. Will try again during next sync.' 
      });
    }
  } else {
    res.status(200).json(updatedStudent);
  }
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Delete student's Codeforces data first
  await CodeforcesData.deleteMany({ student: student._id });

  // Then delete the student
  await student.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Toggle email notifications for a student
// @route   PUT /api/students/:id/toggle-emails
// @access  Public
const toggleEmails = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  student.disableEmails = !student.disableEmails;
  await student.save();

  res.status(200).json({ 
    id: student._id, 
    disableEmails: student.disableEmails 
  });
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleEmails
};
