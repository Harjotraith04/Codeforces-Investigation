import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { format, startOfWeek, eachDayOfInterval, getMonth, subYears, isSameDay } from 'date-fns';

const SubmissionHeatmap = ({ submissions }) => {
  const theme = useTheme();
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  
  // Generate data for a calendar view like GitHub's contribution graph
  const generateCalendarData = () => {
    // Start from the beginning of the week one year ago
    const firstDay = startOfWeek(oneYearAgo);
    // Generate all days from that date to today
    const days = eachDayOfInterval({ start: firstDay, end: today });
    
    // Create month labels
    const months = [];
    let currentMonth = null;
    days.forEach(day => {
      const month = getMonth(day);
      if (month !== currentMonth) {
        months.push({
          label: format(day, 'MMM'),
          index: months.length
        });
        currentMonth = month;
      }
    });
    
    // Organize days into weeks
    const weeks = [];
    let currentWeek = [];
    
    days.forEach((day, index) => {
      const dayOfWeek = day.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = submissions?.[dateStr] || 0;
      
      currentWeek.push({
        date: day,
        dateStr,
        count,
        dayOfWeek
      });
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return { weeks, months };
  };
  
  const { weeks, months } = generateCalendarData();
  
  // Calculate metrics for display
  const calculateMetrics = () => {
    if (!submissions) return { total: 0, maxStreak: 0, currentStreak: 0 };
    
    let total = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    // Sort dates in ascending order
    const sortedDates = Object.keys(submissions).sort();
    
    // Calculate total problems
    total = sortedDates.reduce((sum, date) => sum + submissions[date], 0);
    
    // Calculate streaks
    let prevDate = null;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      const problem_count = submissions[sortedDates[i]];
      
      // If this is the first date or it's consecutive with previous date
      if (problem_count > 0) {
        if (prevDate === null) {
          tempStreak = 1;
          
          // If this date is today, start counting current streak
          if (isSameDay(currentDate, today)) {
            currentStreak = 1;
          }
        } else {
          const dayDiff = (prevDate - currentDate) / (1000 * 60 * 60 * 24);
          if (dayDiff === 1) {
            tempStreak++;
            
            // Update current streak if we're in a sequence ending today
            if (currentStreak > 0) {
              currentStreak++;
            }
          } else {
            // Streak broken
            if (tempStreak > maxStreak) {
              maxStreak = tempStreak;
            }
            tempStreak = 1;
            
            // Reset current streak if broken
            if (!isSameDay(currentDate, today)) {
              currentStreak = 0;
            } else {
              currentStreak = 1;
            }
          }
        }
        
        prevDate = currentDate;
      }
    }
    
    // Check if final streak is the max streak
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
    
    return { total, maxStreak, currentStreak };
  };
  
  const metrics = calculateMetrics();
  
  // Get color for cell based on count
  const getCellColor = (count) => {
    if (count === 0) return theme.palette.mode === 'dark' ? '#1e1e1e' : '#ebedf0';
    
    const intensity = Math.min(4, Math.ceil(count / 1.5));
    
    const colors = theme.palette.mode === 'dark'
      ? ['#0e4429', '#006d32', '#26a641', '#39d353'] // Dark mode colors
      : ['#9be9a8', '#40c463', '#30a14e', '#216e39']; // Light mode colors
      
    return colors[intensity - 1];
  };
  
  // Day names for the y-axis
  const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  
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
          
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
            {/* Day labels */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              mr: 1, 
              height: '100%',
              mt: 3, // Align with first cell
              justifyContent: 'space-around'
            }}>
              {dayNames.map((day, i) => (
                <Typography 
                  key={i} 
                  variant="caption" 
                  sx={{ 
                    fontSize: '10px',
                    color: theme.palette.text.secondary,
                    height: '13px',
                    lineHeight: '13px',
                    width: '30px',
                    textAlign: 'right',
                    pr: 1
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>
            
            {/* Calendar cells */}
            <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
              {/* Month labels */}
              <Box sx={{ 
                display: 'flex', 
                mb: 0.5,
                pl: '4px', // Align with the cells below
              }}>
                {months.map((month) => (
                  <Typography
                    key={month.index}
                    variant="caption"
                    sx={{
                      fontSize: '10px',
                      color: theme.palette.text.secondary,
                      width: month.index < months.length - 1 ? '60px' : 'auto',
                      flexShrink: 0
                    }}
                  >
                    {month.label}
                  </Typography>
                ))}
              </Box>
              
              {/* Calendar grid */}
              <Box sx={{ display: 'flex' }}>
                {weeks.map((week, weekIndex) => (
                  <Box 
                    key={weekIndex} 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      mr: '2px'
                    }}
                  >
                    {Array(7).fill(0).map((_, dayIndex) => {
                      const day = week[dayIndex];
                      return (
                        <Box
                          key={dayIndex}
                          sx={{
                            width: '11px',
                            height: '11px',
                            mb: '2px',
                            backgroundColor: day ? getCellColor(day.count) : 'transparent',
                            borderRadius: '2px',
                            cursor: day ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            '&:hover': day ? {
                              transform: 'scale(1.2)',
                              boxShadow: `0 0 4px ${theme.palette.primary.main}`
                            } : {}
                          }}
                          title={day ? `${format(day.date, 'MMM dd, yyyy')}: ${day.count} problems solved` : ''}
                        />
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          
          {/* Metrics display */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 5,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ minWidth: '200px', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {metrics.total} problems
              </Typography>
              <Typography variant="body2" color="textSecondary">
                solved for all time
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {metrics.maxStreak} days
              </Typography>
              <Typography variant="body2" color="textSecondary">
                in a row max.
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: '200px', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {metrics.currentStreak} days
              </Typography>
              <Typography variant="body2" color="textSecondary">
                in a row for the last month
              </Typography>
            </Box>
          </Box>
          
          {/* Color legend */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1, 
            mt: 2,
            alignItems: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              Less
            </Typography>
            {[0, 1, 2, 3, 4].map(level => (
              <Box
                key={level}
                sx={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: getCellColor(level),
                  borderRadius: '2px',
                }}
              />
            ))}
            <Typography variant="caption" color="text.secondary">
              More
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SubmissionHeatmap;
