import React from 'react';

const Input = ({ label, errorMessage, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input 
        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
          bg-white dark:bg-slate-900 
          text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          ${errorMessage 
            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30 bg-red-50/10' 
            : 'border-slate-200 dark:border-slate-700/80 focus:border-blue-500 focus:ring-blue-100 dark:focus:ring-blue-900/30'
          }`}
        {...props}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs font-semibold mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
