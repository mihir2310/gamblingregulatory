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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
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
                  sx={{ textTransform: 'none' }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/" 
                  onClick={handleLogout}
                  sx={{ textTransform: 'none' }}
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
                  sx={{ textTransform: 'none' }}
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
            minHeight: '100vh',
            pt: '64px', // Height of AppBar
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
