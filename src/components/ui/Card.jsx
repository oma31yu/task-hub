import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      // class-ийг уян хатан болгосноор хуудаснууд дээр өөр өөр стиль (жишээ нь relative group) нэмж ашиглах боломжтой болно
      className={`p-4 border rounded-2xl shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 ${className}`}
      {...props}
    >
      {/* 
        Жагсаалтын хуудаснууд (Tasks, Notes) өөрсдийн бүтцээ children дотор 
        бүрэн уян хатан удирдаж харуулах боломжийг олгоно.
      */}
      {children}
    </div>
  );
};

export default Card;