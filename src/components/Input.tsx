
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  Icon?: React.ElementType;
}

export const Input: React.FC<InputProps> = ({ label, id, error, Icon, className, ...props }) => {
  const baseInputClasses = "block w-full appearance-none rounded-md border bg-gray-300 dark:bg-slate-800 px-3 py-2 text-slate-800 placeholder-slate-800 dark:placeholder-slate-400 shadow-sm focus:outline-none sm:text-sm";
  const errorInputClasses = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const validInputClasses = "border-slate-700 focus:border-sky-500 focus:ring-sky-500";
  
  const inputWrapperClass = Icon ? "relative" : "";
  const inputClassWithIcon = Icon ? "pl-10" : "";

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className={inputWrapperClass}>
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 dark:text-slate-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          className={`${baseInputClasses} ${error ? errorInputClasses : validInputClasses} ${inputClassWithIcon} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};
