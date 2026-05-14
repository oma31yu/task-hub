import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTodos, createTodo, deleteTodo } from '../services/tasksApi';
import Button from '../components/ui/Button'; 
import Input from '../components/ui/Input';   
import Card from '../components/ui/Card';     

const Tasks = () => {
  const { favorites, toggleFavorite } = useApp();
  
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('local_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); 
  const [title, setTitle] = useState('');
  const [error, setError] = useState(''); 
  const [taskSearch, setTaskSearch] = useState(''); 

  useEffect(() => {
    if (tasks.length > 0) return;
    
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTodos();
        if (isMounted && data && Array.isArray(data)) {
          const mappedData = data.slice(0, 5).map(item => ({
            ...item,
            id: Number(item.id),
            title: item.title,
            completed: item.completed,
            createdAt: 'Өнөөдөр'
          }));
          setTasks(mappedData);
        }
      } catch (err) {
        console.error("Өгөгдөл татахад алдаа гарлаа:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [tasks.length]);

  useEffect(() => {
    localStorage.setItem('local_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Даалгаврын нэр заавал шаардлагатай!');
      return;
    }
    if (title.trim().length < 3) {
      setError('Даалгаврын нэр хамгийн багадаа 3 тэмдэгт байх ёстой!');
      return;
    }

    setError('');
    setFormLoading(true); 

    const newTask = { 
      id: Date.now(), 
      title: title.trim(), 
      completed: false, 
      createdAt: 'Саяхан' 
    };

    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    
    try { 
      await createTodo(newTask); 
    } catch { 
      console.log("Offline горимд хадгалагдлаа."); 
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = async (id) => {
    setTasks(prev => prev.filter(x => x.id !== id));
    try { 
      await deleteTodo(id); 
    } catch { 
      console.log("Дотоод санах ойноос устгагдлаа."); 
    }
  };

  // 🔥 Зөвхөн эхний үсгээр / эхлэх үгээр нь шүүх (.startsWith)
  const filtered = tasks.filter(t => 
    t && t.title && t.title.toLowerCase().startsWith(taskSearch.toLowerCase())
  );

  const isFav = (id) => {
    if (!favorites) return false;
    return favorites.includes(id) || favorites.includes(String(id)) || favorites.includes(Number(id));
  };

  return (
    <div className="space-y-6 max-w-md mx-auto animate-in fade-in duration-500">
      <div className="mb-2">
        <Input 
          placeholder="Даалгавар хайх" 
          value={taskSearch}
          onChange={e => setTaskSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-slate-100 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
        <Input 
          label="Шинэ даалгавар"
          placeholder="Даалгавар оруулна уу... (мин 3 тэмдэгт)" 
          value={title} 
          onChange={e => {
            setTitle(e.target.value);
            if (e.target.value.trim().length >= 3) setError('');
          }} 
          errorMessage={error}
        />
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Нэмж байна...' : 'Даалгавар нэмэх'}
        </Button>
      </form>
      
      <div className="grid gap-3">
        {loading && tasks.length === 0 ? (
          <p className="text-center text-sm opacity-40">Ачаалж байна...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm italic">
            {taskSearch ? "Ийм даалгавар олдсонгүй." : "Даалгавар хоосон байна."}
          </p>
        ) : (
          filtered.map(t => (
            <Card key={t.id}>
              <div className="flex justify-between items-center group p-1">
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => handleToggle(t.id)}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-400'}`}>
                    {t.completed && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold transition-all text-sm ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{t.title}</p>
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">{t.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite ? toggleFavorite(t.id) : null; }} 
                    className={`p-2 transition-all duration-200 ${isFav(t.id) ? 'text-yellow-500 scale-110' : 'text-slate-300 hover:text-yellow-500'}`}
                    type="button"
                  >
                    <svg className="h-5 w-5" fill={isFav(t.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} 
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;