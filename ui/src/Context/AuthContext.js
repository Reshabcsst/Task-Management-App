import { createContext, useEffect } from 'react';
import axios from 'axios';
import Host from '../Utils/Utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${Host}/api/check-auth`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    localStorage.setItem('isToken', true);
                })
                .catch(() => {
                    logout();
                });
        }
    }, []);


    const login = async (credentials) => {
        const { data } = await axios.post(`${Host}/api/login`, credentials);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isToken', true);
        window.location.reload();
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('isToken', false);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
