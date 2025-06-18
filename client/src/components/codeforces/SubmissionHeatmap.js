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
      const formattedDate = format(date, 'MMM dd, yyyy');
      
      // Determine color intensity based on submission count
      let backgroundColor = theme.palette.mode === 'dark' ? '#424242' : '#eee'; // Base color for no submissions
      let boxShadow = 'none';
      let transform = 'scale(1)';
      
      if (count > 0) {
        const colorIntensity = Math.min(100, count * 20); // Scale the color intensity
        backgroundColor = theme.palette.mode === 'dark' 
          ? `hsl(122, 50%, ${Math.min(50, 10 + colorIntensity)}%)`  // Dark mode green
          : `hsl(122, 70%, ${Math.max(40, 90 - colorIntensity)}%)`; // Light mode green
        
        boxShadow = theme.palette.mode === 'dark'
          ? 'none'
          : 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)';
      }
      
      cells.push(
        <Box
          key={dateStr}
          className="submission-day"
          sx={{
            backgroundColor,
            boxShadow,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.3)',
              boxShadow: `0 0 0 1px ${theme.palette.primary.main}, 0 0 8px rgba(33, 150, 243, 0.5)`,
              zIndex: 10
            }
          }}
          title={`${formattedDate}: ${count} problems solved`}
        />
      );
    }
    
    return cells;
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
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
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
          Submission Heatmap
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
          <Box
            className="submission-heatmap"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, 15px)',
              gap: '3px',
              my: 2,
              mx: 'auto',
              justifyContent: 'center',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {generateDateCells()}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mt: 2,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Less
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px'
            }}>
              <Box sx={{ 
                width: 13, height: 13, 
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#eee', 
                borderRadius: '3px',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }} />
              <Box sx={{ 
                width: 13, height: 13, 
                backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 20%)' : 'hsl(122, 70%, 80%)', 
                borderRadius: '3px',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }} />
              <Box sx={{ 
                width: 13, height: 13, 
                backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 30%)' : 'hsl(122, 70%, 70%)', 
                borderRadius: '3px',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }} />
              <Box sx={{ 
                width: 13, height: 13, 
                backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 40%)' : 'hsl(122, 70%, 60%)', 
                borderRadius: '3px',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }} />
              <Box sx={{ 
                width: 13, height: 13, 
                backgroundColor: theme.palette.mode === 'dark' ? 'hsl(122, 50%, 50%)' : 'hsl(122, 70%, 40%)', 
                borderRadius: '3px',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
              }} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              More
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubmissionHeatmap;
