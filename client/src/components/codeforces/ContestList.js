import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Link,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';

const ContestList = ({ contests }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Format the date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };
  
  // Get rating change color
  const getRatingChangeColor = (change) => {
    if (change > 0) return '#4caf50'; // green
    if (change < 0) return '#f44336'; // red
    return theme.palette.text.primary; // neutral
  };
  
  // Get rating color based on Codeforces rating
  const getRatingColor = (rating) => {
    if (rating >= 2400) return '#ff0000'; // red
    if (rating >= 2100) return '#ff8c00'; // orange
    if (rating >= 1900) return '#aa00aa'; // purple
    if (rating >= 1600) return '#0000ff'; // blue
    if (rating >= 1400) return '#03a89e'; // cyan
    if (rating >= 1200) return '#008000'; // green
    return '#808080'; // gray
  };
  
  // Determine columns to show based on screen size
  const getColumns = () => {
    if (isMobile) {
      return ['contest', 'rating', 'change'];
    }
    return ['contest', 'date', 'rank', 'rating', 'change', 'unsolved'];
  };
  
  const columns = getColumns();
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contest Participation
        </Typography>
        
        {contests.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.includes('contest') && (
                    <TableCell>Contest</TableCell>
                  )}
                  {columns.includes('date') && (
                    <TableCell>Date</TableCell>
                  )}
                  {columns.includes('rank') && (
                    <TableCell>Rank</TableCell>
                  )}
                  {columns.includes('rating') && (
                    <TableCell align="right">Rating</TableCell>
                  )}
                  {columns.includes('change') && (
                    <TableCell align="right">Change</TableCell>
                  )}
                  {columns.includes('unsolved') && (
                    <TableCell align="right">Unsolved</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {contests.map((contest) => (
                  <TableRow key={contest.contestId}>
                    {columns.includes('contest') && (
                      <TableCell>
                        <Link 
                          href={`https://codeforces.com/contest/${contest.contestId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {isMobile && contest.contestName.length > 20 
                            ? contest.contestName.substring(0, 17) + '...' 
                            : contest.contestName}
                        </Link>
                      </TableCell>
                    )}
                    {columns.includes('date') && (
                      <TableCell>{formatDate(contest.date)}</TableCell>
                    )}
                    {columns.includes('rank') && (
                      <TableCell>{contest.rank}</TableCell>
                    )}
                    {columns.includes('rating') && (
                      <TableCell 
                        align="right" 
                        style={{ color: getRatingColor(contest.newRating) }}
                      >
                        {contest.newRating}
                      </TableCell>
                    )}
                    {columns.includes('change') && (
                      <TableCell 
                        align="right"
                        style={{ color: getRatingChangeColor(contest.ratingChange) }}
                      >
                        {contest.ratingChange > 0 ? `+${contest.ratingChange}` : contest.ratingChange}
                      </TableCell>
                    )}
                    {columns.includes('unsolved') && (
                      <TableCell align="right">
                        {contest.problemsUnsolved > 0 && (
                          <Chip 
                            size="small" 
                            label={contest.problemsUnsolved} 
                            color={contest.problemsUnsolved > 3 ? "error" : "warning"}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              height: '100px',
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

export default ContestList;
