// Filepage.jsx
import {
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { fileName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [docContent, setDocContent] = useState(''); // Store editable HTML content

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
        if (file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          mammoth
            .convertToHtml({ arrayBuffer })
            .then((result) => {
              setDocContent(result.value);
              setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
            })
            .catch((err) => console.error('Error converting file:', err));
        } else {
          alert('Only .docx files are supported.');
        }
      } else {
        alert('This file has already been uploaded.');
      }
    }
  };

  const handleFileRemove = (fileToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
    if (fileToRemove.name === fileName) setDocContent('');
  };

  const handleFileClick = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    mammoth
      .convertToHtml({ arrayBuffer })
      .then((result) => setDocContent(result.value))
      .catch((err) => console.error('Error converting file:', err));
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
            startIcon={<EditIcon />}
            component="label"
            sx={{ borderRadius: '8px' }}
          >
            Upload .docx
            <input type="file" hidden accept=".docx" onChange={handleFileUpload} />
          </Button>

          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <Link
                    to={`/dashboard/${file.name}`}
                    style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                    onClick={() => handleFileClick(file)}
                  >
                    <ListItemText primary={file.name} />
                  </Link>
                  <IconButton color="error" onClick={() => handleFileRemove(file)}>
                    <CloseIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>

      {/* Main Content - Editable DOCX */}
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
        {docContent ? (
          <Box
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: docContent }}
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #ccc',
              padding: '20px',
              overflowY: 'auto',
              outline: 'none',
              backgroundColor: '#fff',
            }}
          />
        ) : (
          <Typography variant="h5" color="textSecondary">
            Upload and select a .docx file to edit it here.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Filepage;
