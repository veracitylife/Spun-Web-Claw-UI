import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { runSkillCommand } from '../api';
import { Edit3, Save, MessageSquare, Play, List, Power, Terminal, Search, Database, LogIn, FileText, Mic, Image as ImageIcon, Youtube, Send, Twitter } from 'lucide-react';

type Script = { id: string; name: string; content: string };

const DEFAULT_SCRIPTS: Script[] = [
  { id: 'list-skills', name: 'List Skills', content: 'List all installed and enabled skills.' },
  { id: 'enable-skill', name: 'Enable Skill', content: 'Enable the skill with id "trae-cli".' },
  { id: 'trae', name: 'Run TRAE', content: 'Run the command: trae --version' },
  { id: 'search', name: 'Search Web', content: 'Search the web for: latest Puppeteer best practices' },
  { id: 'scrape', name: 'Scrape Page', content: 'Open https://news.ycombinator.com and extract the top 10 links.' },
  { id: 'login', name: 'Login Site', content: 'Login to example.com with saved credentials and confirm success.' },
  { id: 'summarize', name: 'Summarize Page', content: 'Summarize the main points of the current page.' },
  { id: 'transcribe', name: 'Transcribe Audio', content: 'Transcribe the audio file at C:\\\\temp\\\\sample.mp3' },
  { id: 'gen-image', name: 'Generate Image', content: 'Create a 512x512 image of a neon cyberpunk city at night.' },
  { id: 'yt-transcript', name: 'YT Transcript', content: 'Fetch the transcript for https://youtu.be/dQw4w9WgXcQ' },
  { id: 'whatsapp', name: 'WhatsApp Message', content: 'Send a WhatsApp message to +15551234567: Hello from OpenClaw.' },
  { id: 'tweet', name: 'Post Tweet', content: 'Post a tweet: Building with ClawHub today!' }
];

export default function OpenClawChat() {
  const [scripts, setScripts] = useState<Script[]>(DEFAULT_SCRIPTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const sendToChat = async (text: string) => {
    if (!text) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setBusy(true);
    try {
      const res = await runSkillCommand('buddyclaw', 'chat', { message: text });
      const output = res.output || 'OK';
      setMessages(prev => [...prev, { role: 'assistant', text: output }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${e.message || 'failed to send'}` }]);
    } finally {
      setBusy(false);
    }
  };

  const runScript = (s: Script) => sendToChat(s.content);

  const startEdit = (s: Script) => {
    setEditingId(s.id);
    setEditingText(s.content);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setScripts(prev => prev.map(s => (s.id === editingId ? { ...s, content: editingText } : s)));
    setEditingId(null);
    setEditingText('');
  };

  const iconForScript = useMemo(() => {
    const map: Record<string, JSX.Element> = {
      'list-skills': <List size={14} />,
      'enable-skill': <Power size={14} />,
      'trae': <Terminal size={14} />,
      'search': <Search size={14} />,
      'scrape': <Database size={14} />,
      'login': <LogIn size={14} />,
      'summarize': <FileText size={14} />,
      'transcribe': <Mic size={14} />,
      'gen-image': <ImageIcon size={14} />,
      'yt-transcript': <Youtube size={14} />,
      'whatsapp': <Send size={14} />,
      'tweet': <Twitter size={14} />
    };
    return map;
  }, []);

  const toneForScript = (id: string) => {
    if (id.includes('search') || id.includes('scrape')) return 'from-purple-500/20 to-fuchsia-500/20';
    if (id.includes('login') || id.includes('enable')) return 'from-emerald-500/20 to-teal-500/20';
    if (id.includes('image')) return 'from-pink-500/20 to-rose-500/20';
    if (id.includes('transcribe')) return 'from-cyan-500/20 to-blue-500/20';
    if (id.includes('yt')) return 'from-red-500/20 to-orange-500/20';
    if (id.includes('tweet') || id.includes('whatsapp')) return 'from-sky-500/20 to-indigo-500/20';
    return 'from-slate-600/20 to-slate-700/20';
  };

  return (
    <Layout>
      <div className="mb-3">
        <Link
          to="/"
          className="inline-flex items-center px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-200"
        >
          OpenClaw Dashboard
        </Link>
      </div>
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Scripts panel */}
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare size={18}/> Scripts</h2>
            {editingId ? (
              <button onClick={saveEdit} className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded">
                <Save size={14} /> Save
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
            {scripts.map(s => (
              <div 
                key={s.id} 
                className={`relative rounded-lg p-2 border border-slate-700 bg-gradient-to-br ${toneForScript(s.id)} group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-slate-900/70 border border-slate-700 flex items-center justify-center text-slate-200">
                      {iconForScript[s.id] || <Play size={14} />}
                    </div>
                    <div className="text-xs font-semibold text-slate-100 truncate">{s.name}</div>
                  </div>
                  <button onClick={() => startEdit(s)} className="text-slate-300/60 hover:text-slate-200">
                    <Edit3 size={14}/>
                  </button>
                </div>
                <button
                  onClick={() => runScript(s)}
                  className="w-full text-left text-xs bg-slate-900/70 hover:bg-slate-900/90 border border-slate-700 rounded px-2 py-2 flex items-center gap-2 transition-colors"
                  title={s.content}
                >
                  <Play size={14} className="text-blue-400"/> 
                  <span className="line-clamp-2 text-slate-300">{s.content}</span>
                </button>
              </div>
            ))}
          </div>

          {editingId && (
            <div className="mt-3">
              <label className="block text-xs text-slate-400 mb-1">Customize Script</label>
              <textarea
                value={editingText}
                onChange={e => setEditingText(e.target.value)}
                className="w-full h-28 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200"
              />
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">OpenClaw Chat</h2>
            <p className="text-xs text-slate-400">Conversational assistant backed by BuddyClaw</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`max-w-3xl ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
                <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-200 border border-slate-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-slate-500 text-sm">Use the script buttons on the left or type below to start chatting.</div>
            )}
          </div>
          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !busy && (sendToChat(input), setInput(''))}
              placeholder="Type your message..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
            />
            <button
              onClick={() => { sendToChat(input); setInput(''); }}
              disabled={busy || !input}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-white text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
