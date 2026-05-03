import React, { createContext, useState, useEffect } from 'react';
import { authMe, authLogin, authLogout, authRegister } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: validate existing cookie with the server
    useEffect(() => {
        authMe()
            .then(res => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await authLogin({ email, password });
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        await authRegister({ name, email, password });
    };

    const logout = async () => {
        await authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
