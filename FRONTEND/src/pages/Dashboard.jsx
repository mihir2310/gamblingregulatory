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
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Check as CheckIcon, Folder as FolderIcon } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const inputRef = useRef(null);
  const location = useLocation();

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

  // Auto-focus on rename input
  useEffect(() => {
    if (editingProjectIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingProjectIndex]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: '280px',
          background: 'white',
          padding: '2rem',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
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
                  component={Link}
                  to={`/dashboard/${encodeURIComponent(project.name)}`}
                  state={{ project: project }}
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
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            }}
          >
            Create a new project or select an existing one to manage your documents.
            All your regulatory compliance work is organized here.
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}

export default Dashboard;