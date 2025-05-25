import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import Header from '../components/Header'; 
import Image from 'next/image';
import { ToastProvider } from '../context/ToastContext';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Link Toolkit',
  description: 'Created by me',
  icons: {
    icon: '/assets/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-100 dark:bg-gray-900 dark:text-white">
        <ToastProvider> 
        <Header />

        <main className="min-h-screen bg-gray-100 dark:bg-slate-900">
          {children}
        </main>

        <footer className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 w-full">
          <Image
            src="/assets/nx7.svg"
            alt="LinkToolkit Logo"
            width={42}
            height={42}
            className="mx-auto"
          />
        </footer>

        <Analytics />
        </ToastProvider>

      </body>
    </html>
  );
}
