
import React, { useEffect, useState } from 'react';
import { ToastType } from '../../types';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Trigger enter animation
  }, []);

  const baseClasses = "max-w-sm w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out";
  const positionClasses = "transform translate-y-0 opacity-100"; // Initial visible state
  const hiddenPositionClasses = "transform translate-y-2 opacity-0";

  const typeClasses = {
    [ToastType.Success]: 'border-l-4 border-green-500',
    [ToastType.Error]: 'border-l-4 border-red-500',
    [ToastType.Info]: 'border-l-4 border-sky-500',
  };

  const iconClasses = {
    [ToastType.Success]: 'text-green-400',
    [ToastType.Error]: 'text-red-400',
    [ToastType.Info]: 'text-sky-400',
  }

  const Icon = () => {
    switch (type) {
      case ToastType.Success:
        return (
          <svg className={`h-6 w-6 ${iconClasses[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ToastType.Error:
        return (
          <svg className={`h-6 w-6 ${iconClasses[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ToastType.Info:
        return (
          <svg className={`h-6 w-6 ${iconClasses[type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default: return null;
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? positionClasses : hiddenPositionClasses}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-100">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className="inline-flex text-slate-400 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 rounded-md"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
