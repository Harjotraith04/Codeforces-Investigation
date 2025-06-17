import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';

const SubmissionHeatmap = ({ submissions }) => {
  const theme = useTheme();
  
  // Generate date cells for the last 365 days
  const generateDateCells = () => {
    const cells = [];
    const today = new Date();
    const submissionsByDate = submissions || {};
    
    // Generate dates for the past year
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = submissionsByDate[dateStr] || 0;
      
      // Determine color intensity based on submission count
      let backgroundColor = theme.palette.mode === 'dark' ? '#424242' : '#eee'; // Base color for no submissions
      
      if (count > 0) {
        const colorIntensity = Math.min(100, count * 20); // Scale the color intensity
        backgroundColor = theme.palette.mode === 'dark' 
          ? `hsl(122, 50%, ${Math.min(50, 10 + colorIntensity)}%)`  // Dark mode green
          : `hsl(122, 70%, ${Math.max(40, 90 - colorIntensity)}%)`; // Light mode green
      }
      
      cells.push(
        <Box
          key={dateStr}
          className="submission-day"
          sx={{
            backgroundColor,
            cursor: 'pointer',
            '&:hover': {
              border: '1px solid',
              borderColor: theme.palette.primary.main
            }
          }}
          title={`${dateStr}: ${count} problems solved`}
        />
      );
    }
    
    return cells;
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Submission Heatmap
        </Typography>
        
        <Box
          className="submission-heatmap"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 15px)',
            gap: '3px',
            my: 2
          }}
        >
          {generateDateCells()}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Less
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px'
          }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#eee', borderRadius: '2px' }} />
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 20%)' : 'hsl(122, 70%, 80%)', borderRadius: '2px' }} />
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 30%)' : 'hsl(122, 70%, 70%)', borderRadius: '2px' }} />
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 40%)' : 'hsl(122, 70%, 60%)', borderRadius: '2px' }} />
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 50%)' : 'hsl(122, 70%, 40%)', borderRadius: '2px' }} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            More
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubmissionHeatmap;
