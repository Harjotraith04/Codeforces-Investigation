import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RatingChart = ({ ratingData }) => {
  const theme = useTheme();
  
  // Prepare data for the chart
  const labels = ratingData.map(entry => {
    // Extract contest name and trim if too long
    const name = entry.contestName;
    return name.length > 25 ? name.substring(0, 22) + '...' : name;
  });
  
  const ratings = ratingData.map(entry => entry.newRating);
  
  // Find min and max ratings for chart scale
  const minRating = Math.min(...ratings, 0);
  const maxRating = Math.max(...ratings, 1500);
    // Create gradient for line
  const getGradient = () => {
    const primaryColor = theme.palette.primary.main;
    return theme.palette.mode === 'dark' 
      ? `linear-gradient(180deg, ${primaryColor} 0%, rgba(25, 118, 210, 0.5) 100%)`
      : `linear-gradient(180deg, ${primaryColor} 0%, rgba(25, 118, 210, 0.7) 100%)`;
  };

  // Create chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: theme.palette.background.paper,
        pointBorderColor: theme.palette.primary.main,
        pointBorderWidth: 2,
        fill: true,
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: theme.palette.background.paper,
        pointHoverBorderColor: theme.palette.primary.dark,
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: theme.palette.text.primary,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: 'Roboto',
            size: 12,
            weight: 500
          }
        }
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
            const index = tooltipItems[0].dataIndex;
            return ratingData[index].contestName;
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const data = ratingData[index];
            const ratingChange = data.newRating - (ratingData[index-1]?.newRating || data.newRating);
            const changeText = ratingChange >= 0 ? `+${ratingChange}` : ratingChange;
            const lines = [
              `Rating: ${data.newRating}`,
              `Change: ${changeText}`,
              `Rank: ${data.rank || 'N/A'}`
            ];
            
            return lines;
          }
        }
      }
    },    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10
          },
          maxTicksLimit: 10
        },
        grid: {
          display: false,
          color: theme.palette.divider,
        },
        border: {
          display: true,
          color: theme.palette.divider
        },
      },
      y: {
        min: Math.max(0, minRating - 300),
        max: maxRating + 300,
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 11
          },
          callback: function(value) {
            if (value === 1200) return 'Pupil';
            if (value === 1400) return 'Specialist';
            if (value === 1600) return 'Expert';
            if (value === 1900) return 'Candidate Master';
            if (value === 2100) return 'Master';
            if (value === 2400) return 'Grandmaster';
            return value;
          }
        },
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          borderDash: [3, 3],
        },
        border: {
          display: true,
          color: theme.palette.divider
        }
      },
    },
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
          Rating History
        </Typography>
        
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.03)' 
              : 'rgba(0, 0, 0, 0.01)',
            borderRadius: '10px',
            padding: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {ratingData.length > 0 ? (
            <Box
              sx={{
                height: { xs: '280px', md: '450px' },
                width: '100%',
                animation: 'fadeIn 0.6s ease-in',
              }}
            >
              <Line options={options} data={data} />
            </Box>
          ) : (
            <Box
              sx={{
                height: { xs: '150px', md: '250px' },
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No contest data available
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
                Once the user participates in Codeforces contests, their rating history will appear here.
              </Typography>
            </Box>
        )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RatingChart;
