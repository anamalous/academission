import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, initialComments }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await API.post(`/comments`,{content: text, postId: postId});
      setComments([data, ...comments]);
      setText('');
    } catch (err) { console.error("Comment submission failed", err); }
  };

  const handleRemoveComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to remove this comment?")) return;
    try {
      const endpoint = user.role === 'admin'? `/admin/comments/${commentId}`: `/comments/${commentId}`;
      await API.delete(endpoint);
      window.location.reload();

    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert(err.response?.data?.message || "Error deleting comment");
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h4>Discuss ({comments.length})</h4>
      <div style={{ borderTop: '1px solid #eee'}}>
        {comments.map((comment) => (
          <div key={comment._id} style={commentCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{fontSize:'12px', color:'grey'}}>@{comment.author?.username}</strong>
              <small style={{ color: '#999', fontSize:'15px' }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
            </div>
            <p style={{ marginTop: '5px', paddingLeft:'15px' }}>{comment.content}</p>
            {(user?.role === 'admin' || user?._id === comment.author._id) && (
              <button
                onClick={() => handleRemoveComment(comment._id)}
                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px'}}>
          <textarea
            style={textareaStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button type="submit" style={submitBtnStyle}>Post Comment</button>
        </form>
      ) : (
        <p style={{ color: '#666' }}>Please log in to participate in the discussion.</p>
      )}
    </div>
  );
};

// Simple Styles
const textareaStyle = { 
  width: '100%', 
  padding: '10px', 
  borderRadius: '5px', 
  border: '1px solid #ccc', 
  minHeight: '40px',  
  fontFamily:'Varela Round' 
};
const submitBtnStyle = { 
  padding: '10px 15px', 
  margin:'10px', 
  backgroundColor: '#50b4d8ff', 
  color: 'white', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer' 
};
const commentCardStyle = { 
  padding: '10px 0', 
  borderBottom: '1px solid #f9f9f9' 
};

export default CommentSection;