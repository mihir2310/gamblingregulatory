// App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar'; // Import the Navbar component
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar /> {/* Use the Navbar here */}
      {/* Add padding to prevent content from hiding behind the AppBar */}
      <Box sx={{ padding: 3, marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
