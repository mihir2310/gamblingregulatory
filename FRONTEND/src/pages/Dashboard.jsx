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
import { Link } from 'react-router-dom';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [editingDocIndex, setEditingDocIndex] = useState(null);
  const [newDocName, setNewDocName] = useState('');
  const inputRef = useRef(null);

  // Auto-focus when renaming
  useEffect(() => {
    if (editingDocIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingDocIndex]);

  const handleCreateNewDocument = () => {
    const defaultName = `Untitled-${documents.length + 1}`;
    const newDoc = { name: defaultName };
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
    setEditingDocIndex(0);
    setNewDocName(defaultName);
  };

  const handleRenameDocument = (index) => {
    if (newDocName.trim() === '') {
      alert('Document name cannot be empty.');
      return;
    }
    const updatedDocs = documents.map((doc, i) =>
      i === index ? { ...doc, name: newDocName } : doc
    );
    setDocuments(updatedDocs);
    setEditingDocIndex(null);
  };

  const handleDocRemove = (index) => {
    setDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
    setEditingDocIndex(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with Create New */}
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
            onClick={handleCreateNewDocument}
            sx={{ borderRadius: '8px' }}
          >
            Create New Document
          </Button>

          <List>
            {documents.map((doc, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  {editingDocIndex === index ? (
                    <>
                      <TextField
                        inputRef={inputRef}
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        size="small"
                        sx={{ flexGrow: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameDocument(index)}
                      />
                      <IconButton color="primary" onClick={() => handleRenameDocument(index)}>
                        <CheckIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/dashboard/${encodeURIComponent(doc.name)}`}
                        style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
                      >
                        <ListItemText primary={doc.name} />
                      </Link>
                      <IconButton color="error" onClick={() => handleDocRemove(index)}>
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
            Manage your projects and compliance data all in one place. Click on a document to start working.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;
