
import React, { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import LinkIcon from '@mui/icons-material/Link';
import { generateQRCode } from '../../../services/apiService';
// Fix: Import ToastType
import { QRCodeApiResponse, ToastType } from '../../../../types';
import { useToast } from '../../../context/ToastContext';

interface QRCodeGeneratorProps {
  onQRCodeGenerated: (data: QRCodeApiResponse & { originalUrl: string }) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodeGenerated }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Please enter a URL for the QR code.');
      return;
    }
    try {
      new URL(url); // Basic validation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateQRCode({ url });
      // Fix: Use ToastType enum
      addToast('QR Code generated!', ToastType.Success);
      onQRCodeGenerated({ ...result, originalUrl: url });
      // setUrl(''); // Optionally clear input
    } catch (apiError) {
      console.error("QR Code generation error:", apiError);
      const message = apiError instanceof Error ? apiError.message : 'Failed to generate QR code.';
      setError(message);
      // Fix: Use ToastType enum
      addToast(message, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-300 dark:bg-slate-800 rounded-lg shadow-xl">
      <Input
        id="qrUrl"
        label="Enter URL for QR Code"
        type="url"
        placeholder="https://your-link.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        Icon={LinkIcon}
        required
        disabled={isLoading}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        Generate QR Code
      </Button>
    </form>
  );
};
