import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🎓 Acade-Mission</Link></h1>
      <nav>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsOpen(!isOpen)} style={userMenuBtn}>Hello, {user.username} ▾</button>

            {isOpen && (
              <div style={dropdownStyle} onMouseLeave={() => setIsOpen(false)}>
                {user && user.role === 'admin' && (<Link to="/admin" style={dropLink}>🛠️ Console </Link>)}
                <Link to={`/profile/${user._id}`} style={dropLink}>My Profile</Link>
                <Link to="/inbox" style={dropLink}>Inbox {user.warnings?.length > 0 && <span style={redDot}>!</span>}</Link>
                <hr />
                <button onClick={handleLogout} style={logoutBtn}>Logout</button>
              </div>
            )}
          </div>

        ) : (

          <>
            <Link to="/login" style={{ color: 'white', margin: '0 15px' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', margin: '0 15px' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const headerStyle = {
  padding: '2px 20px',
  background: '#5a8f7fff',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const userMenuBtn = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #ddd',
  padding: '8px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
};

const logoutBtn = {
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  border: 'none',
  background: 'none',
  color: '#dc3545',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500',
  marginTop: '5px'
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  backgroundColor: 'white',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  padding: '10px',
  zIndex: 100,
  minWidth: '150px',
  border: '1px solid #eee'
};

const dropLink = {
  display: 'block',
  padding: '8px 12px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '0.9rem'
};

const redDot = {
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '50%',
  padding: '0 6px',
  fontSize: '0.7rem',
  marginLeft: '5px'
};

export default Navbar;