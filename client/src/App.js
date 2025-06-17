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
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
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
