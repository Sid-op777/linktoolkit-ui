'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';

// Define an interface for the form data
interface FormData {
  longUrl: string;
}

export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const { register, handleSubmit } = useForm<FormData>();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true); // Set loading state to true on submit

    try {
      const response = await fetch(
        `http://localhost:8080/shorten?longUrl=${encodeURIComponent(data.longUrl)}&life=P1M`
        , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    setShortenedUrl('http:localhost:8080/'+result.id); //Assuming short URL is in result.shortUrl
    } catch (error) {
      console.error('Error shortening URL:', error);
      // Handle error (e.g., display an error message)
    } finally {
      setIsLoading(false); // Set loading state back to false after API call
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-md py-4 px-6 w-full">
        <div className="container mx-auto flex items-center">
          <Image
            src="/assets/logo.svg"
            alt="LinkToolkit Logo"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-semibold text-gray-800 ml-2">LinkToolkit</h1>
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
              {...register('longUrl', { required: true })}
              placeholder="Paste a long URL"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-link-blue shadow-md"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {isLoading ? 'Loading...' : 'Shorten'} {/* Conditionally render button text */}
            </button>
          </div>
        </form>

        {/* Shortened URL Display */}
        {shortenedUrl && (
          <div className="mt-6 w-fit relative">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              className="w-full px-4 py-2 pr-18 border rounded-md focus:outline-none shadow-lg text-gray-700"
              style={{ borderColor: '#54A2FC' }}
            />
            <div className="absolute top-0 right-0 h-full flex items-center pr-2">
              <button
                onClick={handleCopyClick}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}