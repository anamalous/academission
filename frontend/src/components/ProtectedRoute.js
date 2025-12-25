import { Navigate, Outlet } from 'react-router-dom'; // Added Outlet
import { useAuth } from '../context/AuthContext';
import Loader from './common/Loader';

const ProtectedRoute = () => {
    const {user, isAuthenticated, loading} = useAuth();
    if (loading) {return <Loader message='Loading'/>;}
    if (!user || !isAuthenticated) {return <Navigate to="/login" replace/>;}
    return <Outlet />;
};

export default ProtectedRoute;