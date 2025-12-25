import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Sidebar from '../components/SideBar';
import API from '../api/axios';

const SubjectPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const fetchSubjectContent = async () => {
      try {
        const subRes = await API.get(`/subjects/${id}`);
        setSubject(subRes.data);
        const postRes = await API.get(`/posts?subject=${id}`);
        setPosts(postRes.data);
      } catch (err) {
        console.error("Error loading subject page:", err);
      }
    };
    fetchSubjectContent();
  }, [id]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, paddingLeft: '20px', paddingTop:'5px' }}>
        {subject && (
          <>
            <h1>📚 {subject.name}</h1>
            <p style={{paddingLeft:'20px'}}>{subject.description}</p>
          </>
        )}
        <hr/>
        <div>
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post._id} post={post} />)
          ) : (
            <p>No posts in this subject yet. Start the conversation!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;