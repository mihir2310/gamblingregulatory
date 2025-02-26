import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Filepage from './pages/Filepage';  // Import Filepage.jsx component
//yo

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
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Alea
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3, marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} />} />
          {/* Add route for Filepage with dynamic URL */}
          <Route path="/dashboard/:fileName" element={<Filepage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
