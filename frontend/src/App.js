import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PublicRoute from './components/PublicRoute';
import PostDetails from './pages/PostDetails';
import EditPostPage from './pages/EditPostPage';
import SubjectPage from './pages/SubjectPage';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Inbox from './pages/Inbox';
import FloatingActionButton from './components/CreateButton';


function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/edit-post/:id" element={<EditPostPage />} />
            <Route path="/subjects/:id" element={<SubjectPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/inbox" element={<Inbox />} />
          </Route>
        </Routes>
      </main>
      <FloatingActionButton/>
    </Router>
  );
}

export default App;