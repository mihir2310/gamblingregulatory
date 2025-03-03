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
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { project_name, fileName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [resizeRatio, setResizeRatio] = useState(0.50); // 50% for each section
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.docx')) {
        if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
          const content = await readDocxFile(file);
          setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
          setSelectedFileContent(content);
          navigate(`/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(file.name)}`);
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
    navigate(`/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(file.name)}`);
  };

  const handleFileRemove = (fileToRemove) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name));
    if (selectedFileContent && fileToRemove.name === fileName) {
      setSelectedFileContent('');
      navigate(`/dashboard/${encodeURIComponent(project_name)}`);
    }
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width - 12; // Subtract resizer width

    let newRatio = relativeX / containerWidth;
    newRatio = Math.max(0.02, Math.min(0.98, newRatio)); // Adjusted limits to avoid 0% or 100%

    setResizeRatio(newRatio);
  };

  const handleResizeEnd = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  useEffect(() => {
    if (fileName) {
      const selectedFile = uploadedFiles.find((file) => file.name === fileName);
      if (selectedFile) {
        readDocxFile(selectedFile).then(setSelectedFileContent);
      }
    }
  }, [fileName, uploadedFiles]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '180vh' }}>
      {/* Sidebar - Fixed width */}
      <Box
        sx={{
          width: '250px',
          flexShrink: 0,
          backgroundColor: '#f5f5f5',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          borderRight: '1px solid #ddd',
        }}
      >
        <Stack spacing={2}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            component="label"
            sx={{ borderRadius: '8px' }}
          >
            Scan .docx File
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
                    to={`/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(file.name)}`}
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

      {/* Main Content - Full Width */}
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          height: '100vh',
          flexGrow: 1,
          position: 'relative',
        }}
      >
        {/* Placeholder Box */}
        <Box
          sx={{
            width: `${resizeRatio * 100}%`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '24px',
            backgroundColor: '#f0f0f0',
            overflowY: 'auto',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            marginRight: '6px',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Placeholder
          </Typography>
        </Box>

        {/* Resizer Handle */}
        <Box
          sx={{
            width: '12px',
            cursor: 'col-resize',
            backgroundColor: '#ddd',
            borderRadius: '4px',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              backgroundColor: '#bbb',
            },
            '&::after': {
              content: '""',
              height: '30px',
              width: '4px',
              backgroundColor: '#999',
              borderRadius: '2px',
            },
          }}
          onMouseDown={handleResizeStart}
        />

        {/* Editable DOCX Preview */}
        <Box
          sx={{
            width: `${(1 - resizeRatio) * 100}%`,
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '24px',
            backgroundColor: '#fff',
            overflowY: 'auto',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            marginLeft: '6px',
            minWidth: '100px',
          }}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: selectedFileContent || '<p style="color:gray; text-align:center;">No file selected</p>' }}
        />
      </Box>
    </Box>
  );
};

export default Filepage;
