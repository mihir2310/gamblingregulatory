// pages/Login.jsx
import React, {useState} from 'react';
import axios from 'axios'
import {TextField, Button, Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function Login({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Example login validation (replace with real validation)
        if (username === 'admin' && password === 'admin') {
            onLogin();  // Call the onLogin function from App.jsx
            const docs = await axios.get('/api/load');
            navigate('/dashboard', {state: {documents: docs.data}});  // Navigate to the dashboard
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: 3,
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
                sx={{marginTop: 2}}
            >
                Login
            </Button>
        </Box>
    );
}

export default Login;
