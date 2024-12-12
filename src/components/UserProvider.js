import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = Cookies.get('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return Cookies.get('token') || null;
    });

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);


        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        Cookies.set('token', authToken, { expires: 7 });

        axios.defaults.headers.common['Authorization'] = authToken;
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        Cookies.remove('user');
        Cookies.remove('token');

        delete axios.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ user, login, logout, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
