import React, { useEffect } from 'react';
import { useUser } from '../components/UserProvider.js'; 
import axios from 'axios';
import Cookies from 'js-cookie';

const Refresh = () => {
    const { login, token } = useUser();

    useEffect(() => {
        const savedUser = Cookies.get('user');
        const savedToken = Cookies.get('token');

        if (savedUser && savedToken && !token) {
            const parsedUser = JSON.parse(savedUser);
            login(parsedUser, savedToken);

            axios.defaults.headers.common['Authorization'] = savedToken;
        }
    }, [login, token]);

    return null; 
};

export default Refresh;
