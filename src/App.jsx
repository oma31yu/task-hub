import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NavBar } from './components/layout/NavBar';
import Tasks from './pages/Tasks';  
import Notes from './pages/Notes';  
import About from './pages/About';  
import NotFound from './pages/NotFound'; 

export default function App() {
  return (
    <AppProvider>
      {/* 
        🔥 ЭНД ҮНДСЭН ГАДНА ТАЛЫН ДИВ-Д БҮТЭН ХАРАГДАЦЫН ӨНГӨ ИЛҮҮЛЭВ
        bg-slate-50 dark:bg-slate-900: Light үед цайвар, Dark үед гүн хөх өнгөтэй болно.
        text-slate-900 dark:text-slate-100: Текстийн өнгийг мөн адил систем дагаж солигддог болгов.
      */}
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
        <Router>
          {/* Дээд талын навигацийн цэс */}
          <NavBar /> 
          
          {/* Үндсэн контент байрлах хэсэг */}
          <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </Router>
      </div>
    </AppProvider>
  );
}