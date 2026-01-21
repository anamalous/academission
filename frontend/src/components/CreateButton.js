import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const { user,isAuthenticated } = useAuth();
  const location = useLocation();

  const hideOnPaths = ['/login', '/register', '/create-post'];
  if (!isAuthenticated || hideOnPaths.includes(location.pathname) || user.role!=='user') {
    return null;
  }

  return (
    <button 
      onClick={() => navigate('/create-post')} 
      style={fabStyle}
      title="Create a New Post"
    >
      <span style={{ fontSize: '24px', lineHeight: '0' }}>+</span>
    </button>
  );
};

const fabStyle = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#003366', 
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 1000,
  transition: 'transform 0.2s, background-color 0.2s',
};

export default FloatingActionButton;