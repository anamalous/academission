import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './common/Loader';

const Sidebar = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateSubscriptions } = useAuth();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        var { data } = await API.get(`/subjects`);
        console.log(user.subscriptions);
        if(user.role==="teacher")
          data=data.filter(item => user?.subscriptions?.includes(item._id));
        setSubjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [user.role,user.subscriptions]);

  const handleJoinToggle = async (subjectId) => {
    if (!user) return alert("Please log in to join subjects!");
    try {
      const { data } = await API.post(`/users/subscribe/${subjectId}`,{});
      updateSubscriptions(data);
    } catch (err) {
      console.error("Subscription error", err);
    }
  };

  if (loading) return <Loader message="Loading Subjects" />;

  return (
    <aside style={sidebarStyle}>
      <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Explore Subjects</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {subjects.map((subject) => {
          const isSubscribed = user?.subscriptions?.includes(subject._id);
          return (
            <li key={subject._id} style={listItemStyle}>
              <Link to={`/subjects/${subject._id}`} style={linkStyle}>📚 {subject.name}</Link>
              {user?.role === 'user' && (<button onClick={() => handleJoinToggle(subject._id)}
                style={{
                  ...joinButtonStyle,
                  backgroundColor: isSubscribed ? '#4CAF50' : '#3f51b5'
                }}
              >
                {isSubscribed ? 'Joined' : 'Join'}
              </button>)}
            </li>
          );
        })}
      </ul>
      {user?.role === 'teacher' && (
        <Link to="/create-subject" style={createBtnStyle}>
          + Create New Subject
        </Link>
      )}
    </aside>
  );
};

const sidebarStyle = {
  width: '250px',
  padding: '20px',
  background: '#f4f4f4',
  minHeight: 'calc(100vh - 70px)',
  borderRight: '1px solid #ddd'
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 0',
  borderBottom: '1px solid #eee'
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: '500'
};

const joinButtonStyle = {
  padding: '4px 8px',
  fontSize: '0.8em',
  backgroundColor: '#3f51b5',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const createBtnStyle = { 
  display: 'block', 
  marginBottom: '20px', 
  padding: '10px', 
  background: '#28a745', 
  color: 'white', 
  textAlign: 'center', 
  borderRadius: '4px', 
  textDecoration: 'none', 
  fontWeight: 'bold',
  fontSize: '0.9rem' 
};

export default Sidebar;