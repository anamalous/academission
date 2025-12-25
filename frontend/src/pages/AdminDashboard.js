import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('domains');
  const [data, setData] = useState({ domains: [], subjects: [], users: [], recents: [] });
  const [newInput, setNewInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'domains') {
          const res = await API.get(`/admin/domains`);
          setData(prev => ({ ...prev, domains: res.data }));
        } else if (activeTab === 'subjects') {
          const res = await API.get(`/subjects`);
          setData(prev => ({ ...prev, subjects: res.data }));
        } else if (activeTab === 'users') {
          const res = await API.get(`/admin/users`);
          setData(prev => ({ ...prev, users: res.data }));
        }
        else if (activeTab === 'recents') {
          const sinceTime = user.lastSeen;
          const res = await API.get(`/admin/recent-activity?since=${sinceTime}`);
          setData(prev => ({ ...prev, recents: res.data }));
        }
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [activeTab,data,user.lastSeen]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'domains') {
        await API.post(`/admin/domains`, { host: newInput });
      } else if (activeTab === 'subjects') {//add description textbox
        await API.post(`/subjects`, { name: newInput });
      }
      setNewInput("");
    } catch (err) { alert(err.response.data.message); }
  };

  const handleWarn = async (userId) => {
    const message = window.prompt("Enter the warning message for the user (they will see this):");
    if (!message) return;
    const adminReason = window.prompt("Internal reason for this warning (admins only):");
    if (!adminReason) return;

    try {
      await API.post(`/admin/warn`, { userId, message, adminReason });
      alert("Warning issued successfully!");
    } catch (err) {
      console.error("Warning failed:", err);
      alert(err.response?.data?.message || "Failed to send warning");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to blacklist domain?")) return;
    try {
      await API.delete(`/admin/domains/${id}`);
    } catch (err) { console.error(err); }
  };

  const handleAddDescription = async (id) => {
    const desc = window.prompt("Enter description:");
    if (!desc) return;
    try {
      await API.put(`/subjects/${id}/desc`, { description:desc });
      alert("Description Updated Successfully!");
    } catch (err) {
      console.error("Warning failed:", err);
      alert(err.response?.data?.message || "Failed to send update");
    }
  }

  return (
    <div style={containerStyle}>
      <h1>Admin Console</h1>
      <div style={tabBar}>
        {['domains', 'subjects', 'users', 'recents'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...tabBtn, borderBottom: activeTab === tab ? '3px solid #007bff' : 'none' }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab !== 'users' && activeTab !== 'recents' && (
        <form onSubmit={handleAdd} style={formStyle}>
          <input
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder={`Add new ${activeTab.slice(0, -1)}...`}
            style={inputStyle}
          />
          <button type="submit" style={addBtn}>Add</button>
        </form>
      )}
      <table style={tableStyle} cellPadding={'5px'}>
        <thead>
          <tr>
            <th>Name/Host</th>
            {activeTab !== "recents" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {activeTab !== 'users' ? data[activeTab].map(item => (
            <tr key={item._id}>
              <td>
                {activeTab === 'users' ? (
                  <Link
                    to={`/profile/${item._id}`}
                    style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}
                  >
                    @{item.username}
                  </Link>
                ) : activeTab === 'subjects' ? (
                  <Link
                    to={`/subjects/${item._id}`}
                    style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}
                  >
                    {item.name}
                  </Link>
                ) : activeTab === 'recents' ? (
                  <PostCard key={item._id} post={item} />
                ) : (
                  item.host 
                )}
              </td>
              {activeTab === "domains" && <td>
                <button onClick={() => handleDelete(item._id)} style={delBtn}>Remove</button>
              </td>}
              {activeTab === "subjects" && <td>
                <button onClick={() => handleAddDescription(item._id)} style={{...delBtn, backgroundColor: '#50b4d8ff', }}>
                  Add Description
                </button>
              </td>}
            </tr>
          )) :
            data['users'].map(item => (
              <tr key={item._id}>
                <td>
                  <Link to={`/profile/${item._id}`}>@{item.username}</Link>
                  {item.reportCount > 0 && (
                    <span style={reportBadgeStyle}>🚩 {item.reportCount} Reports Today</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleWarn(item._id)} style={delBtn}>WARN</button>&nbsp;
                  <button onClick={() => handleDelete(item._id)} style={delBtn}>DELETE?</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '20px' };
const tabBar = { display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #ddd' };
const tabBtn = { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
const formStyle = { display: 'flex', gap: '10px', marginBottom: '20px' };
const inputStyle = { flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };
const addBtn = { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' };
const delBtn = { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '7px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft:'10px' };
const reportBadgeStyle = { marginLeft: '10px', backgroundColor: '#fff0f0', color: '#d9534f', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #d9534f' };

export default AdminDashboard;