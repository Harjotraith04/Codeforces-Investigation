const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const { sendInactivityEmail } = require('../services/emailService');

// @desc    Test sending inactivity email to a specific student
// @route   POST /api/test/email/:id
// @access  Public
const testInactivityEmail = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  try {
    const emailSent = await sendInactivityEmail(student);
      if (emailSent) {
      // Check if we're using Ethereal (in which case we'll have a preview URL in the console)
      const response = {
        success: true, 
        message: `Test email sent successfully to ${student.email}`,
        emailsSent: student.emailsSent,
        lastEmailSentDate: student.lastEmailSentDate,
        emailContent: {
          subject: 'Reminder: Keep up with your coding practice!',
          preview: `Hello ${student.name}, We noticed that you haven't solved any problems on Codeforces in the past week...`
        }
      };

      // Include a note about Ethereal if we're using it
      if (process.env.USE_ETHEREAL === 'true') {
        response.note = "Using Ethereal test email - check server console for preview URL";
      }

      res.status(200).json(response);
    } else {
      res.status(500);
      throw new Error(`Failed to send test email to ${student.email}`);
    }
  } catch (error) {
    res.status(500);
    throw new Error(`Error sending test email: ${error.message}`);
  }
});

module.exports = {
  testInactivityEmail
};
