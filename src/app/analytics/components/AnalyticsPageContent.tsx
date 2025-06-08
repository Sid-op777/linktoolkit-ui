// src/app/analytics/components/AnalyticsPageContent.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnalyticsData, ShortLink, ToastType } from '../../../../types';
import { getAnalyticsForLink, getShortLinks } from '../../../services/apiService';
import { AnalyticsDashboardContent } from './AnalyticsDashboardContent';
import { useToast } from '@/context/ToastContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChevronDownIcon } from '../../../components/ChevronDownIcon';

export const AnalyticsPageContent: React.FC = () => {
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [availableLinks, setAvailableLinks] = useState<ShortLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const { addToast } = useToast();
  const searchParams = useSearchParams();

  const fetchAvailableLinks = useCallback(async () => {
    setIsLoadingLinks(true);
    try {
      const links = await getShortLinks();
      setAvailableLinks(links);

      const queryLinkId = searchParams.get('linkId');
      if (queryLinkId && links.some(l => l.id === queryLinkId)) {
        setSelectedLinkId(queryLinkId);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast('Failed to load available links.', ToastType.Error);
    } finally {
      setIsLoadingLinks(false);
    }
  }, [addToast, searchParams]);

  useEffect(() => {
    fetchAvailableLinks();
  }, [fetchAvailableLinks]);

  useEffect(() => {
    if (selectedLinkId) {
      const fetchAnalytics = async () => {
        setIsLoadingData(true);
        setAnalyticsData(null);
        try {
          const data = await getAnalyticsForLink(selectedLinkId);
          setAnalyticsData(data);
          if (!data) {
            addToast('No analytics data found for this link.', ToastType.Info);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          addToast('Failed to load analytics data.', ToastType.Error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchAnalytics();
    } else {
      setAnalyticsData(null);
    }
  }, [selectedLinkId, addToast]);

  const handleLinkSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLinkId(e.target.value || null);
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-sky-400 mb-2">Link Analytics</h1>
      <p className="text-lg dark:text-slate-300 text-center mb-8">Track the performance of your shortened URLs.</p>

      {isLoadingLinks ? (
        <LoadingSpinner className="my-8" />
      ) : availableLinks.length === 0 ? (
        <p className="text-center text-slate-400 py-8">No links available to analyze. Please shorten some URLs first.</p>
      ) : (
        <div className="mb-8 max-w-md mx-auto">
          <label htmlFor="linkSelect" className="block text-sm font-medium dark:text-slate-300 mb-1">
            Select a Link to Analyze
          </label>
          <div className="relative">
            <select
              id="linkSelect"
              value={selectedLinkId || ''}
              onChange={handleLinkSelect}
              className="block w-full appearance-none rounded-md border border-slate-500 dark:border-slate-700 bg-slate-300 dark:bg-slate-800 px-3 py-2 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            >
              <option value="">-- Select a Link --</option>
              {availableLinks.map(link => (
                <option key={link.id} value={link.id}>
                  {link.shortUrl} ({link.originalUrl.substring(0, 30)}...)
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}

      {selectedLinkId && (
        <AnalyticsDashboardContent analyticsData={analyticsData} isLoading={isLoadingData} />
      )}
      {!selectedLinkId && !isLoadingLinks && availableLinks.length > 0 && (
        <p className="text-center dark:text-slate-400 py-8">
          Please select a link from the dropdown to view its analytics.
        </p>
      )}
    </div>
  );
};
