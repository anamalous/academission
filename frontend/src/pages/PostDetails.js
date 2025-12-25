import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to delete this discussion?")) {
      try {
        await API.delete(`/posts/${id}`);navigate("/");
      } catch (err) { 
        alert(err.response?.data?.message || "Failed to delete post"); 
      }
    }
  };

  if (loading) return <Loader message="Opening discussion..." />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '850px', margin: 'auto' }}>
      <Link to="/" style={backLinkStyle}>← Back to Feed</Link>

      <header style={{ marginTop: '30px', marginBottom: '20px' }}>
        <h1 style={titleStyle}>{post.title}</h1>
        <div style={metaStyle}>
          <span style={avatarCircle}>{post.author.username[0].toUpperCase()}</span>
          <span>
            Posted by <strong>{post.author.username}</strong> in <span style={subjectTag}>{post.subject.name}</span>
          </span>
        </div>
      </header>

      <div style={contentStyle}>
        {post.content}
      </div>

      <div style={controlPanelStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={statItemStyle}>
            <span style={{ color: '#ff4500', marginRight: '6px' }}>▲</span>
            <strong>{post.upvotes?.length || 0}</strong>
          </div>
          <div style={statItemStyle}>
            <span style={{ color: '#7193ff', marginRight: '6px' }}>▼</span>
            <strong>{post.downvotes?.length || 0}</strong>
          </div>
        </div>
        {user && post && user._id === post.author._id && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate(`/edit-post/${post._id}`)} 
              style={iconBtnStyle} 
              title="Edit Post"
            >
              ✏️
            </button>
            <button 
              onClick={deleteHandler} 
              style={{ ...iconBtnStyle, color: '#e74c3c' }} 
              title="Delete Post"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <CommentSection postId={post._id} initialComments={comments} />
    </div>
  );
};

const titleStyle = { fontSize: '2.4rem', fontWeight: '800', marginBottom: '15px', color: '#1a1a1a' };
const metaStyle = { display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '0.95rem' };
const avatarCircle = { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' };
const subjectTag = { backgroundColor: '#eef2ff', color: '#3730a3', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' };
const contentStyle = {
  marginTop: '30px',
  lineHeight: '1.7',
  fontSize: '1.15rem',
  color: '#333',
  whiteSpace: 'pre-wrap', 
  wordBreak: 'break-word',
  minHeight: '200px'
};

const controlPanelStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', 
  padding: '15px 25px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #eee',
  borderRadius: '15px',
  marginTop: '40px',
  marginBottom: '40px'
};

const statItemStyle = {
  marginRight: '30px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '1rem',
  color: '#444'
};

const iconBtnStyle = {
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '8px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1.1rem',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const backLinkStyle = { color: '#003366', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' };

export default PostDetails;