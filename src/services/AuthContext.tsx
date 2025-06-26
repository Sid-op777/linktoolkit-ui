// services/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearToken, getToken, setToken, initApiClient } from './apiClient';

// Define the shape of the User object based on your backend's /api/user/me response
interface User {
    id: string;
    email: string;
    apiKey: string | null;
    createdAt: string;
}

// Define the shape of the context value
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const performAuthAction = async (endpoint: string, payload: object) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Authentication failed');
        }

        const { token: accessToken } = data;
        setToken(accessToken);
        await fetchUserProfile();
    };

    const login = (email: string, password: string) => {
        return performAuthAction('/api/auth/login', { email, password });
    };

    const register = (email: string, password: string) => {
        // Here we can pass the anonymousSessionId if we have it
        return performAuthAction('/api/auth/register', { email, password });
    };

    const logout = async () => {
        clearToken();
        setUser(null);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    };

    const fetchUserProfile = async () => {
        if (!getToken()) {
            setIsLoading(false);
            return;
        }
        try {
            // We use the regular fetch here because apiClient would cause an infinite loop if /me fails
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/me`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const userData: User = await res.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        initApiClient(logout);
        const checkSession = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    const { token: newAccessToken } = await res.json();
                    setToken(newAccessToken);
                    await fetchUserProfile();
                } else {
                    setIsLoading(false);
                }
            } catch {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const value = { user, isAuthenticated: !!user, isLoading, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};