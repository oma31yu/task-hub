import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchPosts, createPost, deletePost } from '../services/notesApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Notes = () => {
  const { favorites, toggleFavorite } = useApp();
  
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('local_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '' }); 
  const [noteSearch, setNoteSearch] = useState(''); 

  useEffect(() => {
    if (notes.length > 0) return;
    
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        if (isMounted && data && Array.isArray(data)) {
          const mappedData = data.slice(0, 4).map(item => ({
            id: Number(item.id),
            title: item.title,
            content: item.body,
            date: new Date().toLocaleDateString()
          }));
          setNotes(mappedData);
        }
      } catch (err) {
        console.error("Өгөгдөл татахад алдаа гарлаа:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [notes.length]);

  useEffect(() => {
    localStorage.setItem('local_notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let currentErrors = { title: '', content: '' };
    let hasError = false;

    if (!title.trim()) {
      currentErrors.title = 'Гарчиг заавал шаардлагатай!';
      hasError = true;
    }
    if (content.trim().length < 10) {
      currentErrors.content = 'Агуулга хамгийн багадаа 10 тэмдэгт байх ёстой!';
      hasError = true;
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    setErrors({ title: '', content: '' });
    setFormLoading(true);

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString()
    };

    setNotes(prev => [newNote, ...prev]);
    setTitle('');
    setContent('');

    try {
      await createPost({ title: newNote.title, body: newNote.content });
    } catch {
      console.log("Офлайн горимд дотоод state дээр хадгалагдлаа.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await deletePost(id);
    } catch {
      console.log("Устгалтыг дотоод state дээр гүйцэтгэлээ.");
    }
  };

  // 🔥 Зөвхөн эхний үсгээр / эхлэх үгээр нь шүүх (.startsWith)
  const filtered = notes.filter(n => {
    if (!n) return false;
    // Гарчиг эсвэл агуулгын аль нэг нь тухайн үсгээр эхэлж байвал шүүнэ
    const matchTitle = n.title ? n.title.toLowerCase().startsWith(noteSearch.toLowerCase()) : false;
    const matchContent = n.content ? n.content.toLowerCase().startsWith(noteSearch.toLowerCase()) : false;
    return matchTitle || matchContent;
  });

  const isFav = (id) => {
    if (!favorites) return false;
    return favorites.includes(id) || favorites.includes(String(id)) || favorites.includes(Number(id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="mb-2">
        <Input 
          placeholder="Тэмдэглэл хайх" 
          value={noteSearch}
          onChange={e => setNoteSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl shadow-md space-y-4 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Шинэ тэмдэглэл</h2>
        
        <Input 
          label="Гарчиг" 
          placeholder="Тэмдэглэлийн нэр..." 
          value={title} 
          onChange={e => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setErrors(prev => ({...prev, title: ''}));
          }} 
          errorMessage={errors.title}
        />
        
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Агуулга</label>
          <textarea 
            className={`w-full p-3 rounded-lg bg-white dark:bg-slate-900 border ${errors.content ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 min-h-30 transition-all text-sm`}
            value={content}
            onChange={e => {
              setContent(e.target.value);
              if (e.target.value.trim().length >= 10) setErrors(prev => ({...prev, content: ''}));
            }}
            placeholder="Тэмдэглэлээ энд бичнэ үү... (мин 10 тэмдэгт)"
          />
          {errors.content && <span className="text-xs text-red-500 mt-1">{errors.content}</span>}
        </div>
        
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Хадгалж байна...' : 'Хадгалах'}
        </Button>
      </form>

      <div className="grid gap-4">
        {loading && notes.length === 0 ? (
          <p className="text-center opacity-40">Ачаалж байна...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm italic">
            {noteSearch ? "Ийм тэмдэглэл олдсонгүй." : "Тэмдэглэл хоосон байна."}
          </p>
        ) : (
          filtered.map(note => (
            <Card key={note.id}>
              <div className="relative p-2 group">
                <div className="pr-16">
                  <h3 className="font-extrabold text-blue-600 dark:text-blue-400 uppercase text-xs tracking-wider mb-1">{note.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <span className="text-[10px] font-bold text-slate-400 block mt-3">{note.date}</span>
                </div>
                
                <div className="absolute top-0 right-0 flex items-center gap-1">
                  <button 
                    onClick={() => toggleFavorite ? toggleFavorite(note.id) : null} 
                    className={`p-2 transition-all duration-200 ${isFav(note.id) ? 'text-yellow-500 scale-110' : 'text-slate-400 hover:text-yellow-500'}`}
                    type="button"
                  >
                    <svg className="h-5 w-5" fill={isFav(note.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>

                  <button 
                    onClick={() => handleDelete(note.id)} 
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
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

export default Notes;