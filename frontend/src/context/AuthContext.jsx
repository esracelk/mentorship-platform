import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const login = (jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);

        try {
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            if (payload.role) {
                localStorage.setItem('role', payload.role);
                setRole(payload.role);
            }
        } catch (error) {
            console.error("Token parse error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
