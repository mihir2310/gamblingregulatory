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
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import { PlayArrow as PlayArrowIcon, Close as CloseIcon, Folder as FolderIcon } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import { motion } from 'framer-motion';

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
  const documentFromState = location.state?.document;

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const currentProject = projects.find(p => p.name === project_name);
    
    if (currentProject?.documents) {
      setUploadedFiles(currentProject.documents);
    }
  }, [project_name]);

  useEffect(() => {
    if (documentFromState) {
      setSelectedFileContent(documentFromState.content);
      setScanResult(documentFromState.scan_result);
      const structure = documentFromState.scan_result?.[0]?.document_structure || null;
      setDocumentStructure(structure);
    }
  }, [documentFromState]);

  const updateProjectDocuments = (documents) => {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = projects.map(p => 
      p.name === project_name ? { ...p, documents } : p
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
  
            const newDocument = {
              name: file.name,
              content: fileContent,
              scan_result: resultData,
            };
  
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
    const containerWidth = containerRect.width - 12;
    const relativeX = e.clientX - containerRect.left;
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
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        background: '#f8f9fa',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: '280px',
          minWidth: '280px',
          height: '100%',
          background: 'white',
          padding: '2rem',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflow: 'auto'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <FolderIcon sx={{ color: '#2196F3' }} />
          {project_name}
        </Typography>

        <Button
          variant="contained"
          startIcon={!isLoading && <PlayArrowIcon />}
          component="label"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            borderRadius: '12px',
            padding: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
            },
            '&.Mui-disabled': {
              background: 'linear-gradient(45deg, #BDBDBD 30%, #E0E0E0 90%)',
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Scan .docx File'
          )}
          <input type="file" hidden accept=".docx" onChange={handleFileUpload} />
        </Button>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {uploadedFiles.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ marginBottom: '0.5rem' }}>
                <ListItemButton
                  onClick={() => {
                    navigate(
                      `/dashboard/${encodeURIComponent(project_name)}/${encodeURIComponent(doc.name)}`,
                      { state: { document: doc, project } }
                    );
                  }}
                  sx={{
                    borderRadius: '12px',
                    padding: '12px',
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.08)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#2196F3',
                        fontSize: '0.875rem',
                      }}
                    >
                      {doc.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={doc.name}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: 500,
                          color: '#1a1a1a',
                        }
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Paper>

      {/* Main Content */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          width: 'calc(100% - 280px)',
          height: '100%',
          display: 'flex',
          background: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Violations Panel */}
        <Box
          sx={{
            width: `${resizeRatio * 100}%`,
            height: '100%',
            padding: '2rem',
            overflowY: 'auto',
            background: '#f8f9fa',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            position: 'relative'
          }}
        >
          {highlightedTerm && highlightedTerm.violations ? (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  color: '#1a1a1a',
                }}
              >
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
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      marginBottom: '1.5rem',
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                      }
                    }}
                  >
                    {uniqueLawNames.map((lawName, index) => (
                      <Tab
                        key={lawName}
                        label={lawName}
                        sx={{
                          minWidth: 'auto',
                          padding: '12px 16px',
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
                              const violationsForLaw = highlightedTerm.violations.filter(
                                (v) => v['Law Name'] === lawName
                              );
                              const hasYesViolations = violationsForLaw.some(
                                (v) => v['Violation'] === 'Yes'
                              );

                              if (!hasYesViolations) {
                                return (
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      padding: '1.5rem',
                                      background: 'white',
                                      borderRadius: '12px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      sx={{ color: 'rgba(0,0,0,0.7)' }}
                                    >
                                      No violations flagged for this law
                                    </Typography>
                                  </Paper>
                                );
                              }

                              return violationsForLaw
                                .filter((v) => v['Violation'] === 'Yes')
                                .map((violation, vIndex) => (
                                  <motion.div
                                    key={vIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: vIndex * 0.1 }}
                                  >
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        marginBottom: '1rem',
                                        padding: '1.5rem',
                                        background: 'white',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        }
                                      }}
                                      onClick={() =>
                                        setExpandedViolation((prev) =>
                                          prev === vIndex ? null : vIndex
                                        )
                                      }
                                    >
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Chip
                                          label={violation['Category']}
                                          color="primary"
                                          size="small"
                                          sx={{
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                          }}
                                        />
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: 'rgba(0,0,0,0.7)',
                                          marginBottom: '1rem',
                                          whiteSpace: expandedViolation === vIndex ? 'normal' : 'nowrap',
                                          overflow: expandedViolation === vIndex ? 'visible' : 'hidden',
                                          textOverflow: expandedViolation === vIndex ? 'unset' : 'ellipsis',
                                        }}
                                      >
                                        {violation['Law Text']}
                                      </Typography>

                                      {violation['Explanation'] && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: expandedViolation === vIndex ? 'auto' : 0,
                                            opacity: expandedViolation === vIndex ? 1 : 0,
                                          }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontWeight: 500,
                                              color: '#1a1a1a',
                                              marginTop: '0.5rem',
                                            }}
                                          >
                                            Why this is a violation:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: 'rgba(0,0,0,0.7)',
                                              marginTop: '0.25rem',
                                            }}
                                          >
                                            {violation['Explanation']}
                                          </Typography>
                                        </motion.div>
                                      )}
                                    </Paper>
                                  </motion.div>
                                ));
                            })()}
                          </Box>
                        )
                    )}
                  </Box>
                </>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                    No violations flagged!
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                width: '300px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  textAlign: 'center'
                }}
              >
                Click a term to view violations
              </Typography>
            </Box>
          )}
        </Box>

        {/* Resizer */}
        <Box
          onMouseDown={handleResizeStart}
          sx={{
            width: '12px',
            cursor: 'col-resize',
            background: 'rgba(0,0,0,0.08)',
            '&:hover': {
              background: 'rgba(0,0,0,0.2)',
            }
          }}
        />

        {/* Document Preview Panel */}
        <Box
          sx={{
            width: `${(1 - resizeRatio) * 100}%`,
            height: '100%',
            padding: '2rem',
            overflowY: 'auto',
            background: 'white',
            position: 'relative'
          }}
        >
          {documentStructure ? (
            documentStructure.map((para, index) => {
              // Get violation count for this term if it's a legal term
              const termViolations = para.is_legal_term 
                ? scanResult?.find(result => result.term === para.text)?.violations.filter(v => v['Violation'] === 'Yes') || []
                : [];
              const violationCount = termViolations.length;
              
              // Calculate color based on violation count
              let termColor = '#000000';
              if (para.is_legal_term) {
                if (violationCount === 0) termColor = '#4caf50';  // Green for no violations
                else if (violationCount === 1) termColor = '#ff9800';  // Orange for 1 violation
                else if (violationCount === 2) termColor = '#f44336';  // Light red for 2 violations
                else termColor = '#d32f2f';  // Dark red for 3 violations
              }

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Typography
                    onClick={() => para.is_legal_term && handleTermClick(para)}
                    sx={{
                      cursor: para.is_legal_term ? 'pointer' : 'default',
                      color: para.is_legal_term ? termColor : 'rgba(0,0,0,0.87)',
                      backgroundColor: para.is_legal_term ? `${termColor}15` : 'transparent',
                      marginBottom: '1rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      '&:hover': para.is_legal_term && {
                        backgroundColor: `${termColor}25`,
                      }
                    }}
                  >
                    {para.text}
                  </Typography>
                </motion.div>
              );
            })
          ) : (
            <Box
              sx={{
                height: '100%',
                width: '300px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(0,0,0,0.5)',
                  textAlign: 'center'
                }}
              >
                No file selected
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Filepage;
