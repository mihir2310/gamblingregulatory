import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Filepage from './pages/Filepage';
import Version from './pages/Version';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          }}
        >
          <Toolbar sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  textTransform: 'none'
                }}
              >
                Alea
              </Button>
            </Typography>
            {isAuthenticated ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/dashboard"
                  sx={{ 
                    textTransform: 'none',
                    mx: 1,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/" 
                  onClick={handleLogout}
                  sx={{ 
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: '100%',
            minHeight: 'calc(100vh - 64px)',
            mt: '64px', // Height of AppBar
            display: 'flex',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard/:project_name" 
              element={isAuthenticated ? <Filepage /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard/:project_name/:fileName" 
              element={isAuthenticated ? <Filepage /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard/:project_name/:fileName/:version" 
              element={isAuthenticated ? <Version /> : <Login onLogin={handleLogin} />} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
