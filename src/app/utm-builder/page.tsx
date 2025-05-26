'use client'

import React from 'react';
import { UTMForm } from './components/UTMForm';

const UTMBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-sky-400 mb-2">UTM Builder</h1>
      <p className="text-lg dark:text-slate-300 text-center mb-8">Construct URLs with UTM parameters for precise campaign tracking.</p>
      
      <UTMForm />
    </div>
  );
};

export default UTMBuilderPage;