
import React from 'react';
import { AnalyticsData } from '../../../../types';
import { AnalyticsChart } from './AnalyticsChart';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AnalyticsDashboardContentProps {
  analyticsData: AnalyticsData | null;
  isLoading: boolean;
}

export const AnalyticsDashboardContent: React.FC<AnalyticsDashboardContentProps> = ({ analyticsData, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner className="my-12" />;
  }

  if (!analyticsData) {
    return <p className="text-center text-slate-400 py-8">No analytics data available for the selected link, or link not found.</p>;
  }

  const SummaryCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow ${className}`}>
      <h4 className="text-sm font-medium dark:text-slate-400">{title}</h4>
      <p className="text-2xl font-semibold text-sky-500 dark:text-sky-400">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-sky-400 break-all">{analyticsData.shortUrl}</h2>
        <p className="dark:text-slate-400 text-sm truncate" title={analyticsData.longUrl}>Original: {analyticsData.longUrl}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Clicks" value={analyticsData.totalClicks} />
        <SummaryCard title="Top Referrer" value={analyticsData.referrers[0]?.name || 'N/A'} />
        <SummaryCard title="Top Device" value={analyticsData.devices[0]?.name || 'N/A'} />
        <SummaryCard title="Top Location" value={analyticsData.locations[0]?.name || 'N/A'} />
      </div>
      
      <AnalyticsChart data={analyticsData} chartType="clickTrend" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <AnalyticsChart data={analyticsData} chartType="referrers" />
        <AnalyticsChart data={analyticsData} chartType="devices" />
        <AnalyticsChart data={analyticsData} chartType="locations" />
      </div>
    </div>
  );
};
