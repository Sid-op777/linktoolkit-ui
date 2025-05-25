import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, linkTo }) => (
  <div className="bg-gray-300 dark:bg-slate-800 p-6 rounded-lg shadow-xl hover:shadow-sky-500/30 transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-sky-600 text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400 mb-4 text-sm">{description}</p>
    <Link href={linkTo}>
      <Button variant="outline" size="sm">Get Started</Button>
    </Link>
  </div>
);

export default FeatureCard;