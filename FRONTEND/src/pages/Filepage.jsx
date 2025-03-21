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
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { project_name, fileName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [scanResult, setScanResult] = useState(null); // State to hold scan results
  const [resizeRatio, setResizeRatio] = useState(0.50); // 50% for each section
  const [isLoading, setIsLoading] = useState(false); // State for loading popup
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const market_type = "sportsbooks";
    const state_or_federal = "federal";
    const file = event.target.files[0];

    if (file) {
      if (file.name.endsWith('.docx')) {
        if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
          try {
            setIsLoading(true); // Show loading popup
            const formData = new FormData();
            formData.append('file', file);
            formData.append('market_type', market_type);
            formData.append('state_or_federal', state_or_federal);

            const response = await fetch('http://127.0.0.1:5000/scan-doc', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              alert(`Error: ${errorData.error}`);
              setIsLoading(false); // Hide loading popup
              return;
            }

            const resultData = await response.json();
            setScanResult(resultData); // Store the scan results
            const fileContent = await readDocxFile(file); // Convert .docx content to HTML
            setSelectedFileContent(fileContent); // Set the HTML content
            setUploadedFiles((prevFiles) => [file, ...prevFiles].slice(0, 10));
            navigate(`/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(file.name)}`);
          } catch (error) {
            console.error('Fetch error:', error);
            alert(`Fetch error: ${error.message}`);
          } finally {
            setIsLoading(false); // Hide loading popup
          }
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
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
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
        {/* JSON Placeholder */}
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
          {scanResult ? (
            <pre>{JSON.stringify(scanResult, null, 2)}</pre>
          ) : (
            <Typography variant="h6" color="textSecondary">
              Placeholder
            </Typography>
          )}
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

        {/* DOCX Preview */}
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
          dangerouslySetInnerHTML={{
            __html:
              selectedFileContent ||
              '<p style="color:gray; text-align:center;">No file selected</p>',
          }}
        />
      </Box>
      {/* Loading Popup */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure it appears above everything else
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={50} sx={{ marginBottom: '16px' }} />
            <Typography variant="h6" color="textSecondary">
              Processing...
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Filepage;