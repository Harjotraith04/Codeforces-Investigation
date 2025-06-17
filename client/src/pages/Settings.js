import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const Settings = () => {
  const [config, setConfig] = useState({
    syncSchedule: '0 2 * * *', // Default: Every day at 2 AM
    inactivityThreshold: 7, // Default: 7 days
    lastSync: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [syncNowLoading, setSyncNowLoading] = useState(false);

  // Fetch config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/config');
        setConfig(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching config:', err);
        setError('Failed to load configuration');
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await axios.put('/api/config', {
        syncSchedule: config.syncSchedule,
        inactivityThreshold: config.inactivityThreshold
      });
      
      setConfig(response.data);
      setAlert({ 
        open: true, 
        message: 'Configuration saved successfully', 
        severity: 'success' 
      });
      setSaving(false);
    } catch (err) {
      console.error('Error saving config:', err);
      setAlert({ 
        open: true, 
        message: `Error: ${err.response?.data?.message || 'Failed to save configuration'}`, 
        severity: 'error' 
      });
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: name === 'inactivityThreshold' ? Number(value) : value
    });
  };

  // Handle sync now button
  const handleSyncNow = async () => {
    try {
      setSyncNowLoading(true);
      await axios.post('/api/config/sync');
      setAlert({ 
        open: true, 
        message: 'Codeforces data sync started', 
        severity: 'info' 
      });
      setSyncNowLoading(false);
      
      // Refresh config to see updated last sync time
      setTimeout(async () => {
        const response = await axios.get('/api/config');
        setConfig(response.data);
      }, 2000);
    } catch (err) {
      console.error('Error starting sync:', err);
      setAlert({ 
        open: true, 
        message: 'Failed to start sync', 
        severity: 'error' 
      });
      setSyncNowLoading(false);
    }
  };

  // Close alert
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Settings
        </Typography>

        {error ? (
          <Paper sx={{ p: 3, backgroundColor: '#fff3f3' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="syncSchedule"
                    label="Cron Schedule for Data Sync"
                    fullWidth
                    variant="outlined"
                    value={config.syncSchedule}
                    onChange={handleChange}
                    helperText="Cron format: minute hour day month weekday (e.g. '0 2 * * *' for every day at 2 AM)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Inactivity Threshold</InputLabel>
                    <Select
                      name="inactivityThreshold"
                      value={config.inactivityThreshold}
                      onChange={handleChange}
                      label="Inactivity Threshold"
                    >
                      <MenuItem value={3}>3 Days</MenuItem>
                      <MenuItem value={5}>5 Days</MenuItem>
                      <MenuItem value={7}>7 Days</MenuItem>
                      <MenuItem value={14}>14 Days</MenuItem>
                      <MenuItem value={30}>30 Days</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary">
                    Days of inactivity before sending reminder emails
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>
                      Last sync: {formatDate(config.lastSync)}
                    </Typography>
                    <Box>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={handleSyncNow}
                        disabled={syncNowLoading}
                        sx={{ mr: 2 }}
                      >
                        {syncNowLoading ? <CircularProgress size={24} /> : 'Sync Now'}
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={saving}
                      >
                        {saving ? <CircularProgress size={24} /> : 'Save Settings'}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </form>
            
            {/* Cron Schedule Help */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Cron Schedule Format Reference
              </Typography>
              <Typography variant="body2">
                The cron schedule uses the standard 5-part format:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                * * * * *
                ┬ ┬ ┬ ┬ ┬
                │ │ │ │ └─ day of week (0-6) (Sunday=0)
                │ │ │ └─── month (1-12)
                │ │ └───── day of month (1-31)
                │ └─────── hour (0-23)
                └───────── minute (0-59)
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Examples:</strong>
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <code>0 2 * * *</code> - Every day at 2:00 AM
                </Typography>
                <Typography variant="body2">
                  <code>0 */12 * * *</code> - Every 12 hours (at 12 AM and 12 PM)
                </Typography>
                <Typography variant="body2">
                  <code>0 0 * * 1</code> - Every Monday at midnight
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
      
      {/* Alert Snackbar */}
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
