
import React from 'react';
import { ShortLink } from '../../../../types';
import { ShortLinkItem } from './ShortLinkItem';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ShortLinkListProps {
  links: ShortLink[];
  isLoading: boolean;
}

export const ShortLinkList: React.FC<ShortLinkListProps> = ({ links, isLoading}) => {
  if (isLoading) {
    return <LoadingSpinner className="my-8" />;
  }

  if (links.length === 0) {
    return <p className="text-center text-slate-400 py-8">No links created yet. Start by shortening a URL above!</p>;
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4">Your Shortened Links</h2>
      {links.map((link) => (
        <ShortLinkItem key={link.shortUrl} link={link} />
      ))}
    </div>
  );
};
