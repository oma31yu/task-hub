import React from 'react';

const Button = ({ variant = 'primary', disabled, isLoading, children, ...props }) => {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
  };

  return (
    <button 
      disabled={disabled || isLoading}
      // dark mode болон hover, focus стилийг Tailwind-ээр илүү цэгцтэй болгов
      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 ${styles[variant]}`}
      {...props}
    >
      {isLoading ? "Уншиж байна..." : children}
    </button>
  );
};

// Бусад хуудсанд шууд дуудаж ашиглах боломжтой болгож default-оор гаргав
export default Button;