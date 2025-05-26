
import React from 'react';
import { Button } from '../../../components/Button';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  originalUrl: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodeUrl, originalUrl }) => {
  
  const handleDownload = (format: 'png' | 'svg') => {
    // For a real SVG download, if the QR service provided SVG, you'd handle that.
    // For PNG from URL, it's a direct link.
    // This mock just opens the image in a new tab.
    // A more robust download would use an <a> tag with download attribute or FileSaver.js
    if (format === 'png') {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qrcode-${originalUrl.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert(`SVG download for ${qrCodeUrl} would be implemented here.`);
    }
  };

  return (
    <div className="mt-8 p-6 dark:bg-slate-800 rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-semibold dark:text-slate-100 mb-2">Your QR Code</h3>
      <p className="text-sm dark:text-slate-400 mb-4 break-all">For: {originalUrl}</p>
      <div className="flex justify-center items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-md inline-block">
        <img src={qrCodeUrl} alt={`QR Code for ${originalUrl}`} className="w-48 h-48 md:w-64 md:h-64 object-contain" />
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={() => handleDownload('png')} variant="secondary">Download PNG</Button>
        {/* <Button onClick={() => handleDownload('svg')} variant="outline">Download SVG</Button> */}
        <p className="text-xs dark:text-slate-500 self-center">SVG download placeholder</p>
      </div>
    </div>
  );
};
