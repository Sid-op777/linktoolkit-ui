'use client';

import { useAuth } from '@/services/AuthContext';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleDisabled] = useState(true); //temporaily disabling oauth because there are some issues

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic frontend validation
        if (!email || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        // Simple email regex (not bulletproof, but sufficient for frontend validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (activeTab === 'register' && password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (activeTab === 'login') {
                await login(email, password);
            } else {
                await register(email, password);
            }
            onClose(); 
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
                    >
                        ×
                    </button>

                    {/* Tab Switch */}
                    <div className="flex mb-4 justify-center">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`px-4 py-2 font-medium rounded-l-md ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`px-4 py-2 font-medium rounded-r-md ${activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            Register
                        </button>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="flex flex-col space-y-3 mb-4">
                        <button className={`flex items-center justify-center gap-2 bg-white border dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded 
                        ${isGoogleDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                        onClick={()=>{
                            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/oauth2/authorization/google`;
                        }}
                        disabled = {isGoogleDisabled}
                        >
                            <FaGoogle /> Continue with Google (temporaily disabled)
                        </button>
                        {/*
                        <button className="flex items-center justify-center gap-2 bg-white border dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <FaGithub /> Continue with GitHub
                        </button>
                        */}
                    </div>

                    {/* Divider */}
                    <div className="text-center text-sm text-gray-400 mb-4">or</div>

                    {/* Forms */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (activeTab === 'login' ? 'Logging in...' : 'Registering...') : activeTab === 'login' ? 'Login' : 'Register'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
