import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Paper,
  useTheme 
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProblemStats = ({ stats }) => {
  const theme = useTheme();
  
  // Prepare data for rating distribution chart
  const prepareRatingChartData = () => {
    const ratings = Object.keys(stats.problemsByRating).sort((a, b) => Number(a) - Number(b));
    const counts = ratings.map(rating => stats.problemsByRating[rating]);
    
    // Get colors based on rating
    const backgroundColors = ratings.map(rating => {
      const r = Number(rating);
      if (r >= 2400) return 'rgba(255, 0, 0, 0.7)'; // red
      if (r >= 2100) return 'rgba(255, 140, 0, 0.7)'; // orange
      if (r >= 1900) return 'rgba(170, 0, 170, 0.7)'; // purple
      if (r >= 1600) return 'rgba(0, 0, 255, 0.7)'; // blue
      if (r >= 1400) return 'rgba(3, 168, 158, 0.7)'; // cyan
      if (r >= 1200) return 'rgba(0, 128, 0, 0.7)'; // green
      return 'rgba(128, 128, 128, 0.7)'; // gray
    });
    
    // Convert 0 rating to "Unrated"
    const labels = ratings.map(r => r === '0' ? 'Unrated' : r);
    
    return {
      labels,
      datasets: [{
        label: 'Problems Solved',
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: theme.palette.divider,
        borderWidth: 1
      }]
    };
  };
  
  const chartData = prepareRatingChartData();
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const rating = tooltipItems[0].label;
            return rating === 'Unrated' ? 'Unrated' : `Rating: ${rating}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.primary,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.primary,
          precision: 0
        }
      }
    }
  };
  
  // Get color for the most difficult problem
  const getMostDifficultColor = () => {
    const rating = stats.mostDifficultProblem?.rating;
    if (!rating) return theme.palette.text.primary;
    
    if (rating >= 2400) return '#ff0000'; // red
    if (rating >= 2100) return '#ff8c00'; // orange
    if (rating >= 1900) return '#aa00aa'; // purple
    if (rating >= 1600) return '#0000ff'; // blue
    if (rating >= 1400) return '#03a89e'; // cyan
    if (rating >= 1200) return '#008000'; // green
    return '#808080'; // gray
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Problem Solving Statistics
        </Typography>
        
        <Grid container spacing={2}>
          {/* Key metrics */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Problems Solved
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalProblemsSolved}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Rating
                  </Typography>
                  <Typography variant="h5">
                    {stats.averageRating || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Problems Per Day
                  </Typography>
                  <Typography variant="h5">
                    {stats.averageProblemsPerDay}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Hardest Problem
                  </Typography>
                  <Typography variant="h5" style={{ color: getMostDifficultColor() }}>
                    {stats.mostDifficultProblem ? stats.mostDifficultProblem.rating : 'N/A'}
                  </Typography>
                  <Typography variant="caption" noWrap>
                    {stats.mostDifficultProblem ? stats.mostDifficultProblem.name : ''}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Rating distribution chart */}
          <Grid item xs={12}>
            <Box sx={{ height: { xs: '250px', md: '300px' } }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProblemStats;
