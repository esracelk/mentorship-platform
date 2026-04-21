import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { role, isAuthenticated } = useAuth();

    // Not logged in -> send to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Checking string 'role' against an array of roles (e.g. ['STUDENT', 'ALUMNI'])
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
