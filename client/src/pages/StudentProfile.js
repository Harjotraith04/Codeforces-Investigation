import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Button,
  ButtonGroup,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

// Components
import RatingChart from '../components/codeforces/RatingChart';
import ContestList from '../components/codeforces/ContestList';
import ProblemStats from '../components/codeforces/ProblemStats';
import SubmissionHeatmap from '../components/codeforces/SubmissionHeatmap';
import UserRatingCard from '../components/codeforces/UserRatingCard';

const StudentProfile = () => {
  const { id } = useParams();
  const theme = useTheme();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [contestFilter, setContestFilter] = useState(90); // Default 90 days
  const [problemFilter, setProblemFilter] = useState(30); // Default 30 days
  const [contestData, setContestData] = useState({ contests: [], ratingData: [] });
  const [problemData, setProblemData] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [loadingContests, setLoadingContests] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/students/${id}`);
        setStudent(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to fetch student data');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // Fetch contest data based on filter
  useEffect(() => {
    const fetchContests = async () => {
      if (!student) return;
      
      try {
        setLoadingContests(true);
        const response = await axios.get(`/api/students/${id}/contests?days=${contestFilter}`);
        setContestData(response.data);
        setLoadingContests(false);
      } catch (err) {
        console.error('Error fetching contests:', err);
        setAlert({ 
          open: true, 
          message: 'Failed to load contest data', 
          severity: 'error' 
        });
        setLoadingContests(false);
      }
    };

    fetchContests();
  }, [id, student, contestFilter]);

  // Fetch problem data based on filter
  useEffect(() => {
    const fetchProblems = async () => {
      if (!student) return;
      
      try {
        setLoadingProblems(true);
        const response = await axios.get(`/api/students/${id}/problems?days=${problemFilter}`);
        setProblemData(response.data);
        setLoadingProblems(false);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setAlert({ 
          open: true, 
          message: 'Failed to load problem data', 
          severity: 'error' 
        });
        setLoadingProblems(false);
      }
    };

    fetchProblems();
  }, [id, student, problemFilter]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle contest filter change
  const handleContestFilterChange = (days) => {
    setContestFilter(days);
  };

  // Handle problem filter change
  const handleProblemFilterChange = (days) => {
    setProblemFilter(days);
  };

  // Close alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  // Get color for rating
  const getRatingColor = (rating) => {
    if (!rating) return theme.palette.text.primary;
    if (rating >= 2400) return '#ff0000'; // red
    if (rating >= 2100) return '#ff8c00'; // orange
    if (rating >= 1900) return '#aa00aa'; // purple
    if (rating >= 1600) return '#0000ff'; // blue
    if (rating >= 1400) return '#03a89e'; // cyan
    if (rating >= 1200) return '#008000'; // green
    return '#808080'; // gray
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography color="error" variant="h5">{error}</Typography>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<ArrowBackIcon />} 
            sx={{ mt: 2 }}
          >
            Back to Student List
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button 
          component={Link} 
          to="/" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 3 }}
        >
          Back to Student List
        </Button>
        
        <Grid container spacing={3}>
          {/* Student Profile Header */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="h1">
                    {student.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {student.email} | {student.phoneNumber}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">
                      Codeforces:
                    </Typography>
                    <Typography 
                      component="a" 
                      href={`https://codeforces.com/profile/${student.codeforcesHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body1"
                      sx={{ 
                        color: getRatingColor(student.cfData?.rating),
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {student.codeforcesHandle}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">Current Rating:</Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 'bold', color: getRatingColor(student.cfData?.rating) }}
                      >
                        {student.cfData?.rating || 'Unrated'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">Max Rating:</Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 'bold', color: getRatingColor(student.cfData?.maxRating) }}
                      >
                        {student.cfData?.maxRating || 'Unrated'}
                      </Typography>
                    </Box>
                    {student.cfData?.rank && (
                      <Typography variant="body1">
                        Rank: {student.cfData.rank}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Tabs */}
          <Grid item xs={12}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="student data tabs"
            >
              <Tab label="Contest History" />
              <Tab label="Problem Solving" />
            </Tabs>
          </Grid>          {/* Contest History Tab */}
          {tabValue === 0 && (
            <>
              <Grid item xs={12} md={4}>
                <UserRatingCard 
                  handle={contestData.handle} 
                  rating={contestData.rating} 
                  maxRating={contestData.maxRating}
                  loading={loadingContests}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ButtonGroup variant="outlined">
                    <Button
                      onClick={() => handleContestFilterChange(30)}
                      color={contestFilter === 30 ? 'primary' : 'inherit'}
                      variant={contestFilter === 30 ? 'contained' : 'outlined'}
                    >
                      30 Days
                    </Button>
                    <Button
                      onClick={() => handleContestFilterChange(90)}
                      color={contestFilter === 90 ? 'primary' : 'inherit'}
                      variant={contestFilter === 90 ? 'contained' : 'outlined'}
                    >
                      90 Days
                    </Button>
                    <Button
                      onClick={() => handleContestFilterChange(365)}
                      color={contestFilter === 365 ? 'primary' : 'inherit'}
                      variant={contestFilter === 365 ? 'contained' : 'outlined'}
                    >
                      365 Days
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                {loadingContests ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <RatingChart ratingData={contestData.ratingData || []} />
                )}
              </Grid>
              
              <Grid item xs={12}>
                {loadingContests ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <ContestList contests={contestData.contests || []} />
                )}
              </Grid>
            </>
          )}

          {/* Problem Solving Tab */}
          {tabValue === 1 && (
            <>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ButtonGroup variant="outlined">
                    <Button
                      onClick={() => handleProblemFilterChange(7)}
                      color={problemFilter === 7 ? 'primary' : 'inherit'}
                      variant={problemFilter === 7 ? 'contained' : 'outlined'}
                    >
                      7 Days
                    </Button>
                    <Button
                      onClick={() => handleProblemFilterChange(30)}
                      color={problemFilter === 30 ? 'primary' : 'inherit'}
                      variant={problemFilter === 30 ? 'contained' : 'outlined'}
                    >
                      30 Days
                    </Button>
                    <Button
                      onClick={() => handleProblemFilterChange(90)}
                      color={problemFilter === 90 ? 'primary' : 'inherit'}
                      variant={problemFilter === 90 ? 'contained' : 'outlined'}
                    >
                      90 Days
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                {loadingProblems ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <ProblemStats stats={problemData} />
                )}
              </Grid>
              
              <Grid item xs={12}>
                {loadingProblems ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <SubmissionHeatmap submissions={problemData.submissionHeatmap} />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      
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

export default StudentProfile;
