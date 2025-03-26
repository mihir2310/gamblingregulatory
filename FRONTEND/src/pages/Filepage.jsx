import {
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Tabs,
  CircularProgress,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';

const Filepage = () => {
  const { project_name } = useParams();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [documentStructure, setDocumentStructure] = useState(null);
  const [highlightedTerm, setHighlightedTerm] = useState(null);
  const [resizeRatio, setResizeRatio] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedViolation, setExpandedViolation] = useState(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  const location = useLocation();
  const project = location.state?.project;

  // Load project documents from localStorage
  useEffect(() => {
    if (project) {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      const currentProject = projects.find(p => p.name === project.name);
      
      if (currentProject) {
        setUploadedFiles(currentProject.documents || []);
      }
    }
  }, [project]);

  // Update localStorage when documents change
  const updateProjectDocuments = (documents) => {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = projects.map(p => 
      p.name === project.name ? { ...p, documents } : p
    );
    
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setUploadedFiles(documents);
  };

  const readDocxFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await mammoth.convertToHtml({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          console.error('Error converting DOCX:', error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (event) => {
    const market_type = 'sportsbooks';
    const state_or_federal = 'federal';
    const file = event.target.files[0];
  
    if (file) {
      if (file.name.endsWith('.docx')) {
        if (!uploadedFiles.some((uploadedFile) => uploadedFile.name === file.name)) {
          try {
            setIsLoading(true);
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
              return;
            }
  
            const resultData = await response.json();
            setScanResult(resultData);
            setDocumentStructure(resultData[0]?.document_structure || null);
  
            const fileContent = await readDocxFile(file);
            setSelectedFileContent(fileContent);
  
            // Create a document object to store
            const newDocument = {
              name: file.name,
              content: fileContent,
              scan_result: resultData,
            };

            // Update project documents in localStorage
            const updatedDocuments = [newDocument, ...uploadedFiles].slice(0, 10);
            updateProjectDocuments(updatedDocuments);
  
            navigate(
              `/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(file.name)}`,
              { state: { document: newDocument, project } }
            );
          } catch (error) {
            console.error('Fetch error:', error);
            alert(`Fetch error: ${error.message}`);
          } finally {
            setIsLoading(false);
          }
        } else {
          alert('This file has already been uploaded.');
        }
      } else {
        alert('Please upload a .docx file.');
      }
    }
  };
  

  const handleTermClick = (term) => {
    const matchingScanResult = scanResult?.find((result) => result.term === term.text);

    setHighlightedTerm({
      ...term,
      violations: matchingScanResult?.violations || [],
    });

    setActiveTab(0);
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
    const containerWidth = containerRect.width - 12;

    let newRatio = relativeX / containerWidth;
    newRatio = Math.max(0.02, Math.min(0.98, newRatio));

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

  const uniqueLawNames = highlightedTerm?.violations
    ? [...new Set(highlightedTerm.violations.map((v) => v['Law Name']))]
    : [];

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
            <Typography variant="h6" sx={{ marginBottom: '16px' }}>
              {project_name}
            </Typography>
            <Button
              variant="contained"
              startIcon={!isLoading && <PlayArrowIcon />}
              component="label"
              sx={{ borderRadius: '8px' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Scan .docx File'
              )}
              <input
                type="file"
                hidden
                accept=".docx"
                onChange={handleFileUpload}
              />
            </Button>
  
            {/* List of uploaded files for this project */}
            <List>
              {uploadedFiles.map((doc, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(
                        `/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(doc.name)}`,
                        { state: { document: doc, project } }
                      );
                    }}
                  >
                    <ListItemText primary={doc.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Box>

      {/* Main Content */}
      <Box ref={containerRef} sx={{ display: 'flex', height: '100vh', flexGrow: 1, position: 'relative' }}>
        {/* Violations Panel */}
        <Box
          sx={{
            width: `${resizeRatio * 100}%`,
            maxWidth: '600px',
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
          {highlightedTerm && highlightedTerm.violations ? (
  <Box>
    <Typography variant="h6" color="primary" sx={{ marginBottom: '16px' }}>
      Violations for: {highlightedTerm.text}
    </Typography>

    {highlightedTerm.violations.length > 0 ? (
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
          {uniqueLawNames.map((lawName, index) => (
            <Tab
              key={lawName}
              label={lawName}
              sx={{
                textTransform: 'none',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
          {uniqueLawNames.map(
            (lawName, index) =>
              activeTab === index && (
                <Box key={lawName}>
                  {(() => {
                    const violationsForLaw = highlightedTerm.violations
                      .filter((v) => v['Law Name'] === lawName);
                    
                    const hasYesViolations = violationsForLaw.some(
                      (v) => v['Violation'] === 'Yes'
                    );

                    if (!hasYesViolations) {
                      return (
                        <Typography 
                          variant="body1" 
                          color="textSecondary" 
                          sx={{ textAlign: 'center', padding: '16px' }}
                        >
                          No violations flagged for this law
                        </Typography>
                      );
                    }

                    return violationsForLaw
                      .filter((v) => v['Violation'] === 'Yes')
                      .map((violation, vIndex) => (
                        <Box
                          key={vIndex}
                          sx={{
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                          }}
                          onClick={() =>
                            setExpandedViolation((prev) =>
                              prev === vIndex ? null : vIndex
                            )
                          }
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
                              textOverflow:
                                expandedViolation === vIndex ? 'unset' : 'ellipsis',
                              overflow:
                                expandedViolation === vIndex
                                  ? 'visible'
                                  : 'hidden',
                              whiteSpace:
                                expandedViolation === vIndex
                                  ? 'normal'
                                  : 'nowrap',
                              width: '100%',
                            }}
                          >
                            {violation['Law Text']}
                          </Typography>

                          {/* Explanation below the law text */}
                          {violation['Explanation'] && (
                            <>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 'bold',
                                  marginTop: '8px',
                                }}
                              >
                                Why this is a violation:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  marginTop: '4px',
                                }}
                              >
                                {violation['Explanation']}
                              </Typography>
                            </>
                          )}
                        </Box>
                      ));
                  })()}
                </Box>
              )
          )}
        </Box>
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

      {/* Document Preview */}
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
        {documentStructure ? (
          documentStructure.map((para, index) => (
            <Typography
              key={index}
              onClick={() => para.is_legal_term && handleTermClick(para)}
              sx={{
                cursor: para.is_legal_term ? 'pointer' : 'default',
                color: para.is_legal_term ? 'blue' : 'black',
                textDecoration: para.is_legal_term ? 'underline' : 'none',
                marginBottom: '8px',
              }}
            >
              {para.text}
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