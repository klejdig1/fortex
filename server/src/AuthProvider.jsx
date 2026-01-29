import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApiBase } from './utils/api.js';

const API_BASE = getApiBase();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [access, setAccess] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAccess(token);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    async function login(email, password) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Login failed');
        localStorage.setItem('accessToken', j.accessToken);
        localStorage.setItem('refreshToken', j.refreshToken);
        localStorage.setItem('user', JSON.stringify(j.user));
        setAccess(j.accessToken);
        setUser(j.user);
    }

    async function register(email, password, name) {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Register failed');
        localStorage.setItem('accessToken', j.accessToken);
        localStorage.setItem('refreshToken', j.refreshToken);
        localStorage.setItem('user', JSON.stringify(j.user));
        setAccess(j.accessToken);
        setUser(j.user);
    }

    async function logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });
        } catch { /* empty */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setAccess(null);
        setUser(null);
    }

    return <AuthContext.Provider value={{ user, access, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}


