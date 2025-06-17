import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import { ColorModeContext } from '../../App';

const Header = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Student Progress System
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
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
            >
              <MenuItem component={RouterLink} to="/" onClick={handleClose}>Home</MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={() => {
                colorMode.toggleColorMode();
                handleClose();
              }}>
                {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" component={RouterLink} to="/settings">
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </Button>
            <IconButton 
              color="inherit"
              onClick={colorMode.toggleColorMode}
              sx={{ ml: 1 }}
              aria-label="toggle dark/light mode"
            >
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
