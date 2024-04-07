import React, { createContext, useState, useContext, useEffect } from 'react';
const UserContext = createContext();
import axios from 'axios';

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get('http://localhost:8000/current-user', config);
                    if (data?.success) {
                        console.log(data.user);
                        setUser(data.user);
                    }
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};