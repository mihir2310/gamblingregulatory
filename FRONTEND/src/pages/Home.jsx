import { Typography, Box, Container } from '@mui/material';

function Home() {
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
          Welcome to Alea - the AI-driven regulatory compliance platform for Prediction Markets
        </Typography>
        <Typography variant="body1" align="center">
          Use AI-powered tools to ensure compliance with market regulations seamlessly.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
