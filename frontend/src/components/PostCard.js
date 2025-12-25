import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const PostCard = ({ post }) => {

  const { user } = useAuth();
  const [score, setScore] = useState(post.voteScore || 0);
  const [userVote, setUserVote] = useState(
    post.upvotes?.includes(user?._id) ? 'up' :
      post.downvotes?.includes(user?._id) ? 'down' : null
  );

  const canDelete = user && (user.role === 'admin');
  const posted=new Date(post.createdAt);

  const handleDelete = async () => {
    if (window.confirm("Admin Action: Delete this post permanently?")) {
      await API.delete(`/admin/posts/${post._id}`);
      window.location.reload(); 
    }
  };

  const handleVote = async (type) => {
    if (!user) return alert("Please log in to vote!");
    let newScore = score; let newVote = type;

    if (userVote === type) {
      newScore = type === 'up' ? score - 1 : score + 1;
      newVote = null;
    } else {
      if (userVote === 'up') newScore -= 1;
      if (userVote === 'down') newScore += 1;
      newScore = type === 'up' ? newScore + 1 : newScore - 1;
    }
    setScore(newScore);
    setUserVote(newVote);

    try {await API.put(`/posts/${post._id}/vote`, { voteType: type });
    } catch (err) {
      setScore(post.voteScore);
      setUserVote(userVote);
      alert("Vote failed to register.");
    }
  };

  return (
    <div style={cardStyle}>
      <Link to={`/posts/${post._id}`} style={linkStyle}>
        <h3>{post.title}</h3>
      </Link>
      <p style={authorSec}>
        <Link to={`/profile/${post.author._id}`} style={{ color: 'inherit', fontWeight: 'bold' }}>
          {post.author.username}
        </Link> @ {post.subject.name}
      </p>
      <p>{post.content.substring(0, 100)}...</p>
      <div style={actionBar}>
        <div style={{justifyContent:'space-between', display:'flex', alignItems:'center', width:'100%'}}>
          <div style={horizontalVoteBox}>
            <button
              onClick={() => handleVote('up')}
              style={{ ...arrowBtn, color: userVote === 'up' ? '#ff4500' : '#888' }}
            >
              🡅
            </button>
            <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{score}</span>
            <button
              onClick={() => handleVote('down')}
              style={{ ...arrowBtn, color: userVote === 'down' ? '#7193ff' : '#888' }}
            >
              🡇
            </button>
          </div>
          <span style={{ margin: '0 10px', color: 'grey'}}>{posted.toLocaleDateString()}</span>
        </div>
      </div>
      {canDelete && (
        <button onClick={handleDelete} style={adminDelBtnStyle}>
          🗑️ Admin Delete
        </button>
      )}
    </div>
  );
};

const linkStyle={
  textDecoration:'none',
  color:'black'
}
const cardStyle = {
  padding: '2px 10px 3px',
  boxShadow: '5px 5px 5px grey',
  marginBottom: '20px',
  borderRadius: '8px',
  backgroundColor: '#f4f4f4',
};

const actionBar = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 15px',
  borderTop: '1px solid #f0f0f0',
  gap: '20px' 
};

const horizontalVoteBox = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '20px',
  padding: '2px 10px'
};

const arrowBtn = {
  background: 'none',
  border: 'none',
  fontSize: '1.1rem',
  cursor: 'pointer',
  padding: '5px',
  display: 'flex',
  alignItems: 'center'
};

const adminDelBtnStyle = {
  backgroundColor: '#fff',
  color: '#d9534f',
  border: '1px solid #d9534f',
  padding: '5px 10px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  float: 'right'
};

const authorSec = {
  fontSize: '15px',
  color: 'grey'
}

export default PostCard;