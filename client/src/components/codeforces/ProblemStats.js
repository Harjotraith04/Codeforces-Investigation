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
  
  const chartData = prepareRatingChartData();  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
        bodyColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          weight: 'bold',
          size: 14
        },
        callbacks: {
          title: (tooltipItems) => {
            const rating = tooltipItems[0].label;
            return rating === 'Unrated' ? 'Unrated' : `Rating: ${rating}`;
          },
          label: (context) => {
            return `Problems solved: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          },
          maxRotation: 30,
          minRotation: 30
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          borderDash: [2, 2],
        },
        ticks: {
          color: theme.palette.text.secondary,
          precision: 0,
          font: {
            size: 11
          }
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
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'light' 
          ? '0 6px 16px rgba(0, 0, 0, 0.08)' 
          : '0 6px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: 3,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 4,
              marginRight: 1.5,
              display: 'inline-block'
            }
          }}
        >
          Problem Solving Statistics
        </Typography>
        
        <Grid container spacing={3}>
          {/* Key metrics */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2.5, 
                pt: 3,
                pb: 3,
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5,
                borderRadius: '10px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.03)' 
                  : 'rgba(0, 0, 0, 0.01)'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    borderRadius: '8px',
                    p: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(25, 118, 210, 0.15)'
                      : 'rgba(25, 118, 210, 0.05)',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Total Problems Solved
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalProblemsSolved}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    borderRadius: '8px',
                    p: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(76, 175, 80, 0.15)'
                      : 'rgba(76, 175, 80, 0.05)',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Average Rating
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.averageRating || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    borderRadius: '8px',
                    p: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(156, 39, 176, 0.15)'
                      : 'rgba(156, 39, 176, 0.05)',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Problems Per Day
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.averageProblemsPerDay}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ 
                    borderRadius: '8px',
                    p: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 152, 0, 0.15)'
                      : 'rgba(255, 152, 0, 0.05)',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                      Hardest Problem
                    </Typography>
                    <Typography variant="h4" sx={{ 
                      color: getMostDifficultColor(),
                      fontWeight: 700 
                    }}>
                      {stats.mostDifficultProblem ? stats.mostDifficultProblem.rating : 'N/A'}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ display: 'block', mt: 0.5 }}>
                      {stats.mostDifficultProblem ? stats.mostDifficultProblem.name : ''}
                    </Typography>
                  </Box>
                </Grid>              </Grid>
            </Paper>
          </Grid>
          
          {/* Rating distribution chart */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                borderRadius: '10px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.03)' 
                  : 'rgba(0, 0, 0, 0.01)'
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600,
                  color: theme.palette.text.primary 
                }}
              >
                Problem Rating Distribution
              </Typography>
              <Box sx={{ 
                height: { xs: '280px', md: '350px' },
                animation: 'fadeIn 0.6s ease-in',
                padding: 2
              }}>
                <Bar data={chartData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProblemStats;
