import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button'; // { Button } хаалтыг арилгаж default болгов

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <h1 className="text-7xl font-black text-blue-500 dark:text-blue-400 mb-4">404</h1>
      <p className="text-xl mb-2 font-bold text-slate-800 dark:text-slate-200">Уучлаарай, ийм хуудас олдсонгүй.</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        Таны хандсан хаяг буруу эсвэл устгагдсан байна.
      </p>
      <Link to="/">
        <Button>Нүүр хуудас руу буцах</Button>
      </Link>
    </div>
  );
};

// App.jsx хуудсанд 'import NotFound from ...' гэж дуудахад алдаа заахгүй болгож default export нэмэв
export default NotFound;