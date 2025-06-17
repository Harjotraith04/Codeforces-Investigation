import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { format } from 'date-fns';

const StudentList = ({ 
  students, 
  onEdit, 
  onDelete, 
  onToggleEmails,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  totalStudents
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Format the date to a readable string
  const formatDate = (date) => {
    if (!date) return 'Never';
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  // Get rating color based on Codeforces rating
  const getRatingColor = (rating) => {
    if (rating >= 2400) return '#ff0000'; // red
    if (rating >= 2100) return '#ff8c00'; // orange
    if (rating >= 1900) return '#aa00aa'; // purple
    if (rating >= 1600) return '#0000ff'; // blue
    if (rating >= 1400) return '#03a89e'; // cyan
    if (rating >= 1200) return '#008000'; // green
    return '#808080'; // gray
  };

  // Responsive display based on screen size
  const getColumnsToShow = () => {
    if (isMobile) {
      return ['name', 'handle', 'actions'];
    } else if (isMedium) {
      return ['name', 'handle', 'rating', 'lastUpdated', 'actions'];
    }
    return ['name', 'email', 'phone', 'handle', 'rating', 'maxRating', 'lastUpdated', 'emailStatus', 'actions'];
  };

  const columnsToShow = getColumnsToShow();

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table stickyHeader aria-label="students table">
          <TableHead>
            <TableRow>
              {columnsToShow.includes('name') && (
                <TableCell>Name</TableCell>
              )}
              {columnsToShow.includes('email') && (
                <TableCell>Email</TableCell>
              )}
              {columnsToShow.includes('phone') && (
                <TableCell>Phone</TableCell>
              )}
              {columnsToShow.includes('handle') && (
                <TableCell>CF Handle</TableCell>
              )}
              {columnsToShow.includes('rating') && (
                <TableCell>Rating</TableCell>
              )}
              {columnsToShow.includes('maxRating') && (
                <TableCell>Max Rating</TableCell>
              )}
              {columnsToShow.includes('lastUpdated') && (
                <TableCell>Last Updated</TableCell>
              )}
              {columnsToShow.includes('emailStatus') && (
                <TableCell>Email Status</TableCell>
              )}
              {columnsToShow.includes('actions') && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student._id} hover>
                  {columnsToShow.includes('name') && (
                    <TableCell component="th" scope="row">
                      {student.name}
                    </TableCell>
                  )}
                  {columnsToShow.includes('email') && (
                    <TableCell>{student.email}</TableCell>
                  )}
                  {columnsToShow.includes('phone') && (
                    <TableCell>{student.phoneNumber}</TableCell>
                  )}
                  {columnsToShow.includes('handle') && (
                    <TableCell>
                      <a 
                        href={`https://codeforces.com/profile/${student.codeforcesHandle}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: getRatingColor(student.currentRating) }}
                      >
                        {student.codeforcesHandle}
                      </a>
                    </TableCell>
                  )}
                  {columnsToShow.includes('rating') && (
                    <TableCell>
                      <span style={{ color: getRatingColor(student.currentRating) }}>
                        {student.currentRating || 0}
                      </span>
                    </TableCell>
                  )}
                  {columnsToShow.includes('maxRating') && (
                    <TableCell>
                      <span style={{ color: getRatingColor(student.maxRating) }}>
                        {student.maxRating || 0}
                      </span>
                    </TableCell>
                  )}
                  {columnsToShow.includes('lastUpdated') && (
                    <TableCell>
                      {formatDate(student.lastUpdated)}
                    </TableCell>
                  )}
                  {columnsToShow.includes('emailStatus') && (
                    <TableCell>
                      <Chip 
                        size="small" 
                        color={student.disableEmails ? "error" : "success"}
                        label={student.disableEmails ? 
                          "Disabled" : `Enabled (${student.emailsSent || 0} sent)`}
                      />
                    </TableCell>
                  )}
                  {columnsToShow.includes('actions') && (
                    <TableCell align="right">
                      <IconButton 
                        component={Link}
                        to={`/students/${student._id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => onEdit(student)} 
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => onDelete(student._id)} 
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => onToggleEmails(student._id)} 
                        color={student.disableEmails ? "default" : "success"}
                        size="small"
                      >
                        {student.disableEmails ? <NotificationsOffIcon /> : <NotificationsIcon />}
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsToShow.length} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalStudents}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

export default StudentList;
