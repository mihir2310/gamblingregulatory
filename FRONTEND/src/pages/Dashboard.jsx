import {
  Typography,
  Box,
  Container,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Paper,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  Check as CheckIcon, 
  Folder as FolderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load projects from localStorage on mount
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(storedProjects);
  }, []);

  // Save projects to localStorage whenever they change
  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleCreateNewProject = () => {
    const defaultName = `Untitled-${projects.length + 1}`;
    const newProject = { 
      name: defaultName, 
      documents: [],
      createdAt: new Date().toISOString()
    };
    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    setEditingProjectIndex(0);
    setNewProjectName(defaultName);
  };

  const handleRenameProject = (index) => {
    if (newProjectName.trim() === '') {
      alert('Project name cannot be empty.');
      return;
    }
    const updatedProjects = projects.map((project, i) =>
      i === index ? { ...project, name: newProjectName } : project
    );
    saveProjects(updatedProjects);
    setEditingProjectIndex(null);
  };

  const handleProjectRemove = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    saveProjects(updatedProjects);
    setEditingProjectIndex(null);
  };

  const handleProjectClick = (project, index) => {
    if (editingProjectIndex === index) return;
    setSelectedProject(project);
  };

  const handleDoubleClick = (project) => {
    navigate(`/dashboard/${encodeURIComponent(project.name)}`);
  };

  const handleShare = () => {
    // Implement share functionality
    alert('Share functionality coming soon!');
  };

  const handleDownload = () => {
    if (selectedProject?.documents?.[0]) {
      const document = selectedProject.documents[0];
      const blob = new Blob([document.content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedProject.name}_preview.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // Auto-focus on rename input
  useEffect(() => {
    if (editingProjectIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingProjectIndex]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        position: 'fixed',
        top: '64px',
        left: 0,
        background: '#f8f9fa',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: '280px',
          height: '100%',
          background: 'white',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '2rem',
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
          Projects
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewProject}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            borderRadius: '12px',
            padding: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
            }
          }}
        >
          New Project
        </Button>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ marginBottom: '0.5rem' }}>
                <ListItemButton
                  onClick={() => handleProjectClick(project, index)}
                  onDoubleClick={() => handleDoubleClick(project)}
                  sx={{
                    borderRadius: '12px',
                    padding: '12px',
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.08)',
                    }
                  }}
                >
                  {editingProjectIndex === index ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <TextField
                        inputRef={inputRef}
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameProject(index)}
                      />
                      <IconButton 
                        color="primary" 
                        onClick={() => handleRenameProject(index)}
                        size="small"
                      >
                        <CheckIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#2196F3',
                          fontSize: '0.875rem',
                        }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText
                        primary={project.name}
                        sx={{
                          '& .MuiTypography-root': {
                            fontWeight: 500,
                            color: '#1a1a1a',
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleProjectRemove(index);
                        }}
                        sx={{
                          color: 'rgba(0,0,0,0.3)',
                          '&:hover': {
                            color: '#f44336',
                            background: 'rgba(244, 67, 54, 0.08)',
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          overflow: 'auto',
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: selectedProject ? 'flex-start' : 'center'
        }}
      >
        {selectedProject?.documents?.[0] ? (
          <Box sx={{ width: '100%', maxWidth: '1200px' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3 
            }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}
              >
                {selectedProject.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={handleShare}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                  }}
                >
                  Share
                </Button>
                <Button
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    }
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
            <Paper
              elevation={0}
              sx={{
                height: 'calc(100vh - 250px)',
                overflow: 'auto',
                padding: '2rem',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
              }}
            >
              <Box
                dangerouslySetInnerHTML={{
                  __html: selectedProject.documents[0].content
                }}
              />
            </Paper>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '1200px' }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                marginBottom: '1rem',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Welcome to Your Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(0,0,0,0.7)',
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              Create a new project or select an existing one to manage your documents.
              All your regulatory compliance work is organized here.
            </Typography>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;