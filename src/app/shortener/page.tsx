'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { URLShortenerForm } from './components/URLShortenerForm';
import { ShortLinkList } from './components/ShortLinkList';
import { ShortLink, ShortenApiResponse, ToastType } from '../../../types';
import { getShortLinks, deleteShortLink as apiDeleteShortLink } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';

const URLShortenerPage: React.FC = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedLinks = await getShortLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error fetching links:", error);
      addToast('Failed to load links.', ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleLinkCreated = (newLinkResponse: ShortenApiResponse) => {
    const newLinkEntry: ShortLink = {
      ...newLinkResponse,
      clicks: 0,
    };
    setLinks(prevLinks => [newLinkEntry, ...prevLinks]);
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const result = await apiDeleteShortLink(id);
      if (result.success) {
        setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
        addToast('Link deleted successfully.', ToastType.Success);
      } else {
        addToast('Failed to delete link. Link not found or error occurred.', ToastType.Error);
      }
    } catch (error) {
      addToast('Error deleting link.', ToastType.Error);
      console.error("Error deleting link:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-sky-400 mb-2">URL Shortener</h1>
      <p className="text-lg dark:text-slate-300 text-center mb-8">
        Create short, manageable links from long URLs.
      </p>
      
      <URLShortenerForm onLinkCreated={handleLinkCreated} />
      <ShortLinkList links={links} isLoading={isLoading} onDeleteLink={handleDeleteLink} />
    </div>
  );
};

export default URLShortenerPage; 