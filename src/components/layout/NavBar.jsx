import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const NavBar = () => {
  const { theme, toggleTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false); // Мобайл цэс нээх/хаах local state

  // Идэвхтэй байгаа линкний стилийг тодорхойлох функц
  const activeStyle = ({ isActive }) => 
    isActive 
      ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400 pb-1" 
      : "text-gray-600 dark:text-gray-300 hover:text-blue-500 pb-1 transition-colors";

  return (
    <nav className="border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center gap-4">
        
        {/* Лого болон Вэб хувилбарын Цэс */}
        <div className="flex gap-6 items-center shrink-0">
          <Link to="/tasks" className="font-black text-blue-600 dark:text-blue-400 text-xl tracking-tight">
            TaskHub
          </Link>
          <div className="hidden md:flex gap-6 font-medium text-sm">
            <NavLink to="/tasks" className={activeStyle}>Tasks</NavLink>
            <NavLink to="/notes" className={activeStyle}>Notes</NavLink>
            <NavLink to="/about" className={activeStyle}>About</NavLink>
          </div>
        </div>
        
        {/* Баруун талын Товчлуурууд (Хайлт устгагдсан хэсэг) */}
        <div className="flex items-center gap-2">
          {/* Theme солих товчлуур */}
          <button 
            onClick={toggleTheme}
            className="p-2 border rounded-xl shadow-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm hover:scale-105 transition-transform"
            title="Theme солих"
            type="button"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Мобайл цэс нээх товчлуур (Гар утсан дээр л харагдана) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            type="button"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобайл төхөөрөмжид зориулсан доошоо дэлгэгддэг цэс (Responsive) */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 space-y-3 shadow-inner">
          <div className="flex flex-col gap-2 font-medium text-sm">
            <NavLink to="/tasks" onClick={() => setIsOpen(false)} className="block py-1">Tasks</NavLink>
            <NavLink to="/notes" onClick={() => setIsOpen(false)} className="block py-1">Notes</NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className="block py-1">About</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};