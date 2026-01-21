import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Sidebar from '../components/SideBar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SubjectPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [subject, setSubject] = useState(null);
  const [pinnedPost, setPinnedPost] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    const fetchSubjectContent = async () => {
      try {
        const subRes = await API.get(`/subjects/${id}`);
        setSubject(subRes.data);

        const postRes = await API.get(`/posts?subject=${id}`);
        const allPosts = postRes.data;

        const officialPost = allPosts.find(p => p._id === subRes.data.pinnedPost);
        const discussionPosts = allPosts.filter(p => p._id !== subRes.data.pinnedPost);

        setPinnedPost(officialPost);
        setPosts(discussionPosts);
      } catch (err) {
        console.error("Error loading subject page:", err);
      }
    };
    fetchSubjectContent();
  }, [id]);

  const filteredPosts = posts.filter(post =>
    filterTag === '' || post.tags?.includes(filterTag)
  );

  const handleAddSubjectTag = async (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      console.log(newTag);
      await API.patch(`/subjects/${id}/tags`, { tags: newTag });
      setSubject({ ...subject, tags: [...subject.tags, newTag] });
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        {subject && (
          <>
            <h1>📚 {subject.name}</h1>
            <p style={{ color: '#666' }}>{subject.description}</p>

            {user?._id === subject.creator && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="+ Add Official Tag (Enter)"
                  onKeyDown={handleAddSubjectTag}
                  style={tagInputStyle}
                />
              </div>
            )}

            {pinnedPost && (
              <div style={pinnedSectionStyle}>
                <small style={{ fontWeight: 'bold', color: '#856404' }}>📌 PINNED RESOURCE</small>
                <PostCard post={pinnedPost} />
              </div>
            )}

            <hr style={{ margin: '30px 0', opacity: 0.3 }} />

            {/* 3. FILTER UI */}
            <div style={filterBarContainer}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  list="subject-tags"
                  placeholder="🔍 Filter by tag (e.g. #Exam, #Doubt)..."
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  style={filterInputStyle}
                />
                <datalist id="subject-tags">
                  {subject.tags?.map(tag => (
                    <option key={tag} value={tag} />
                  ))}
                </datalist>
              </div>

              {filterTag && (
                <button onClick={() => setFilterTag('')} style={clearBtnStyle}>
                  Clear Filter
                </button>
              )}
            </div>
          </>
        )}

        {/* 4. RENDER FILTERED POSTS */}
        <div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post._id} post={post} />)
          ) : (
            <div style={{ textAlign: 'center', marginTop: '40px', color: '#999' }}>
              <p>No posts match your filters</p>
              <button onClick={() => setFilterTag('')} style={{ color: '#003366', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Show all posts
              </button>
            </div>
          )}
        </div>
        {subject && user?._id === subject.creator && (
              <button
                onClick={() => navigate(`/subject/${id}/dashboard`)}
                style={dashboardBtnStyle}
              >
                📊 View AI Insights
              </button>
            )}
      </div>
    </div>
  );
};

const pinnedSectionStyle = {
  background: '#fff9e6',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid #ffeeba',
  marginBottom: '20px'
};

const filterBarContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '25px',
  backgroundColor: '#f8f9fa',
  padding: '10px',
  borderRadius: '8px'
};

const filterInputStyle = {
  width: '90%',
  padding: '10px 15px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none'
};

const clearBtnStyle = {
  padding: '8px 15px',
  backgroundColor: '#fff',
  border: '1px solid #dc3545',
  color: '#dc3545',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px'
};

const tagInputStyle = {
  padding: '8px 12px 8px',
  marginBottom: '20px',
  borderRadius: '20px',
  border: '1.5px solid #ddd',
  fontSize: '14px',
  outline: 'none',
  width: '200px',
  transition: 'border-color 0.3s',
  fontFamily: 'inherit'
};

const dashboardBtnStyle = {
  backgroundColor: '#003366', 
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '25px',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginTop: '30px',
  gap: '8px',
  boxShadow: '0 4px 12px rgba(0, 51, 102, 0.2)',
  transition: 'all 0.3s ease',
  marginBottom: '20px',
  textDecoration: 'none'
};

export default SubjectPage;