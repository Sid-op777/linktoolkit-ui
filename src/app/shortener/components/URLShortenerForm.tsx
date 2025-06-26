
import React, { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import LinkIcon from '@mui/icons-material/Link';
import { shortenUrl } from '@/services/apiService'; 
// Fix: Import ToastType
import { ShortenApiResponse, ToastType } from '@/../types';
import { useToast } from '@/context/ToastContext';
import ExpiryTimeSelector from '../../ExpiryTimeSelector';

interface URLShortenerFormProps {
  onLinkCreated: (newLink: ShortenApiResponse) => void;
}

export const URLShortenerForm: React.FC<URLShortenerFormProps> = ({ onLinkCreated }) => {
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const [expiry, setExpiry] = useState('P1M');
    const [expiryType, setExpiryType] = useState<'duration' | 'date'>('duration');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!longUrl.trim()) {
      setError('Please enter a URL to shorten.');
      return;
    }

    try {
      // Basic URL validation (can be improved)
      new URL(longUrl);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await shortenUrl({ longUrl: longUrl, alias: alias.trim() || undefined, expiry });
      const shortLink = result.shortUrl;
      await navigator.clipboard.writeText(shortLink);
      addToast(`Link shortened: ${shortLink} (copied to clipboard)`, ToastType.Success);
      onLinkCreated(result);
      setLongUrl('');
      setAlias('');
    } catch (apiError) {
      console.error("Shortening error:", apiError);
      const message = apiError instanceof Error ? apiError.message : 'Failed to shorten URL. Please try again.';
      setError(message);
      addToast(message, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-300 dark:bg-slate-800 rounded-lg shadow-xl">
      <div>
        <Input
          id="longUrl"
          label="Enter Long URL"
          type="url"
          placeholder="https://example.com/very-long-url-to-shorten"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          Icon={LinkIcon}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          id="alias"
          label="Custom Alias (Optional)"
          type="text"
          placeholder="my-custom-link"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          disabled={isLoading}
        />
        <p className="mt-1 text-xs dark:text-slate-400">If left blank, a random alias will be generated.</p>
      </div>
      <p className="block text-sm font-medium dark:text-slate-300 mb-1">Set URL Expiry</p>
      <ExpiryTimeSelector
          onExpiryChange={setExpiry}
          expiryType={expiryType}
          setExpiryType={setExpiryType}
        />
        
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        Shorten URL
      </Button>
    </form>
  );
};
