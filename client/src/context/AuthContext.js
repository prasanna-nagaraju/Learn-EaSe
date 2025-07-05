    import React, { createContext, useState, useEffect, useContext } from 'react';
    import authService from '../api/auth';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }, []);

        const login = async (email, password) => {
            const userData = await authService.login({ email, password });
            setUser(userData);
            return userData;
        };

        const register = async (name, email, password, role) => {
            const userData = await authService.register({ name, email, password, role });
            setUser(userData);
            return userData;
        };

        const logout = () => {
            authService.logout();
            setUser(null);
        };

        return (
            <AuthContext.Provider value={{ user, loading, login, register, logout }}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        return useContext(AuthContext);
    };
    