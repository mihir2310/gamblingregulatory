// Filepage.jsx
import { Typography, Box, Button, Stack, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Close as CloseIcon } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const Filepage = () => {
  const { fileName } = useParams(); // Extract fileName from URL
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileURL, setSelectedFileURL] = useState(null); // Store URL for iframe

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
        const fileURL = URL.createObjectURL(file);
        setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
        setSelectedFileURL(fileURL); // Display file immediately
      } else {
        alert('This file has already been uploaded.');
      }
    }
  };

  const handleFileRemove = (fileToRemove) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name));
    if (selectedFileURL && fileToRemove.name === fileName) {
      setSelectedFileURL(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
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
                  <Link
                    to={`/dashboard/${file.name}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={() => setSelectedFileURL(URL.createObjectURL(file))}
                  >
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

      {/* Main Content - PDF Preview */}
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
        {selectedFileURL ? (
          <iframe
            src={selectedFileURL}
            title={fileName}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        ) : (
          <Typography variant="h5" color="textSecondary">
            Select or upload a file to view it here.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Filepage;
