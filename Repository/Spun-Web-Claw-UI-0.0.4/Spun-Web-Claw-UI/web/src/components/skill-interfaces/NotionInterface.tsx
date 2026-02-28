import { useState } from 'react';
import { Plus, Search, List, Settings, RefreshCw, LayoutGrid, Database } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface NotionInterfaceProps {
  skillId: string;
}

export default function NotionInterface({ skillId }: NotionInterfaceProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock data
  const pages = [
    { id: 1, title: 'Engineering Wiki', type: 'Database', icon: '📚' },
    { id: 2, title: 'Meeting Notes', type: 'Database', icon: '📝' },
    { id: 3, title: 'Product Roadmap', type: 'Database', icon: '🗺️' },
    { id: 4, title: 'Q1 Goals', type: 'Page', icon: '🎯' },
    { id: 5, title: 'Design System', type: 'Page', icon: '🎨' },
    { id: 6, title: 'Team Directory', type: 'Database', icon: '👥' },
  ];

  const handleCommand = async (cmd: string, args: any = {}) => {
    setLoading(true);
    try {
      await runSkillCommand(skillId, cmd, args);
      setMessage(`Command '${cmd}' executed`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Mock: Executed '${cmd}'`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header & Controls */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-slate-400" />
          <h2 className="text-lg font-bold text-white">Notion Workspace</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => handleCommand('create_page')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> New Page
          </button>
          <button 
            onClick={() => handleCommand('sync')}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync
          </button>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages and databases..."
            className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex bg-slate-900 rounded border border-slate-700 p-0.5">
          <button 
            onClick={() => setView('grid')}
            className={`p-1.5 rounded ${view === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-1.5 rounded ${view === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPages.map((page) => (
              <div 
                key={page.id} 
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-lg p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 aspect-square text-center group"
                onClick={() => handleCommand('open_page', { id: page.id })}
              >
                <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">{page.icon}</span>
                <div>
                  <h3 className="font-medium text-white text-sm line-clamp-2">{page.title}</h3>
                  <span className="text-xs text-slate-500 mt-1 inline-block px-2 py-0.5 bg-slate-900 rounded-full">
                    {page.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            {filteredPages.map((page) => (
              <div 
                key={page.id} 
                className="flex items-center gap-3 p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 cursor-pointer transition-colors"
                onClick={() => handleCommand('open_page', { id: page.id })}
              >
                <span className="text-xl">{page.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{page.title}</h3>
                </div>
                <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-900 rounded-full">
                  {page.type}
                </span>
                <button className="text-slate-500 hover:text-white p-1">
                  <Settings size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <div className="fixed bottom-8 right-8 bg-slate-800 text-white px-4 py-2 rounded shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {message}
        </div>
      )}
    </div>
  );
}
