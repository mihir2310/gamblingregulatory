import { Typography, Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ComplianceCheck() {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate file processing
      console.log("Processing file:", file.name);
      
      // After processing, navigate to the 'result' page
      navigate('/compliance/result');
    }
  };

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
          Compliance Check
        </Typography>
        <Typography variant="body1" align="center">
          Run real-time compliance checks tailored for strategies.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3 }}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Terms and Conditions
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ComplianceCheck;
