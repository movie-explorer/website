import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        delete axios.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ user, login, logout, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
