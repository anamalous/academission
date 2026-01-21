import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import ErrorDisplay from '../components/common/ErrorDisplay';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    bio: '',
    dob: ''
  });

  const [role, setRole] = useState('student');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      formData.role=role;
      const { data } = await API.post('/users/register', formData);
      login(data);
      setMessage('Registration successful! Welcome to Academission.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  if (loading && !message) return <Loader message="Creating your account..." />;

  return (
    <main style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Register a New Account</h2>

      {error && <ErrorDisplay message={error} />}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}

      <form onSubmit={submitHandler}>
        <div style={fieldGroup}>
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={formData.username} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" value={formData.dob} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{...fieldGroup,flexDirection:'row'}}>
          <label style={{marginRight:'10px'}}>
            <input
              type="radio"
              value="student"
              checked={role === 'student'}
              onChange={handleRoleChange}
            />
            Student
          </label>

          <label>
            <input
              type="radio"
              value="teacher"
              checked={role === 'teacher'}
              onChange={handleRoleChange}
            />
            Teacher
          </label>
        </div>

        <div style={fieldGroup}>
          <label htmlFor="location">Location (City/University)</label>
          <input type="text" id="location" value={formData.location} onChange={handleChange} style={inputStyle} placeholder="e.g. London, UK" />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" value={formData.bio} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} placeholder="Tell us about your academic interests..." />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={fieldGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />
        </div>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Processing...' : 'Register'}
        </button>
      </form>
    </main>
  );
};

const fieldGroup = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' };
const btnStyle = { padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default RegisterPage;