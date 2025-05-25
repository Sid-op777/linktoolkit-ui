'use client';


import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ImSpinner2 } from 'react-icons/im';
import ExpiryTimeSelector from './ExpiryTimeSelector';
import FeatureCard from '../components/FeatureCard';
import { LinkIcon } from '@/components/LinkIcon';
import Link from 'next/link';
import { Button } from '@/components/Button';

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expiry, setExpiry] = useState('P1M');
  const [expiryType, setExpiryType] = useState<'duration' | 'date'>('duration');
  // const [isServerOffline, setIsServerOffline] = useState(false);

  //  useEffect(() => {
  //   const checkServerStatus = async () => {
  //     try {
  //       const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  //       const response = await fetch(`${baseUrl}/ping`);
  //       setIsServerOffline(!response.ok);
  //     } catch {
  //       setIsServerOffline(true);
  //     }
  //   };
  //   checkServerStatus();
  // }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

      const requestBody: RequestBody = {
        longUrl: data.longUrl,
        ...(expiryType === 'duration' ? { life: expiry } : { expiresAt: expiry }),
      };

      const response = await fetch(`${baseUrl}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error();
      const result = await response.json();
      setShortenedUrl(`${baseUrl}/${result.id}`);
      setErrorMessage('');
    } catch {
      setErrorMessage('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      {/* {isServerOffline && (
        <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md shadow-md">
          Server Offline
        </div>
      )} */}

      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-6">
        LinkToolkit
      </h1>

      <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto">
        Your all-in-one solution for managing, tracking, and optimizing your links. Effortlessly shorten URLs, generate QR codes, build UTM campaigns, and analyze performance.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <Link href="/shortener">
          <Button variant="primary" size="lg">Shorten a URL</Button>
        </Link>
        <Link href="/analytics">
          <Button variant="secondary" size="lg">View Analytics</Button>
        </Link>
      </div>

      <section className="w-full max-w-5xl">
        <h2 className="text-3xl font-semibold text-slate-100 mb-8">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            title="URL Shortener"
            description="Create clean, short links from long URLs. Perfect for sharing and branding."
            icon={<LinkIcon className="w-6 h-6" />}
            linkTo="/shortener"
          />
          <FeatureCard 
            title="QR Code Generator"
            description="Instantly generate QR codes for your links. Download in various formats."
            icon={<LinkIcon className="w-6 h-6" />}
            linkTo="/qr-code"
          />
          <FeatureCard 
            title="Analytics Dashboard"
            description="Track link performance with detailed analytics on clicks, referrers, and more."
            icon={<LinkIcon className="w-6 h-6" />}
            linkTo="/analytics"
          />
          <FeatureCard 
            title="UTM Builder"
            description="Easily append UTM parameters to your URLs for precise campaign tracking."
            icon={<LinkIcon className="w-6 h-6" />}
            linkTo="/utm-builder"
          />
        </div>
      </section>

      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4 w-full"
      >
        <input
          type="url"
          {...register('longUrl', {
            required: 'URL is required',
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: 'Invalid URL format',
            },
          })}
          placeholder="Paste a long URL"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-link-blue shadow-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {errors.longUrl && <p className="text-red-500">{errors.longUrl.message}</p>}

        <ExpiryTimeSelector
          onExpiryChange={setExpiry}
          expiryType={expiryType}
          setExpiryType={setExpiryType}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
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
      </form> */}

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
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}