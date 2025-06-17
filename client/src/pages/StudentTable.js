import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  ButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import axios from 'axios';

import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [syncLoading, setSyncLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/students');
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open form for adding a new student
  const handleAddClick = () => {
    setStudentToEdit(null);
    setFormOpen(true);
  };

  // Open form for editing a student
  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (studentId) => {
    setStudentToDelete(studentId);
    setDeleteDialogOpen(true);
  };

  // Handle form submission (add or edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (studentToEdit) {
        // Update existing student
        await axios.put(`/api/students/${studentToEdit._id}`, formData);
        setAlert({ 
          open: true, 
          message: 'Student updated successfully', 
          severity: 'success' 
        });
      } else {
        // Create new student
        await axios.post('/api/students', formData);
        setAlert({ 
          open: true, 
          message: 'Student added successfully', 
          severity: 'success' 
        });
      }
      // Refresh student list
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      setAlert({ 
        open: true, 
        message: `Error: ${err.response?.data?.message || 'Failed to save student'}`, 
        severity: 'error' 
      });
    }
  };

  // Handle student deletion
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/students/${studentToDelete}`);
      setAlert({ 
        open: true, 
        message: 'Student deleted successfully', 
        severity: 'success' 
      });
      setDeleteDialogOpen(false);
      fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      setAlert({ 
        open: true, 
        message: 'Failed to delete student', 
        severity: 'error' 
      });
    }
  };

  // Handle toggle email notifications
  const handleToggleEmails = async (studentId) => {
    try {
      await axios.put(`/api/students/${studentId}/toggle-emails`);
      setAlert({ 
        open: true, 
        message: 'Email notification settings updated', 
        severity: 'success' 
      });
      fetchStudents();
    } catch (err) {
      console.error('Error updating email settings:', err);
      setAlert({ 
        open: true, 
        message: 'Failed to update email settings', 
        severity: 'error' 
      });
    }
  };

  // Force sync Codeforces data
  const handleForceSync = async () => {
    try {
      setSyncLoading(true);
      await axios.post('/api/config/sync');
      setAlert({ 
        open: true, 
        message: 'Codeforces data sync started', 
        severity: 'info' 
      });
      // Wait a bit before refreshing to give time for the sync to start
      setTimeout(() => {
        fetchStudents();
        setSyncLoading(false);
      }, 2000);
    } catch (err) {
      console.error('Error starting sync:', err);
      setAlert({ 
        open: true, 
        message: 'Failed to start sync', 
        severity: 'error' 
      });
      setSyncLoading(false);
    }
  };

  // Prepare CSV data for export
  const csvData = [
    ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Updated'],
    ...students.map(student => [
      student.name,
      student.email,
      student.phoneNumber,
      student.codeforcesHandle,
      student.currentRating,
      student.maxRating,
      student.lastUpdated ? format(new Date(student.lastUpdated), 'yyyy-MM-dd HH:mm:ss') : 'Never'
    ])
  ];

  // Close alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Student Manager
            </Typography>
          </Grid>
          <Grid item>
            <ButtonGroup variant="contained">
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddClick}
                color="primary"
              >
                Add Student
              </Button>
              <CSVLink 
                data={csvData} 
                filename={`students_${format(new Date(), 'yyyy-MM-dd')}.csv`}
                style={{ textDecoration: 'none' }}
              >
                <Button 
                  startIcon={<FileDownloadIcon />} 
                  color="primary"
                  variant="contained"
                  sx={{ ml: 1 }}
                >
                  Export CSV
                </Button>
              </CSVLink>
              <Button 
                startIcon={<RefreshIcon />} 
                onClick={handleForceSync}
                color="secondary"
                disabled={syncLoading}
                sx={{ ml: 1 }}
              >
                {syncLoading ? <CircularProgress size={24} color="inherit" /> : 'Force Sync'}
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, backgroundColor: '#fff3f3' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={fetchStudents}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Paper>
        ) : (
          <StudentList 
            students={students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onToggleEmails={handleToggleEmails}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            totalStudents={students.length}
          />
        )}
      </Box>

      {/* Add/Edit Student Form Dialog */}
      <StudentForm 
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        initialValues={studentToEdit}
        onSubmit={handleFormSubmit}
        title={studentToEdit ? 'Edit Student' : 'Add Student'}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student? This will remove all their Codeforces data as well and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StudentTable;
