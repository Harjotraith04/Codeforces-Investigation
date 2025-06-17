import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme, Skeleton } from '@mui/material';

// Helper function to determine color based on rating
const getRatingColor = (rating) => {
  if (!rating) return '#999';
  if (rating < 1200) return '#808080'; // gray (Newbie)
  if (rating < 1400) return '#008000'; // green (Pupil)
  if (rating < 1600) return '#03a89e'; // cyan (Specialist)
  if (rating < 1900) return '#0000ff'; // blue (Expert)
  if (rating < 2100) return '#a0a'; // violet (Candidate Master)
  if (rating < 2400) return '#ff8c00'; // orange (Master)
  if (rating < 2600) return '#ff8c00'; // orange (International Master)
  if (rating < 3000) return '#ff0000'; // red (Grandmaster)
  return '#ff0000'; // red (International Grandmaster, Legendary Grandmaster)
};

// Helper function to get user rank title
const getRankTitle = (rating) => {
  if (!rating) return 'Unrated';
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2400) return 'Master';
  if (rating < 2600) return 'International Master';
  if (rating < 3000) return 'Grandmaster';
  if (rating < 3500) return 'International Grandmaster';
  return 'Legendary Grandmaster';
};

const UserRatingCard = ({ handle, rating, maxRating, loading }) => {
  const theme = useTheme();
  
  if (loading) {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width={150} height={40} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Skeleton variant="text" width={100} height={30} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={120} height={30} />
            <Skeleton variant="text" width={80} height={30} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const currentRatingColor = getRatingColor(rating);
  const maxRatingColor = getRatingColor(maxRating);
  const rankTitle = getRankTitle(rating);

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div" sx={{ mr: 2 }}>
            {handle}
          </Typography>
          <Chip 
            label={rankTitle} 
            sx={{ 
              color: currentRatingColor,
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.07)',
              fontWeight: 'bold'
            }} 
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Current Rating:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontWeight: 'bold', color: currentRatingColor }}
          >
            {rating || 'Unrated'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" color="text.secondary">
            Max Rating:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontWeight: 'bold', color: maxRatingColor }}
          >
            {maxRating || 'Unrated'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserRatingCard;
