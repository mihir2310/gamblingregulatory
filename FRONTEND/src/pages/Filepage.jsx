// Filepage.jsx
import { Typography, Box, Container, Button, Stack, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Close as CloseIcon } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const Filepage = () => {
  const { fileName } = useParams(); // Extract fileName from URL parameter
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
        setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
      } else {
        alert('This file has already been uploaded.');
      }
    }
  };

  const handleFileRemove = (fileToRemove) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Toolbar */}
      <Box
        sx={{
          width: '250px',
          backgroundColor: '#f5f5f5',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            component="label"
            sx={{ borderRadius: '8px' }}
          >
            Run Scan
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileUpload}
            />
          </Button>

          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <Link to={`/dashboard/${file.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItemText primary={file.name} />
                  </Link>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleFileRemove(file)}
                    sx={{ marginLeft: 'auto' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto',
          padding: 3,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h3" gutterBottom>
            {fileName}
          </Typography>
          <Typography variant="body1">
            This page will eventually display details and scan results for <strong>{fileName}</strong>.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Filepage;
