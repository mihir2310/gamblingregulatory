import { Typography, Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100vw',
        height: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: '64px',
        left: 0,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%' }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            py: { xs: 4, md: 8 }
          }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.2,
                textAlign: 'center',
                marginBottom: '1.5rem',
                background: 'linear-gradient(45deg, #fff 30%, #aaa 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                width: '100%'
              }}
            >
              Welcome to Alea
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                textAlign: 'center',
                marginBottom: '2rem',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '800px',
                width: '100%'
              }}
            >
              AI-driven regulatory compliance for Prediction Markets
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                marginBottom: '3rem',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                width: '100%',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Use AI-powered tools to ensure compliance with market regulations seamlessly.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: { xs: '1rem', md: '2rem' },
                flexWrap: 'wrap',
                width: '100%'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: '50px',
                    padding: '12px 32px',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    }
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '12px 32px',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Home;
