import React, { useContext, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  useMediaQuery, 
  Menu, 
  MenuItem,
  useTheme,
  Avatar,
  Tooltip,
  Container 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import { ColorModeContext } from '../../App';

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backdropFilter: 'blur(20px)',
      backgroundColor: theme.palette.mode === 'light' 
        ? 'rgba(255, 255, 255, 0.8)' 
        : 'rgba(18, 18, 18, 0.8)',
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: theme.palette.primary.main }} />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: theme.palette.text.primary,
                fontWeight: 700,
                letterSpacing: '.2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Codeforces Investigation
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem component={RouterLink} to="/" onClick={handleClose}>
                  <DashboardIcon fontSize="small" sx={{ mr: 1.5 }} /> Dashboard
                </MenuItem>
                <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
                  <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} /> Settings
                </MenuItem>
                <MenuItem onClick={() => {
                  colorMode.toggleColorMode();
                  handleClose();
                }}>
                  {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="small" sx={{ mr: 1.5 }} /> : <Brightness4Icon fontSize="small" sx={{ mr: 1.5 }} />}
                  {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Box display="flex" alignItems="center">                <Button 
                  color={isActive('/') ? 'primary' : 'inherit'} 
                  component={RouterLink} 
                  to="/"
                  sx={{ 
                    fontWeight: isActive('/') ? 600 : 500,
                    mx: 1,
                    borderRadius: '8px',
                    color: isActive('/') ? 
                      theme.palette.primary.main : 
                      theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Button 
                  color={isActive('/settings') ? 'primary' : 'inherit'} 
                  component={RouterLink} 
                  to="/settings" 
                  startIcon={<SettingsIcon />}
                  sx={{ 
                    fontWeight: isActive('/settings') ? 600 : 500,
                    mx: 1,
                    borderRadius: '8px',
                    color: isActive('/settings') ? 
                      theme.palette.primary.main : 
                      theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  Settings
                </Button>
                <Tooltip title={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                  <IconButton 
                    onClick={colorMode.toggleColorMode} 
                    color="inherit"
                    sx={{ 
                      ml: 1.5, 
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}      </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
