import { useState, useEffect } from 'react';
import { 
  Search, Camera, Folder, Plus, Globe, X, Database, Key, 
  MousePointer, ArrowLeft, ArrowRight, RotateCw, Download, 
  FileText, Link as LinkIcon, Image, Shield
} from 'lucide-react';
import { runSkillCommand, getBraveSavedQueries, addBraveSavedQuery, deleteBraveSavedQuery } from '../../api';

interface BraveSearchInterfaceProps {
  skillId: string;
}

type Mode = 'search' | 'scrape' | 'automate';

export default function BraveSearchInterface({ skillId }: BraveSearchInterfaceProps) {
  const [mode, setMode] = useState<Mode>('search');
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('https://search.brave.com');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [scrapedData, setScrapedData] = useState<string>('');

  // Automation State
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [savedQueries, setSavedQueries] = useState<string[]>(['site:reddit.com "AI"', 'filetype:pdf "whitepaper"']);
  const [selector, setSelector] = useState('');

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getBraveSavedQueries();
        setSavedQueries(list);
      } catch {
        // ignore, fallback to local defaults
      }
    })();
  }, []);

  const saveQuery = async () => {
    if (!query || savedQueries.includes(query)) return;
    try {
      await addBraveSavedQuery(query);
      setSavedQueries(prev => [...prev, query]);
      addLog(`Saved query: ${query}`);
    } catch (e: any) {
      addLog(`Failed to save query: ${e.message || 'error'}`);
    }
  };

  const deleteQuery = async (q: string) => {
    try {
      await deleteBraveSavedQuery(q);
      setSavedQueries(prev => prev.filter(i => i !== q));
    } catch (e: any) {
      addLog(`Failed to delete query: ${e.message || 'error'}`);
    }
  };

  const handleNavigate = () => {
    if (!url) return;
    setLoading(true);
    addLog(`Navigating to ${url}...`);
    // Mock navigation
    setTimeout(() => {
      setLoading(false);
      addLog(`Loaded ${url}`);
    }, 1000);
  };

  const handleSearch = () => {
    if (!query) return;
    const searchUrl = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
    setUrl(searchUrl);
    handleNavigate();
  };

  const handleScrape = async (type: 'text' | 'links' | 'images' | 'selector') => {
    setLoading(true);
    const scrapeType = type === 'selector' ? `selector (${selector})` : type;
    addLog(`Scraping ${scrapeType} from current page...`);
    try {
      const res = await runSkillCommand(skillId, 'scrape', { url, type, selector: type === 'selector' ? selector : undefined });
      let pretty = '';
      try {
        const parsed = JSON.parse(res.output || '{}');
        if (parsed.content) pretty = parsed.content;
        else if (parsed.links) pretty = (parsed.links as string[]).join('\n');
        else if (parsed.images) pretty = (parsed.images as string[]).join('\n');
        else if (parsed.selector) {
          pretty = `${parsed.text || ''}\n\n${parsed.html || ''}`;
        } else {
          pretty = res.output;
        }
      } catch {
        pretty = res.output;
      }
      setScrapedData(pretty);
      addLog(`Successfully scraped ${scrapeType}`);
      setLoading(false);
    } catch (error) {
      addLog(`Error scraping: ${(error as any).message}`);
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginCreds.username || !loginCreds.password) return;
    setLoading(true);
    addLog(`Attempting login on ${new URL(url).hostname}...`);
    try {
      const res = await runSkillCommand(skillId, 'login', { url, ...loginCreds });
      addLog(res.success ? 'Login attempted successfully' : 'Login failed');
      setLoading(false);
    } catch (error) {
      addLog('Login failed.');
      setLoading(false);
    }
  };

  const operators = [
    { label: 'site:', desc: 'Limit to site', example: 'site:reddit.com' },
    { label: 'filetype:', desc: 'File type', example: 'filetype:pdf' },
    { label: 'intext:', desc: 'Body text', example: 'intext:"crypto"' },
    { label: 'intitle:', desc: 'Title text', example: 'intitle:"review"' },
    { label: 'after:', desc: 'After date', example: 'after:2023-01-01' },
    { label: 'before:', desc: 'Before date', example: 'before:2023' },
    { label: '" "', desc: 'Exact match', example: '"exact phrase"' },
    { label: 'OR', desc: 'Either term', example: 'cat OR dog' },
    { label: '-', desc: 'Exclude', example: '-spam' },
  ];

  return (
    <div className="flex h-full bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* Sidebar Tools */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Mode Switcher */}
        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setMode('search')}
            className={`flex-1 p-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${mode === 'search' ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Search size={16} /> Search
          </button>
          <button 
            onClick={() => setMode('scrape')}
            className={`flex-1 p-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${mode === 'scrape' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Database size={16} /> Scrape
          </button>
          <button 
            onClick={() => setMode('automate')}
            className={`flex-1 p-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors ${mode === 'automate' ? 'bg-slate-800 text-green-400 border-b-2 border-green-500' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Key size={16} /> Login
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* SEARCH MODE */}
          {mode === 'search' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Search Builder</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {operators.map((op) => (
                    <button
                      key={op.label}
                      onClick={() => setQuery(prev => `${prev} ${op.label}`)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 rounded text-left transition-colors group"
                      title={op.example}
                    >
                      <div className="text-xs font-mono text-blue-400 font-bold group-hover:text-blue-300">{op.label}</div>
                      <div className="text-[10px] text-slate-500">{op.desc}</div>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={saveQuery}
                  disabled={!query}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 rounded text-center text-xs font-medium text-slate-300 disabled:opacity-50 transition-colors mb-6"
                >
                  Save Current Query
                </button>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Saved Queries</h3>
                <div className="space-y-2">
                  {savedQueries.map((q, i) => (
                    <div key={i} className="flex items-center gap-2 group bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded p-2 transition-colors">
                      <button
                        onClick={() => { setQuery(q); setUrl(`https://search.brave.com/search?q=${encodeURIComponent(q)}`); }}
                        className="flex-1 text-left text-xs text-slate-300 truncate font-mono"
                        title={q}
                      >
                        {q}
                      </button>
                      <button 
                        onClick={() => deleteQuery(q)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {savedQueries.length === 0 && (
                    <div className="text-sm text-slate-500 italic p-2 border border-dashed border-slate-700 rounded text-center">
                      No saved queries yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCRAPE MODE */}
          {mode === 'scrape' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Extract Data</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleScrape('text')}
                    className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded flex items-center gap-3 transition-colors border border-slate-700"
                  >
                    <FileText className="text-slate-400" size={18} />
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-200">Get Text Content</div>
                      <div className="text-xs text-slate-500">Extract readable text</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleScrape('links')}
                    className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded flex items-center gap-3 transition-colors border border-slate-700"
                  >
                    <LinkIcon className="text-blue-400" size={18} />
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-200">Extract Links</div>
                      <div className="text-xs text-slate-500">Get all hrefs on page</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleScrape('images')}
                    className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded flex items-center gap-3 transition-colors border border-slate-700"
                  >
                    <Image className="text-purple-400" size={18} />
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-200">Download Images</div>
                      <div className="text-xs text-slate-500">Save all visible images</div>
                    </div>
                  </button>

                  <div className="pt-3 border-t border-slate-800 mt-2">
                    <label className="text-xs font-medium text-slate-400 mb-2 block">Custom CSS Selector</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                        placeholder=".content, #main, article"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:border-purple-500 focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => handleScrape('selector')}
                        disabled={!selector}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded text-xs font-medium transition-colors"
                      >
                        Run
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {scrapedData && (
                <div className="bg-slate-950 rounded border border-slate-800 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">RESULTS</span>
                    <button className="text-xs text-blue-400 hover:underline">Copy</button>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {scrapedData}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* AUTOMATE MODE */}
          {mode === 'automate' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Site Login</h3>
                <div className="space-y-3 bg-slate-800 p-4 rounded border border-slate-700">
                  <div className="flex items-center gap-2 text-yellow-500 text-xs mb-2">
                    <Shield size={12} />
                    <span>Credentials are encrypted</span>
                  </div>
                  <input 
                    type="text"
                    value={loginCreds.username}
                    onChange={e => setLoginCreds({...loginCreds, username: e.target.value})}
                    placeholder="Username / Email"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                  />
                  <input 
                    type="password"
                    value={loginCreds.password}
                    onChange={e => setLoginCreds({...loginCreds, password: e.target.value})}
                    placeholder="Password"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                  />
                  <button 
                    onClick={handleLogin}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium transition-colors"
                  >
                    Login to Site
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-blue-500 text-xs text-slate-300">
                    Accept Cookies
                  </button>
                  <button className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-blue-500 text-xs text-slate-300">
                    Close Modals
                  </button>
                  <button className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-blue-500 text-xs text-slate-300">
                    Scroll to Bottom
                  </button>
                  <button className="bg-slate-800 p-2 rounded border border-slate-700 hover:border-blue-500 text-xs text-slate-300">
                    Take Screenshot
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Logs Console */}
        <div className="h-32 bg-slate-950 border-t border-slate-800 p-2 font-mono text-[10px] overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="text-slate-400 border-b border-slate-800/50 last:border-0 pb-0.5 mb-0.5">
              {log}
            </div>
          ))}
          {logs.length === 0 && <span className="text-slate-700 italic">Ready...</span>}
        </div>
      </div>

      {/* Main Browser Area */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Address Bar */}
        <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-slate-700 shadow-sm">
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
              <ArrowLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={handleNavigate}
              className={`p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white ${loading ? 'animate-spin' : ''}`}
            >
              <RotateCw size={16} />
            </button>
          </div>
          
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {url.startsWith('https') ? <Shield size={12} className="text-green-500" /> : <Globe size={12} className="text-slate-500" />}
            </div>
            <input 
              type="text" 
              value={query || url}
              onChange={(e) => {
                setQuery(e.target.value);
                setUrl(e.target.value); // Sync for simplicity in mock
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-slate-900 border border-slate-700 group-hover:border-slate-600 rounded-full py-1.5 pl-8 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>
          
          <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Download Screenshot">
            <Camera size={18} />
          </button>
        </div>

        {/* Browser Viewport (Mock) */}
        <div className="flex-1 relative bg-white">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <Globe size={64} className="mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-600 mb-2">Browser View</h2>
            <p className="max-w-md text-center text-sm mb-6">
              This is a mock browser viewport. In a real implementation, this would be an iframe or a stream from a headless browser session.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 max-w-lg w-full">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold">B</div>
                <div>
                  <div className="font-bold text-slate-800">Brave Search Results</div>
                  <div className="text-xs text-green-600">https://search.brave.com</div>
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i}>
                    <div className="text-xs text-slate-500 mb-0.5">example.com › result-{i}</div>
                    <div className="text-blue-600 font-medium hover:underline cursor-pointer">Search Result Title #{i}</div>
                    <div className="text-sm text-slate-600 line-clamp-2">
                      This is a description of the search result found by the Brave Search engine. It contains relevant keywords and context.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {loading && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-slate-700">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
