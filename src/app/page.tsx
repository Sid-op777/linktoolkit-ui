'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler} from 'react-hook-form';
import { motion } from 'framer-motion';
import { ImSpinner2 } from "react-icons/im";
import ExpiryTimeSelector from './ExpiryTimeSelector';

interface FormData {
  longUrl: string;
}

export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); //For error handling
  const [darkMode] = useState(false);
  const [expiry, setExpiry] = useState('P1M');
  const [expiryType, setExpiryType] = useState<'duration' | 'date'>('duration');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true); // Set loading state to true on submit

    try {
      let response
      const baseUrl = "https://linktoolkit-production.up.railway.app";

      if(expiryType=='duration'){
        response = await fetch(
          `${baseUrl}/shorten?longUrl=${encodeURIComponent(data.longUrl)}&life=${expiry}`
          , {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      }
      else{
        response = await fetch(
          `${baseUrl}/shorten?longUrl=${encodeURIComponent(data.longUrl)}&expiresAt=${expiry}`
          , {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      }
      
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    setShortenedUrl(`${baseUrl}/` + result.id); //Assuming short URL is in result.shortUrl
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
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
        <div className="container mx-auto flex items-center">
          <Image
            src="/assets/logo.svg"
            alt="LinkToolkit Logo"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white ml-2">LinkToolkit</h1>
        </div>
      </header>

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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-link-blue shadow-md dark:bg-gray-700 dark:text-white dark:border-gray-600"            />
            {errorMessage && (<p className="text-red-500">{errorMessage}</p>)}
            {errors.longUrl && <p className="text-red-500">{errors.longUrl.message}</p>}
          </div>
          <ExpiryTimeSelector onExpiryChange={handleExpiryChange}  expiryType={expiryType} setExpiryType={setExpiryType}/>
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