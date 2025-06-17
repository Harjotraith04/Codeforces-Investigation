const nodemailer = require('nodemailer');
const moment = require('moment');
const Student = require('../models/studentModel');
const CodeforcesData = require('../models/codeforcesDataModel');
const Config = require('../models/configModel');

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send inactivity reminder email
const sendInactivityEmail = async (student) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: 'Reminder: Keep up with your coding practice!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello ${student.name},</h2>
          <p>We noticed that you haven't solved any problems on Codeforces in the past week.</p>
          <p>Consistent practice is key to improving your programming skills. We encourage you to solve at least a few problems this week.</p>
          <br>
          <p>Happy coding!</p>
          <p>Student Progress Management System</p>
          <hr>
          <p style="font-size: 12px; color: #777;">
            If you'd like to opt out of these reminder emails, please contact your instructor or update your preferences in the system.
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${student.email}: ${info.messageId}`);
    
    // Update the email sent counter and date
    student.emailsSent += 1;
    student.lastEmailSentDate = new Date();
    await student.save();
    
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${student.email}:`, error);
    return false;
  }
};

// Check for inactive students and send emails
const checkInactiveStudents = async () => {
  try {
    console.log('Checking for inactive students...');
    
    // Get configuration
    const config = await Config.getConfig();
    const inactivityThreshold = config.inactivityThreshold || 7; // Default 7 days
    
    // Calculate the cutoff date
    const cutoffDate = moment().subtract(inactivityThreshold, 'days').toDate();
    
    // Get all students
    const students = await Student.find({ disableEmails: false });
    let emailsSent = 0;
    
    for (const student of students) {
      const cfData = await CodeforcesData.findOne({ student: student._id });
      
      // Skip if no Codeforces data
      if (!cfData) continue;
      
      // Check for recent submissions
      const recentSubmission = cfData.submissions.find(sub => 
        new Date(sub.submissionTime) >= cutoffDate
      );
      
      // If no recent submissions, send reminder email
      if (!recentSubmission) {
        // Check if we've sent an email in the last 7 days
        const recentEmailSent = student.lastEmailSentDate && 
          moment().diff(moment(student.lastEmailSentDate), 'days') < 7;
          
        if (!recentEmailSent) {
          const emailSent = await sendInactivityEmail(student);
          if (emailSent) emailsSent++;
        }
      }
    }
    
    console.log(`Sent ${emailsSent} inactivity reminder emails`);
    return emailsSent;
  } catch (error) {
    console.error('Error in checkInactiveStudents:', error);
    throw error;
  }
};

module.exports = {
  checkInactiveStudents
};
