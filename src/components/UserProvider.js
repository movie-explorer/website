import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        Cookies.set('token', authToken, { expires: 7 }); 
    };

    const logout = () => {
        setUser(null); 
        setToken(null);
        Cookies.remove('token');
        delete axios.defaults.headers.common['Authorization']; 
    };

    useEffect(() => {
        const tokenFromCookies = Cookies.get('token');
        console.log('Token haettu evästeistä:', tokenFromCookies); 
        if (tokenFromCookies) {
            setToken(tokenFromCookies);
            axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromCookies}`; 
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, token }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
