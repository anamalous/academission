import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios';

const AIDashboard = () => {
  const [stats, setStats] = useState({ Positive: 0, Negative: 0, Neutral: 0, Doubt: 0 });
  const [doubts, setDoubts] = useState([]);
  const navigate = useNavigate();
  const [topIssues, setTopIssues] = useState([]);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    const fetchVibes = async () => {
      const { data } = await API.get(`/posts?subject=${id}`);

      const doubtPosts = data
        .filter(p => p.sentiment === 'Doubt')
        .sort((a, b) => b.urgency - a.urgency);
      setDoubts(doubtPosts)

      const counts = data.reduce((acc, post) => {
        acc[post.sentiment] = (acc[post.sentiment] || 0) + 1;
        return acc;
      }, { Positive: 0, Negative: 0, Neutral: 0, Doubt: 0 });

      setStats(counts);

      const troubleTags = {};

      data.forEach(post => {
        if (post.sentiment === 'Doubt' || post.sentiment === 'Negative') {
          post.tags.forEach(tag => {
            troubleTags[tag] = (troubleTags[tag] || 0) + 1;
          });
        }
      });

      const sortedIssues = Object.entries(troubleTags)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setTopIssues(sortedIssues);
    };
    fetchVibes();
  }, [id]);

  const getSummary = async () => {
    setLoadingSummary(true);
    try {
      const { data } = await API.get(`/subjects/${id}/summary`);
      setSummary(data.summary);
    } catch (err) {
      setSummary("Error generating digest.");
    }
    setLoadingSummary(false);
  };

  return (
    <>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <div style={dashboardGrid}>
          <div style={vibeCard}>
            <h3>Classroom Sentiment Pulse</h3>
            <div style={barContainer}>
              {Object.entries(stats).map(([label, count]) => (
                <div key={label} style={{ marginBottom: '10px' }}>
                  <label>{label}: {count}</label>
                  <div style={{
                    height: '20px',
                    width: `${(count / Object.values(stats).reduce((a, b) => a + b, 0)) * 100}%`,
                    backgroundColor: label === 'Negative' ? '#ff4d4d' : label === 'Doubt' ? '#3a87d8' : label === 'Neutral' ? '#00b7ff' : '#4caf50',
                    borderRadius: '10px'
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={vibeCard}>
          <h3>🔍 Academic Doubt Tracker</h3>
          <p>The following posts were flagged by AI as requiring teacher intervention:</p>

          {doubts.length > 0 ? doubts.map(post => (
            <div key={post._id} style={doubtCardStyle(post.urgency)}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{post.title}</strong>
                <span style={urgencyBadge(post.urgency)}>Urgency: {post.urgency}/5</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>
                {post.content.substring(0, 120)}...
              </p>
              <button onClick={() => navigate(`/posts/${post._id}`)} style={solveBtn}>
                View post
              </button>
            </div>
          )) : (
            <p>No major confusion detected in this subject yet!</p>
          )}
        </div>
      </div>
      <div style={trendCardStyle}>
        <h3>🔥 Trend Analysis (Topic Clustering)</h3>
        {topIssues.length > 0 ? (
          <div>
            <p>AI has identified a cluster of confusion around these topics:</p>
            {topIssues.map(issue => (
              <div key={issue.tag} style={issueRowStyle}>
                <span style={tagPillStyle}>#{issue.tag}</span>
                <span>appears in <strong>{issue.count}</strong> frustrated posts</span>
              </div>
            ))}

            {/* The "AI Insight" Box */}
            <div style={aiInsightBox}>
              <p><strong>🤖 AI Suggestion:</strong></p>
              <p>
                Students are struggling with <strong>#{topIssues[0].tag}</strong>.
                Consider posting a video resource or hosting a quick Q&A session on this topic.
              </p>
            </div>
          </div>
        ) : (
          <p>No negative trends detected. You're doing a great job!</p>
        )}
      </div>
      <div style={summaryContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>📝 24-Hour AI Subject Digest</h3>
          <button onClick={getSummary} disabled={loadingSummary} style={summaryBtn}>
            {loadingSummary ? "Analyzing..." : "Generate Briefing"}
          </button>
        </div>

        {summary && (
          <div style={summaryBox}>
            {/* React renders the bullet points from Gemini here */}
            <div style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
          </div>
        )}
      </div>
    </>
  );
};

const dashboardGrid = { padding: '20px', display: 'grid', gap: '20px', width: '45%' };
const vibeCard = { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const barContainer = { marginTop: '20px' };
const doubtCardStyle = (urgency) => ({
  backgroundColor: '#fff',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '5px',
  borderLeft: `8px solid ${urgency >= 4 ? '#ef4444' : '#f59e0b'}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const urgencyBadge = (urgency) => ({
  backgroundColor: urgency >= 4 ? '#fee2e2' : '#fef3c7',
  color: urgency >= 4 ? '#991b1b' : '#92400e',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase'
});

const solveBtn = {
  marginTop: '10px',
  padding: '8px 15px',
  backgroundColor: '#003366',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  alignSelf: 'flex-start'
};

const trendCardStyle = {
  marginTop: '30px',
  padding: '20px',
  marginBottom: '40px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const issueRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '10px 0',
  borderBottom: '1px solid #f1f5f9'
};

const tagPillStyle = {
  backgroundColor: '#3b82f6',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '15px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const aiInsightBox = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#eff6ff', 
  borderLeft: '4px solid #3b82f6',
  borderRadius: '4px',
  color: '#1e40af'
};

const summaryContainer = {
  marginTop: '30px',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  border: '1px solid #e2e8f0',
};

const summaryBtn = {
  backgroundColor: '#10b981',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const summaryBox = {
  marginTop: '15px',
  padding: '20px',
  backgroundColor: '#f0fdf4',
  borderLeft: '5px solid #10b981',
  borderRadius: '8px',
  lineHeight: '1.6',
  color: '#065f46'
};

export default AIDashboard;