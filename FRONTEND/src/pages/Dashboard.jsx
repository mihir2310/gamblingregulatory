import { Typography, Box, Container } from '@mui/material';

function Dashboard() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '64px', // Adjust this value based on your navbar height
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom align="center">
          Dashboard
        </Typography>
        <Typography variant="body1" align="center">
          Get insights, reports, and manage your compliance data all in one place.
        </Typography>
      </Container>
    </Box>
  );
}

export default Dashboard;
