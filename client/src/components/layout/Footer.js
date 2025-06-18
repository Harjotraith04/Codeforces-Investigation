import React from 'react';
import { Box, Typography, Container, Link, useTheme, Grid, IconButton, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'light' 
          ? theme.palette.grey[50] 
          : theme.palette.grey[900],
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center">
              <CodeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography 
                variant="subtitle1" 
                color="text.primary" 
                sx={{ fontWeight: 600, letterSpacing: '0.5px' }}
              >
                Codeforces Investigation
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              A tool for monitoring and analyzing student progress in competitive programming
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Box>
              <IconButton 
                aria-label="github"
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 2 }}
            >
              {'© '}
              {new Date().getFullYear()}
              {' Codeforces Investigation | '}
              <Link 
                color="inherit" 
                href="#"
                sx={{ 
                  textDecoration: 'none', 
                  '&:hover': { color: theme.palette.primary.main } 
                }}
              >
                Documentation
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
