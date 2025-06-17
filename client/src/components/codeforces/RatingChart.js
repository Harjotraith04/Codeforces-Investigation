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
  
  // Create chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
        }
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return ratingData[index].contestName;
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const data = ratingData[index];
            const lines = [
              `Rating: ${data.newRating}`,
            ];
            
            return lines;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          color: theme.palette.divider,
        }
      },
      y: {
        min: Math.max(0, minRating - 200),
        max: maxRating + 200,
        ticks: {
          color: theme.palette.text.primary
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rating History
        </Typography>
        
        {ratingData.length > 0 ? (
          <Box
            sx={{
              height: { xs: '250px', md: '400px' },
              width: '100%',
            }}
          >
            <Line options={options} data={data} />
          </Box>
        ) : (
          <Box
            sx={{
              height: { xs: '100px', md: '200px' },
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No contest data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingChart;
