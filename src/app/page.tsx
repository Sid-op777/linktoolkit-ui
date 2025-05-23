'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ImSpinner2 } from "react-icons/im";
import ExpiryTimeSelector from './ExpiryTimeSelector';
import AuthModal from '../components/AuthModal';

interface FormData {
  longUrl: string;
}

type RequestBody = {
  longUrl: string;
  life?: string;
  expiresAt?: string;
};

export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); //For error handling
  const [darkMode] = useState(false);
  const [expiry, setExpiry] = useState('P1M');
  const [expiryType, setExpiryType] = useState<'duration' | 'date'>('duration');
  const [isServerOffline, setIsServerOffline] = useState(false); // Add state for server offline alert
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if a valid token exists in localStorage on page load
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT
    setIsLoggedIn(false); // Update state
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const response = await fetch(`${baseUrl}/ping`); 
        if (response.ok) {
          setIsServerOffline(false); // Server is online
        } else {
          setIsServerOffline(true); // Server is offline
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setIsServerOffline(true); // Server is offline if there's an error
      }
    };
    checkServerStatus();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true); // Set loading state to true on submit

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

      const requestBody: RequestBody = {
        longUrl: data.longUrl,
      };

      if (expiryType === 'duration') {
        requestBody.life = expiry;
      } else {
        requestBody.expiresAt = expiry;
      }

      const response = await fetch(`${baseUrl}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setShortenedUrl(`${baseUrl}/${result.id}`);
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      console.error('Error shortening URL:', error);
      setErrorMessage('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state back to false after API call
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleExpiryChange = (newExpiry: string) => {
    setExpiry(newExpiry);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white`}>
      {/* Server Offline Notification */}
      {isServerOffline && (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-center py-2 px-4 rounded-md shadow-md transition-all duration-300 ease-out"
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
          Server Offline
        </div>
      )}

      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
        <div className="container mx-auto flex items-center">
          <Image
            src="/assets/logo.svg"
            alt="LinkToolkit Logo"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white ml-2">
            LinkToolkit
          </h1>
          <div className="ml-auto">
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

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Main Content Section */}
      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-4 w-full"
        >
          <div>
            <input
              type="url"
              {...register('longUrl', {
                required: 'URL is required',
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/, // Basic URL pattern
                  message: 'Invalid URL format',
                },
              })}
              placeholder="Paste a long URL"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-link-blue shadow-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            {errorMessage && (<p className="text-red-500">{errorMessage}</p>)}
            {errors.longUrl && <p className="text-red-500">{errors.longUrl.message}</p>}
          </div>
          <ExpiryTimeSelector onExpiryChange={handleExpiryChange} expiryType={expiryType} setExpiryType={setExpiryType} />
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ImSpinner2 className="size-5 animate-spin mr-4" />
                  Loading...
                </>
              ) : (
                'Shorten'
              )}
            </button>
          </div>
        </form>

        {/* Shortened URL Display */}
        {shortenedUrl && (
          <motion.div
            className="mt-6 w-fit relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              className="w-full px-4 py-2 pr-18 border rounded-md focus:outline-none shadow-lg text-gray-700 dark:bg-gray-800 dark:text-white"
              style={{ borderColor: '#54A2FC' }}
            />
            <div className="absolute top-0 right-0 h-full flex items-center pr-2">
              <button
                onClick={handleCopyClick}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </motion.div>
        )}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
        <Image
          src="/assets/nx7.svg"
          alt="LinkToolkit Logo"
          width={42}
          height={42}
          className='mx-auto'
        />
      </footer>
    </div>

  );
}