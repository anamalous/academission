import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Sidebar from '../components/SideBar';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get(`/posts`);
        setPosts(data);
        setLoading(false);

      } catch (err) {
        console.log("Error fetching posts:", err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };
    if (user)
      fetchPosts();
  }, [user]);

  if (loading) {return <Loader message='Loading your posts...'/>;}
  if (error) {return <ErrorDisplay/>;}

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, paddingLeft: '20px', paddingTop:'10px' }}>
        <h2>Your Discourse</h2>
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div style={emptyStateStyle}>
            <h3>📭 Your feed is feeling a bit lonely...</h3>
            <p>Subscribe to your favorite subjects in the sidebar to start seeing content here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const emptyStateStyle = {
  textAlign: 'center',
  marginTop: '50px',
  padding: '40px',
  backgroundColor: '#f4f4f9',
  borderRadius: '12px',
  color: '#555'
};
export default HomePage;