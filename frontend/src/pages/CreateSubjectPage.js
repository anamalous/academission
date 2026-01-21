import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useAuth } from '../context/AuthContext';

const CreateSubjectPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '', 
    pinnedPostContent: '', 
    tagInput: '',
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const {updateSubscriptions} = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && formData.tagInput.trim() !== '') {
      e.preventDefault();
      if (!formData.tags.includes(formData.tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, formData.tagInput.trim()],
          tagInput: ''
        });
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove)
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post('/subjects', {
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
        pinnedPostContent: formData.pinnedPostContent 
      });
      updateSubscriptions(data);
      setMessage(`Subject and Pinned Post established!`);
      setTimeout(() => navigate(`/`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.');
      setLoading(false);
    }
  };

  if (loading && !message) return <Loader message="Architecting subject and syllabus..." />;

  return (
    <main style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <header style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#003366' }}>Establish New Subject</h2>
        <p style={{ color: '#666' }}>Define the subject and initialize the official resource post below.</p>
      </header>

      {error && <ErrorDisplay message={error} />}
      {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={submitHandler}>
        {/* Subject Name */}
        <div style={fieldGroup}>
          <label htmlFor="name" style={labelStyle}>Subject Name</label>
          <input 
            type="text" 
            id="name" 
            placeholder="e.g. CS101: Introduction to Algorithms"
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={inputStyle} 
          />
        </div>

        {/* Short Description (One-liner) */}
        <div style={fieldGroup}>
          <label htmlFor="description" style={labelStyle}>One-line Description</label>
          <input 
            type="text" 
            id="description" 
            placeholder="A brief tagline for the subject card (e.g. Exploring Big O and Data Structures)"
            value={formData.description} 
            onChange={handleChange} 
            required 
            style={inputStyle} 
          />
        </div>

        {/* Multi-line Pinned Post Content */}
        <div style={fieldGroup}>
          <label htmlFor="pinnedPostContent" style={labelStyle}>Official Pinned Post (Syllabus/Resources)</label>
          <p style={subLabelStyle}>This will be the first post students see. Use it for links, rules, or course materials.</p>
          <textarea 
            id="pinnedPostContent" 
            value={formData.pinnedPostContent} 
            onChange={handleChange} 
            required
            style={{ ...inputStyle, height: '180px', lineHeight: '1.5' }} 
            placeholder="Enter syllabus details, grading criteria, or important resources here..." 
          />
        </div>

        {/* Tags */}
        <div style={fieldGroup}>
          <label htmlFor="tagInput" style={labelStyle}>Allowed Subject Tags</label>
          <input 
            type="text" 
            id="tagInput" 
            value={formData.tagInput} 
            onChange={handleChange} 
            onKeyDown={handleAddTag}
            style={inputStyle} 
            placeholder="Type tag and press Enter (e.g. Exam, Video, Note)" 
          />
          <div style={tagContainer}>
            {formData.tags.map(tag => (
              <span key={tag} style={tagStyle}>
                #{tag} 
                <button type="button" onClick={() => removeTag(tag)} style={tagDeleteBtn}>&times;</button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Processing...' : 'Create Subject & Initialize Post'}
        </button>
      </form>
    </main>
  );
};

const fieldGroup = { marginBottom: '20px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontWeight: 'bold', color: '#333', marginBottom: '5px' };
const subLabelStyle = { fontSize: '0.85rem', color: '#777', marginTop: '-5px', marginBottom: '8px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '1rem' };
const btnStyle = { padding: '15px', background: '#003366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.3s' };
const tagContainer = { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' };
const tagStyle = { background: '#f0f4f8', color: '#003366', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #d1d9e6', display: 'flex', alignItems: 'center' };
const tagDeleteBtn = { background: 'none', border: 'none', marginLeft: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#cc0000', lineHeight: '1' };

export default CreateSubjectPage;