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
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

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
      documents: [] 
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
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with Create New Project */}
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
            startIcon={<AddIcon />}
            onClick={handleCreateNewProject}
            sx={{ borderRadius: '8px' }}
          >
            Create New Project
          </Button>

          <List>
            {projects.map((project, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  {editingProjectIndex === index ? (
                    <>
                      <TextField
                        inputRef={inputRef}
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameProject(index)}
                      />
                      <IconButton color="primary" onClick={() => handleRenameProject(index)}>
                        <CheckIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/dashboard/${encodeURIComponent(project.name)}`}
                        state={{ project: project }}
                        style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                      >
                        <ListItemText
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '150px', 
                          }}
                          primary={project.name}
                        />
                      </Link>
                      <IconButton color="error" onClick={() => handleProjectRemove(index)}>
                        <CloseIcon />
                      </IconButton>
                    </>
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>

      {/* Main Content */}
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
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h3" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Create a new project or select an existing one to manage your documents.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;