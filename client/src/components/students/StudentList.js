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
    <Paper 
      elevation={0}
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <TableContainer sx={{ borderRadius: '12px' }}>
        <Table stickyHeader aria-label="students table">
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[900] 
                : theme.palette.grey[50],
              '& th': { 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '0.875rem',
                borderBottom: `2px solid ${theme.palette.divider}`
              }
            }}>
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
              students.map((student, index) => (
                <TableRow 
                  key={student._id} 
                  hover
                  sx={{ 
                    transition: 'all 0.2s',
                    backgroundColor: index % 2 === 0 
                      ? 'transparent' 
                      : theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(0, 0, 0, 0.01)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.04)',
                      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
                    },
                    '& td': {
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }
                  }}
                >
                  {columnsToShow.includes('name') && (
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {student.name}
                    </TableCell>
                  )}
                  {columnsToShow.includes('email') && (
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{student.email}</TableCell>
                  )}
                  {columnsToShow.includes('phone') && (
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{student.phoneNumber}</TableCell>
                  )}
                  {columnsToShow.includes('handle') && (
                    <TableCell>
                      <Box 
                        component="a" 
                        href={`https://codeforces.com/profile/${student.codeforcesHandle}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          color: getRatingColor(student.currentRating),
                          fontWeight: 500,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        {student.codeforcesHandle}
                      </Box>
                    </TableCell>
                  )}
                  {columnsToShow.includes('rating') && (
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${getRatingColor(student.currentRating)}22`,
                        color: getRatingColor(student.currentRating),
                        fontWeight: 600,
                        borderRadius: '4px',
                        px: 1.5,
                        py: 0.5,
                        minWidth: '60px',
                        textAlign: 'center'                      }}>
                        {student.currentRating || 0}
                      </Box>
                    </TableCell>
                  )}
                  {columnsToShow.includes('maxRating') && (
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${getRatingColor(student.maxRating)}22`,
                        color: getRatingColor(student.maxRating),
                        fontWeight: 600,
                        borderRadius: '4px',
                        px: 1.5,
                        py: 0.5,
                        minWidth: '60px',
                        textAlign: 'center'                      }}>
                        {student.maxRating || 0}
                      </Box>
                    </TableCell>
                  )}
                  {columnsToShow.includes('lastUpdated') && (
                    <TableCell sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                      {formatDate(student.lastUpdated)}
                    </TableCell>
                  )}                  {columnsToShow.includes('emailStatus') && (
                    <TableCell>
                      {!student.disableEmails ? (
                        <Chip 
                          size="small" 
                          label="Enabled" 
                          color="success" 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                          }} 
                        />
                      ) : (
                        <Chip 
                          size="small" 
                          label="Disabled" 
                          color="default" 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }} 
                        />
                      )}                    </TableCell>
                  )}
                  {columnsToShow.includes('actions') && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <IconButton 
                          component={Link}
                          to={`/students/${student._id}`}
                          color="primary"
                          size="small"
                          sx={{ 
                            color: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}10`,
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.main}20`
                            }
                          }}
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
                      </Box>
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
