    import React from 'react';
    import { Navigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';

    const PrivateRoute = ({ component: Component, roles, ...rest }) => {
        const { user, loading } = useAuth();

        if (loading) {
            return <div>Loading...</div>; // Or a spinner
        }

        if (!user) {
            // Not logged in, redirect to login page
            return <Navigate to="/login" />;
        }

        if (roles && !roles.includes(user.role)) {
            // Not authorized, redirect to home or unauthorized page
            return <Navigate to="/" />; // Or a specific unauthorized page
        }

        return <Component {...rest} />;
    };

    export default PrivateRoute;
    