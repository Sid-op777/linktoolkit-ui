'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isServerOffline, setIsServerOffline] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
                const response = await fetch(`${baseUrl}/ping`);
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
                <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md shadow-md">
                    Server Offline
                </div>
            )}
            <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
                <div className="container mx-auto flex items-center">
                    <div className="flex items-center">
                        <Image src="/assets/logo.svg" alt="LinkToolkit Logo" width={28} height={28} />
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white ml-2">
                            LinkToolkit
                        </h1>
                    </div>

                    <div className="flex-1 flex justify-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${pathname === item.href
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-4 py-2 bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
