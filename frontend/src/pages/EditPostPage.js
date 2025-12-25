import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);setContent(data.content);
        setSubjectName(data.subject?.name || "Academic Hub"); 
        setLoading(false);
      } catch (err) {setError("Could not load the post data.");setLoading(false);}
    };
    fetchPost();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await API.put(`/posts/${id}`, { title, content });
      setSaving(false);navigate(`/posts/${id}`); 
    } catch (err) {
      setSaving(false);
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  if (loading) return <Loader message="Fetching your draft..." />;

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

          <div style={staticSubjectBadge}>
            {subjectName}
          </div>
          
          <span style={editingTag}>• Editing Draft</span>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            style={cancelButtonStyle}
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} style={buttonStyle}>
            {saving ? 'Saving Changes...' : 'Update Post'}
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

const staticSubjectBadge = {
  backgroundColor: '#eef2ff', 
  color: '#3730a3',
  padding: '4px 15px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
};

const editingTag = {
    fontSize: '0.85rem',
    color: '#888',
    fontStyle: 'italic'
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
  cursor: 'pointer'
};

const cancelButtonStyle = {
    padding: '12px 25px',
    backgroundColor: 'transparent',
    color: '#666',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer'
};

export default EditPostPage;