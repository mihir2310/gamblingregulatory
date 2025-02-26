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
import { Close as CloseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { fileName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.docx')) {
        if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
          const content = await readDocxFile(file);
          setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
          setSelectedFileContent(content);
        } else {
          alert('This file has already been uploaded.');
        }
      } else {
        alert('Please upload a .docx file.');
      }
    }
  };

  const readDocxFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.convertToHtml({ arrayBuffer });
    return value;
  };

  const handleFileSelect = async (file) => {
    const content = await readDocxFile(file);
    setSelectedFileContent(content);
  };

  const handleFileRemove = (fileToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
    if (fileToRemove.name === fileName) {
      setSelectedFileContent('');
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
            Upload .docx File
            <input
              type="file"
              hidden
              accept=".docx"
              onChange={handleFileUpload}
            />
          </Button>

          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <Link
                    to={`/dashboard/${encodeURIComponent(file.name)}`}
                    style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                    onClick={() => handleFileSelect(file)}
                  >
                    <ListItemText primary={file.name} />
                  </Link>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleFileRemove(file)}
                  >
                    <CloseIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>

      {/* Main Content - Editable DOCX Preview */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto',
          padding: 4,
          backgroundColor: '#fafafa',
        }}
      >
        {selectedFileContent ? (
          <Box
            contentEditable
            suppressContentEditableWarning
            sx={{
              width: '100%',
              maxWidth: '800px', // ✅ Restrict width
              height: 'calc(100vh - 80px)', // ✅ Height control
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '24px',
              backgroundColor: '#fff',
              overflowY: 'auto',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            dangerouslySetInnerHTML={{ __html: selectedFileContent }}
          />
        ) : (
          <Typography variant="h5" color="textSecondary">
            Select or upload a .docx file to edit it here.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Filepage;
