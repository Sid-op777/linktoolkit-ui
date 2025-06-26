'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { useAuth } from '@/services/AuthContext';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isServerOffline, setIsServerOffline] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);


    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
                const response = await fetch(`${baseUrl}/api/health`);
                setIsServerOffline(!response.ok);
            } catch {
                setIsServerOffline(true);
            }
        };
        checkServerStatus();
    }, []);

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/shortener', label: 'URL Shortener' },
        { href: '/qr-codes', label: 'QR Codes' },
        { href: '/analytics', label: 'Analytics' },
        { href: '/utm-builder', label: 'UTM Builder' },
    ];

    return (
        <>
            {isServerOffline && (
                <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md shadow-md z-50">
                    Server Offline
                </div>
            )}
            <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image src="/assets/logo.svg" alt="LinkToolkit Logo" width={28} height={28} />
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white ml-2">
                            LinkToolkit
                        </h1>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                                    pathname === item.href
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section (Button) */}
                    <div className="hidden lg:block">
                        {isAuthenticated  ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                Login/Register
                            </button>
                        )}
                    </div>

                    {/* Hamburger Button (Mobile) */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-800 dark:text-white focus:outline-none"
                        >
                            ☰
                        </button>
                    </div>
                </div>
                
                {/* Backdrop Overlay */}
                {menuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}

                {/* Mobile Dropdown Menu */}
                <div
                className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 flex flex-col space-y-4">
                    {/* Close Button */}
                    <button
                        className="self-end text-2xl text-gray-700 dark:text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        ×
                    </button>

                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 rounded-md font-medium ${
                                pathname === item.href
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {isAuthenticated  ? (
                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setIsAuthModalOpen(true);
                                setMenuOpen(false);
                            }}
                            className="px-4 py-2 bg-blue-400 text-white rounded-md"
                        >
                            Login/Register
                        </button>
                    )}
                </div>
            </div>


            </header>

            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </>
    );
}
