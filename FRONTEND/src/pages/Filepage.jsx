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
  Tabs,
  Tab
} from '@mui/material';
import { Close as CloseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { project_name, fileName } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [scanResult, setScanResult] = useState(null); // State to hold scan results
  const [highlightedTerm, setHighlightedTerm] = useState(null); // Currently clicked term
  const [resizeRatio, setResizeRatio] = useState(0.50); // 50% for each section
  const [isLoading, setIsLoading] = useState(false); // State for loading popup
  const [activeTab, setActiveTab] = useState(0); // State for law violations tabs
  const [expandedViolation, setExpandedViolation] = useState(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  const location = useLocation();
  const doc = location.state?.document;
  console.log(doc);
 
  useEffect(() => {
     if (location.state?.document) {
       setSelectedFileContent(doc.content);
       setScanResult(doc.scan_result)
     }
  }, [location.state]);

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

            const response = await fetch('/api/scan-doc', {
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
            
            await fetch('/api/documents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: file.name,
                content: fileContent,
                scan_result: resultData,
              }),
            });

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

  const handleTermClick = (term) => {
    setHighlightedTerm(term); // Update the highlighted term
    setActiveTab(0); // Reset to first tab when new term is clicked
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
      {/* Sidebar */}
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
        </Stack>
      </Box>

      {/* Main Content */}
      <Box ref={containerRef} sx={{ display: 'flex', height: '100vh', flexGrow: 1, position: 'relative' }}>
        {/* Placeholder */}
<Box
  sx={{
    width: `${resizeRatio * 100}%`,
    maxWidth: '600px', // Restrict max width
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    padding: '24px',
    backgroundColor: '#f0f0f0',
    overflowY: 'auto',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  }}
>
  {highlightedTerm ? (
    <Box
      sx={{
        width: '100%',
        maxHeight: '400px', // Restrict max height
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" color="primary" sx={{ marginBottom: '16px' }}>
        Violations for: {highlightedTerm.term}
      </Typography>

      {highlightedTerm.violations.filter(v => v['Violation'] === 'Yes').length > 0 ? (
        <>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #ddd',
              marginBottom: '16px',
              width: '100%',
            }}
          >
            {[...new Set(highlightedTerm.violations.map(v => v['Law Name']))].map(
              (lawName, index) => (
                <Tab
                  key={lawName}
                  label={lawName}
                  sx={{
                    textTransform: 'none',
                    maxWidth: '200px', // Limit tab width
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
              )
            )}
          </Tabs>

          {/* Display violations for the active tab */}
          {[...new Set(highlightedTerm.violations.map(v => v['Law Name']))].map(
            (lawName, index) =>
              activeTab === index && (
                <Box
                  key={lawName}
                  sx={{
                    maxHeight: 'calc(100% - 100px)',
                    overflowY: 'auto',
                  }}
                >
                  {highlightedTerm.violations
                    .filter(v => v['Law Name'] === lawName && v['Violation'] === 'Yes') // Only show "Yes" violations
                    .map((violation, vIndex) => (
                      <Box
                        key={vIndex}
                        sx={{
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '4px',
                        }}
                        onClick={() => {
                          // Toggle expanded state for this violation
                          setExpandedViolation((prev) =>
                            prev === vIndex ? null : vIndex
                          );
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="primary"
                          sx={{ marginBottom: '8px' }}
                        >
                          {violation['Category']}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textOverflow: expandedViolation === vIndex ? 'unset' : 'ellipsis',
                            overflow: expandedViolation === vIndex ? 'visible' : 'hidden',
                            whiteSpace: expandedViolation === vIndex ? 'normal' : 'nowrap',
                            width: '100%',
                          }}
                        >
                          {violation['Law Text']}
                        </Typography>

                        {/* Explanation below the law text */}
                        {violation['Explanation'] && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              marginTop: '8px',
                            }}
                          >
                            Why this is a violation:
                          </Typography>
                        )}
                        {violation['Explanation'] && (
                          <Typography
                            variant="body2"
                            sx={{
                              marginTop: '4px',
                            }}
                          >
                            {violation['Explanation']}
                          </Typography>
                        )}
                      </Box>
                    ))}
                </Box>
              )
          )}
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No violations flagged!
        </Typography>
      )}
    </Box>
  ) : (
    <Typography variant="h6" color="textSecondary">
      Click a term to view violations
    </Typography>
  )}
</Box>


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
        >
          {scanResult ? (
            scanResult.map((item, index) => (
              <Typography
                key={index}
                onClick={() => handleTermClick(item)}
                sx={{
                  cursor: 'pointer',
                  color: 'blue',
                  textDecoration: 'underline',
                  marginBottom: '8px',
                }}
              >
                {item.term}
              </Typography>
            ))
          ) : (
            <Typography style={{ color: 'gray', textAlign: 'center' }}>
              No file selected
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Filepage;
