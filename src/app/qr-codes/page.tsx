'use client'

import React, { useState } from 'react';
import { QRCodeGenerator } from './components/QRCodeGenerator';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { QRCodeApiResponse } from '../../../types';

interface GeneratedQRData extends QRCodeApiResponse {
  originalUrl: string;
}

const QRCodePage: React.FC = () => {
  const [generatedQR, setGeneratedQR] = useState<GeneratedQRData | null>(null);

  const handleQRCodeGenerated = (data: GeneratedQRData) => {
    setGeneratedQR(data);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-sky-400 mb-2">QR Code Generator</h1>
      <p className="text-lg dark:text-slate-300 text-center mb-8">Generate QR codes for your URLs instantly.</p>
      
      <QRCodeGenerator onQRCodeGenerated={handleQRCodeGenerated} />
      
      {generatedQR && (
        <QRCodeDisplay qrCodeUrl={generatedQR.qrCodeUrl} originalUrl={generatedQR.originalUrl} />
      )}
    </div>
  );
};

export default QRCodePage;