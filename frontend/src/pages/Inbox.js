import { useAuth } from '../context/AuthContext';

const Inbox = () => {
  const { user } = useAuth();

  return (
    <div style={inboxContainer}>
      <h2>Official Inbox</h2>
      <p>Administrative messages regarding your account behavior.</p>
      
      {user?.warnings?.length === 0 ? (
        <div style={emptyState}>Your inbox is empty. Keep up the good work!</div>
      ) : (
        user.warnings.map((warn, index) => (
          <div key={index} style={warningCard}>
            <div style={warnHeader}>
              <strong>System Notice</strong>
              <span>{new Date(warn.date).toLocaleDateString()}</span>
            </div>
            <p style={warnMessage}>{warn.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

const inboxContainer = {
  maxWidth: '800px',
  margin: '40px auto',
  padding: '20px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const emptyState = {
  textAlign: 'center',
  padding: '50px',
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
  color: '#666',
  border: '2px dashed #ddd',
  marginTop: '20px'
};

const warningCard = {
  backgroundColor: '#fff',
  border: '1px solid #ffeeba',
  borderLeft: '5px solid #ffc107', // Warning yellow accent
  padding: '20px',
  margin: '15px 0',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s ease'
};

const warnHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px',
  fontSize: '0.9rem',
  color: '#856404'
};

const warnMessage = {
  fontSize: '1.05rem',
  lineHeight: '1.5',
  color: '#333',
  margin: '0'
};

export default Inbox;