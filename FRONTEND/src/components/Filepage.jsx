import { useParams } from 'react-router-dom';

const FilePage = () => {
  const { fileName } = useParams();

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Sidebar</h3>
        {/* Add buttons or links here if you want the sidebar consistent */}
      </div>
      <div className="content" style={{ padding: '20px' }}>
        <h2>Placeholder for {fileName}</h2>
        <p>This page will eventually display details for {fileName}.</p>
      </div>
    </div>
  );
};

export default FilePage;
