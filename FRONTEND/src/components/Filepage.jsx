// Filepage.jsx
import { useParams } from 'react-router-dom';

const Filepage = () => {
  const { fileName } = useParams(); // Extract fileName from URL parameter

  return (
    <div style={{ padding: '20px' }}>
      <h2>Placeholder for {fileName}</h2>
      <p>This page will eventually display details for {fileName}.</p>
    </div>
  );
};

export default Filepage;
