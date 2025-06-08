'use client'

import React, { useState } from 'react';
import Link from 'next/link';
// Fix: Import ToastType
import { ShortLink, ToastType } from '../../../../types';
import { Button } from '../../../components/Button';
import { ClipboardIcon } from '../../../components/ClipboardIcon';
import { TrashIcon } from '../../../components/TrashIcon';
import { ChartBarIcon } from '../../../components/ChartBarIcon';
import { useToast } from '../../../context/ToastContext';

interface ShortLinkItemProps {
  link: ShortLink;
  onDelete: (id: string) => void;
}

export const ShortLinkItem: React.FC<ShortLinkItemProps> = ({ link, onDelete }) => {
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      // Fix: Use ToastType enum
      .then(() => addToast('Copied to clipboard!', ToastType.Success))
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Fix: Use ToastType enum
        addToast('Failed to copy to clipboard.', ToastType.Error);
      });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${link.shortUrl}?`)) {
      setIsDeleting(true);
      try {
        onDelete(link.id);
        // Optimistic update handled by parent, toast on success from parent
      } catch (error) {
        // Fix: Use ToastType enum
        addToast('Failed to delete link.', ToastType.Error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };


  return (
    <div className="bg-sky-300/20 dark:bg-slate-800 p-4 rounded-lg shadow-lg hover:shadow-sky-500/20 transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex-grow min-w-0">
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 dark:text-sky-400 hover:text-sky-300 font-semibold text-lg break-all"
          >
            {link.shortUrl.replace(/^https?:\/\//, '')}
          </a>
          <p className="dark:text-slate-400 text-sm break-all mt-1">
            <span className="font-medium">Original:</span> {link.originalUrl}
          </p>
        </div>
        <div className="dark:text-slate-300 text-sm sm:text-right mt-2 sm:mt-0">
          <p>Clicks: {link.clicks}</p>
          <p>Created: {formatDate(link.createdAt)}</p>
          {link.expiry && <p>Expires: {formatDate(link.expiry)}</p>}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-2 items-center">
        <Button size="sm" variant="outline" onClick={() => handleCopy(link.shortUrl)} className="flex items-center gap-1">
          <ClipboardIcon className="w-4 h-4" /> Copy
        </Button>
        <Link href={`/analytics?linkId=${link.id}`}>
          <Button size="sm" variant="secondary" className="flex items-center gap-1">
            <ChartBarIcon className="w-4 h-4" /> Analytics
          </Button>
        </Link>
        <Button size="sm" variant="danger" onClick={handleDelete} isLoading={isDeleting} className="flex items-center gap-1 ml-auto">
          <TrashIcon className="w-4 h-4" /> Delete
        </Button>
      </div>
    </div>
  );
};
