import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/users/profile/${id}`);
        setProfileData(data);
      } catch (err) {
        setError("Could not load user profile.");
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <Loader message="Loading Profile..." />;
  if (error) return <ErrorDisplay message={error} />;
  if (!profileData) return <div style={{ textAlign: 'center', marginTop: '50px' }}>User not found.</div>;

  const { user, posts } = profileData;

  const handleReport = async () => {
    if (!window.confirm("Are you sure you want to report this user?")) return;
    try {
      await API.post(`/users/report/${user._id}`, {});
      alert("Report submitted.");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting report.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '95%', margin: '30px auto', alignItems: 'center' }}>
      <div style={headerCard}>
        <div style={avatarCircle}>{user.username[0].toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0 }}>{user.username}</h2>
              <p style={{ color: '#666', margin: '5px 0' }}>{user.name}</p>
            </div>
            {currentUser._id !== user._id && (
              <button onClick={handleReport} style={reportBtnStyle}>🚩 Report</button>
            )}
          </div>
          <div style={infoGrid}>
            {user.location && (
              <span style={infoItem}>📍 {user.location}</span>
            )}
            {user.dob && (
              <span style={infoItem}>🎂 Born {formatDate(user.dob)}</span>
            )}
            <span style={infoItem}>📅 Joined {new Date(user.createdAt).getFullYear()}</span>
          </div>
          {user.bio && (<div style={bioSection}>{user.bio}</div>)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <span style={badge}>📚 {user.subscriptions?.length || 0} Subscriptions</span>
            <span style={badge}>✍️ {posts.length} Posts</span>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '40px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Contributions</h3>

      {posts.length > 0 ? (
        posts.map(post => <PostCard key={post._id} post={post} />)
      ) : (
        <p>No posts yet :(</p>
      )}
    </div>
  );
};

const headerCard = {
  display: 'flex',
  width: '90%',
  alignItems: 'flex-start',
  gap: '25px',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  border: '1px solid #eee',
  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
};

const infoGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginTop: '10px',
  fontSize: '0.9rem',
  color: '#555'
};

const infoItem = { display: 'flex', alignItems: 'center', gap: '5px' };

const bioSection = {
  marginTop: '10px',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '0.95rem'
};

const avatarCircle = {
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#003366', // Your academic navy
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: 'bold',
  flexShrink: 0
};

const badge = { backgroundColor: '#eef2ff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', color: '#3730a3', fontWeight: '500' };

const reportBtnStyle = {
  backgroundColor: 'transparent',
  color: '#dc3545',
  border: '1px solid #dc3545',
  padding: '5px 12px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '600'
};

export default Profile;