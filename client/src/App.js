import React, { useState, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import StudentTable from './pages/StudentTable';
import StudentProfile from './pages/StudentProfile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create theme context
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

function App() {
  const [mode, setMode] = useState('light');
  
  // Color mode context for theme switching
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      // Save preference to local storage
      localStorage.setItem('themeMode', mode === 'light' ? 'dark' : 'light');
    },
    mode,
  }), [mode]);
    // Create theme based on mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
        light: mode === 'light' ? '#42a5f5' : '#bbdefb',
        dark: mode === 'light' ? '#0d47a1' : '#64b5f6',
      },
      secondary: {
        main: mode === 'light' ? '#e91e63' : '#f48fb1',
        light: mode === 'light' ? '#f06292' : '#f8bbd0',
        dark: mode === 'light' ? '#c2185b' : '#ef5350',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: [
        'Roboto', 
        'Arial', 
        'sans-serif'
      ].join(','),
      h1: {
        fontWeight: 500,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontWeight: 500,
        letterSpacing: '-0.00833em',
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: mode === 'light' 
              ? '0px 2px 8px rgba(0, 0, 0, 0.08)'
              : '0px 2px 8px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
  }), [mode]);
  
  // Load theme preference on component mount
  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Header />
            <main style={{ flex: 1, padding: '20px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
              <Routes>
                <Route path="/" element={<StudentTable />} />
                <Route path="/students/:id" element={<StudentProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <ToastContainer position="bottom-right" />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
