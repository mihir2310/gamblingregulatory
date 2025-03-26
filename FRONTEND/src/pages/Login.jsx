import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === 'admin' && password === 'admin') {
      onLogin();
      console.log('trying axios');
      const docs = await axios.get('/load');
      console.log('axios worked');
      navigate('/dashboard', { state: { documents: docs.data } });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full viewport height
        width: '100vw', // Full viewport width
        backgroundColor: '#eaeaea', // Optional background color
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Keep form items aligned to center
          maxWidth: '400px', // Limit width of the login box
          width: '100%', // Make it responsive
          padding: 3,
          backgroundColor: '#fff', // White background for the box
          borderRadius: '8px', // Rounded corners
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
