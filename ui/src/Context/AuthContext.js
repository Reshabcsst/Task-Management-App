import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Host from '../Utils/Utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(localStorage.getItem('setIsAuthenticated')));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${Host}/api/check-auth`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    setIsAuthenticated(true);
                    localStorage.setItem('setIsAuthenticated', true);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);


    const login = async (credentials) => {
        const { data } = await axios.post(`${Host}/api/login`, credentials);
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('setIsAuthenticated');
        setIsAuthenticated(false);
        navigate('/'); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
