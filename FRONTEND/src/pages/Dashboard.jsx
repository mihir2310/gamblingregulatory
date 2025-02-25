import { Typography, Box, Container, Button, Stack, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is already uploaded
      if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
        setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10)); // Keep only the latest 10 files
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
            startIcon={<AddIcon />}
            component="label"
            sx={{ borderRadius: '8px' }}
          >
            Create New (+)
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
                  <ListItemText primary={file.name} />
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
            Dashboard
          </Typography>
          <Typography variant="body1">
            Get insights, reports, and manage your compliance data all in one place.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
