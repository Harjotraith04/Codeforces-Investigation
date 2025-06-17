import React from 'react';
import { Box, Typography, Container, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#f5f5f5'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Student Progress Management System | '}
          <Link color="inherit" href="#">
            Documentation
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
