import React, { Suspense } from 'react';
import { AnalyticsPageContent } from './components/AnalyticsPageContent';

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsPageContent />
    </Suspense>
  );
}