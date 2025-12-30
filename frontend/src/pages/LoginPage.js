import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await API.post(`/users/login`,{ email, password });
      const userData = {
        _id: data._id,
        username: data.username,
        email: data.email,
        token: data.token,
        subscriptions:data.subscriptions,
        role: data.role,
        lastSeen:data.lastSeen,
        warnings:data.warnings
      };

      console.log(userData);
      login(userData); 

      navigate('/');

    } catch (err) {
        console.log(err.message);
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login to Acade-Mission</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 15px', background: loading ? '#ccc' : '#3f51b5', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;