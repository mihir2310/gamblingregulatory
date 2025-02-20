import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ComplianceCheck from './pages/ComplianceCheck';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Alea
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/compliance">Compliance Check</Button>
        </Toolbar>
      </AppBar>
      {/* Add padding to prevent content from hiding behind the AppBar */}
      <Box sx={{ padding: 3, marginTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compliance" element={<ComplianceCheck />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
