import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const CreatePostPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSubjects, setFetchingSubjects] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await API.get('/subjects');
        const mySubjects = data.filter(sub => user.subscriptions.includes(sub._id));
        setSubjects(mySubjects);

        if (mySubjects.length > 0) setSelectedSubject(mySubjects[0]._id);
      } catch (err) {
        console.error("Could not load subjects", err);
      } finally {
        setFetchingSubjects(false);
      }
    };

    if (user) fetchSubjects();
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedSubject) {setError("Please select a subject first.");return;}
    setLoading(true);
    try {
      await API.post('/posts', { title, content, subject: selectedSubject });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      setLoading(false);
    }
  };

  if (fetchingSubjects) return <Loader message="Preparing your desk..." />;

  return (
    <main style={{ padding: '40px 20px', maxWidth: '90%', margin: 'auto' }}>
      <form onSubmit={submitHandler} style={cardStyle}>
        <input
          type="text"
          placeholder="Title of your discussion..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={titleInputStyle}
        />
        <div style={identityRowStyle}>
          <span style={userLabel}>
            {user?.username} <span style={{ color: '#888', fontWeight: '400' }}>@</span>
          </span>

          <div style={selectWrapper}>
            <select
              value={selectedSubject}
              style={modularSelectStyle}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="" disabled>Select Subject</option>
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr style={dividerStyle} />
        <textarea
          placeholder="Start typing your academic contribution..."
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={contentAreaStyle}
        />

        {error && <ErrorDisplay message={error} />}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Publishing...' : 'Post to Academission'}
          </button>
        </div>
      </form>
    </main>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid #eee',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};

const titleInputStyle = {
  width: '100%',
  fontSize: '1.8rem',
  fontWeight: '700',
  border: 'none',
  outline: 'none',
  marginBottom: '15px',
  fontFamily: 'inherit',
  color: '#222'
};

const identityRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px'
};

const userLabel = {
  fontSize: '1rem',
  fontWeight: '600',
  color: '#003366'
};

const selectWrapper = {
  position: 'relative',
  display: 'inline-block'
};

const dividerStyle = {
  border: '0',
  borderTop: '1px solid #eee',
  margin: '0 0 20px 0'
};

const contentAreaStyle = {
  width: '100%',
  border: 'none',
  outline: 'none',
  fontSize: '1.1rem',
  lineHeight: '1.6',
  fontFamily: 'inherit',
  resize: 'none',
  color: '#444'
};

const buttonStyle = {
  padding: '12px 25px',
  backgroundColor: '#003366',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const modularSelectStyle = {
  appearance: 'none',
  border: 'none', 
  backgroundColor: '#eef2ff', 
  color: '#3730a3',
  padding: '6px 35px 6px 15px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

export default CreatePostPage;