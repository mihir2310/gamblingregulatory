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
      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8"
    >
      <Container maxWidth="lg" className="text-center">
        <Typography
          variant="h3"
          gutterBottom
          className="text-5xl font-extrabold text-white tracking-wide leading-tight shadow-lg"
        >
          Welcome to Alea - the AI-driven regulatory compliance platform for Prediction Markets
        </Typography>
        <Typography
          variant="body1"
          className="text-xl text-gray-200 mb-6"
        >
          Use AI-powered tools to ensure compliance with market regulations seamlessly.
        </Typography>
        
        <Box className="space-x-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105">
            Get Started
          </button>
          <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-all duration-200 hover:bg-white hover:text-indigo-600 hover:scale-105">
            Learn More
          </button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
