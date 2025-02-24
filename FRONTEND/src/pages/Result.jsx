import { Box, Container, Typography } from '@mui/material';

function Result() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '64px',
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
          Result Page
        </Typography>
        <Typography variant="body1" align="center">
          This page will display the results of the compliance check.
        </Typography>
      </Container>
    </Box>
  );
}

export default Result;
