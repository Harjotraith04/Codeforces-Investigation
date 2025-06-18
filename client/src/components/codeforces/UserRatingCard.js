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
      <Card 
        elevation={0}
        sx={{ 
          mb: 3, 
          borderRadius: '12px', 
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)` 
            : `linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
            : '0 8px 16px rgba(0, 0, 0, 0.05)'
        }}
      >
        <CardContent sx={{ padding: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
            <Skeleton variant="text" width={150} height={40} />
            <Skeleton variant="rounded" width={80} height={28} />
          </Box>
          
          <Box sx={{ 
            p: 2, 
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.02)',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton variant="text" width={100} height={30} />
              <Skeleton variant="text" width={80} height={30} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width={120} height={30} />
              <Skeleton variant="text" width={80} height={30} />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Skeleton variant="text" width={180} height={20} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const currentRatingColor = getRatingColor(rating);
  const maxRatingColor = getRatingColor(maxRating);
  const rankTitle = getRankTitle(rating);
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3, 
        borderRadius: '12px', 
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)` 
          : `linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)`,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
          : '0 8px 16px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 12px 20px rgba(0, 0, 0, 0.5)' 
            : '0 12px 20px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3, 
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              mr: 2, 
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            {handle}
          </Typography>
          <Chip 
            label={rankTitle} 
            sx={{ 
              color: theme.palette.mode === 'dark' ? '#fff' : '#000',
              backgroundColor: `${currentRatingColor}22`,
              border: `1px solid ${currentRatingColor}`,
              fontWeight: 'bold',
              px: 0.5
            }} 
          />
        </Box>

        <Box sx={{ 
          p: 2, 
          borderRadius: '8px',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
              Current Rating:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 700, 
                color: currentRatingColor,
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {rating || 'Unrated'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
              Max Rating:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 700, 
                color: maxRatingColor 
              }}
            >
              {maxRating || 'Unrated'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2
        }}>
          <Typography 
            variant="caption" 
            sx={{ color: theme.palette.text.secondary }}
          >
            Codeforces User | Updated {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserRatingCard;
