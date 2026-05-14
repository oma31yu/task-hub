/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Favorites төлөвийг дуудахдаа үргэлж тоон массив болгож баталгаажуулна
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved).map(Number) : [];
    } catch {
      return [];
    }
  });

  // Dark class-ийг html tag-д өгөх
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Favorites өөрчлөгдөх бүрт localStorage-д хадгалах
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 🔥 ОД БУДАГДАХГҮЙ БАЙСАН ЛОГИКИЙГ ЭНД ТӨГС ЗАСАВ (Тоон төрлөөр хадгална)
  const toggleFavorite = (id) => {
    const numericId = Number(id);
    setFavorites(prev => {
      if (prev.includes(numericId)) {
        return prev.filter(favId => favId !== numericId); // Байвал хасна
      } else {
        return [...prev, numericId]; // Байхгүй бол нэмнэ
      }
    });
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      toggleTheme, 
      searchQuery,      
      setSearchQuery,   
      favorites,        
      toggleFavorite    
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);