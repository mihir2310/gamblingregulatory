import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Version = () => {
  const { fileName } = useParams();

  // You can display versioning information or any other details related to the document here
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Version of {fileName}</Typography>
      <Typography variant="body1">This is the version page for the document: {fileName}</Typography>
    </Box>
  );
};

export default Version;
