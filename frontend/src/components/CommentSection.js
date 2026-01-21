import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, initialComments, subjectCreatorId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState('');

  console.log(user);
  console.log(subjectCreatorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await API.post(`/comments`, { content: text, postId: postId });
      setComments([data, ...comments]);
      setText('');
    } catch (err) { console.error("Comment submission failed", err); }
  };

  const handleVerifyToggle = async (commentId, currentlyVerified) => {
    const confirmMsg = currentlyVerified 
      ? "Remove verification from this answer?" 
      : "Mark this answer as Professor Verified?";
      
    if (!window.confirm(confirmMsg)) return;

    try {
      const { data } = await API.put(`/comments/${commentId}`);
      
      setComments(prev => prev.map(c => 
        c._id === commentId ? { ...c, isVerified: data.isVerified } : c
      ));
    } catch (err) {
      console.log("Verification failed", err);
      alert("Failed to update verification status.");
    }
  };

  const handleRemoveComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to remove this comment?")) return;
    try {
      const endpoint = user.role === 'admin' ? `/admin/comments/${commentId}` : `/comments/${commentId}`;
      await API.delete(endpoint);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert(err.response?.data?.message || "Error deleting comment");
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h4>Discuss ({comments.length})</h4>
      <div style={{ borderTop: '1px solid #eee' }}>
        {comments.map((comment) => (
          <div key={comment._id} style={commentCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                
                <strong style={{ fontSize: '12px', color: 'grey' }}>@{comment.author?.username}</strong>
                
                {/* 2. Visual Blue Tick */}
                {comment.isVerified && (
                  <span style={{ color: '#1da1f2', fontSize: '14px', fontWeight: 'bold' }}>
                    ✔️ Verified Answer
                  </span>
                )}
              </div>
              <small style={{ color: '#999', fontSize: '15px' }}>{new Date(comment.createdAt).toLocaleDateString()}</small>
            </div>

            <p style={{ marginTop: '5px', paddingLeft: '15px' }}>{comment.content}</p>

            <div style={{ display: 'flex', gap: '15px', paddingLeft: '15px', marginTop: '5px' }}>
              {/* 3. The Professor's Verification Checkbox */}
              {user?.role === 'teacher' && user?._id === subjectCreatorId && (
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px', color: '#003366' }}>
                  <input
                    type="checkbox"
                    checked={comment.isVerified || false}
                    onChange={() => handleVerifyToggle(comment._id, comment.isVerified)}
                    style={{ marginRight: '5px' }}
                  />
                  Verify Student Answer
                </label>
              )}

              {/* Remove button logic */}
              {(user?.role === 'admin' || user?._id === comment.author?._id) && (
                <button
                  onClick={() => handleRemoveComment(comment._id)}
                  style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {(user && user.role==='user') ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', marginTop: '20px' }}>
          <textarea
            style={textareaStyle}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button type="submit" style={submitBtnStyle}>Post Comment</button>
        </form>
      ) : (
        <p style={{ color: '#666' }}>Student accounts can comment.</p>
      )}
    </div>
  );
};

const textareaStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '60px', fontFamily: 'Varela Round' };
const submitBtnStyle = { padding: '10px 15px', marginTop: '10px', backgroundColor: '#50b4d8ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const commentCardStyle = { padding: '15px 0', borderBottom: '1px solid #f2f2f2' };

export default CommentSection;