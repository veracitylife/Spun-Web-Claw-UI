import React, { useState } from 'react';
import { Bot, Send, Cpu, Zap, Settings, Terminal } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface NanoBananaProInterfaceProps {
  skillId: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

const NanoBananaProInterface: React.FC<NanoBananaProInterfaceProps> = ({ skillId }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Nano Banana Pro. How can I assist you with advanced reasoning tasks today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('nano-banana-v1');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      await runSkillCommand(skillId, 'generate', { prompt: input, model });
      
      // Simulate thinking process
      setTimeout(() => {
        const response: Message = { 
          role: 'assistant', 
          content: 'I have analyzed your request. Here is the advanced solution...', 
          timestamp: Date.now() 
        };
        setMessages(prev => [...prev, response]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-6 text-yellow-400 font-bold text-lg">
          <Bot size={24} />
          <span>Nano Banana Pro</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase font-semibold mb-2 block">Model</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm text-slate-200 focus:border-yellow-500 outline-none"
            >
              <option value="nano-banana-v1">Nano Banana v1</option>
              <option value="nano-banana-turbo">Nano Banana Turbo</option>
              <option value="nano-banana-code">Nano Banana Code</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 uppercase font-semibold mb-2 block">Capabilities</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Cpu size={16} className="text-blue-400" />
                <span>Advanced Reasoning</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Terminal size={16} className="text-green-400" />
                <span>Code Execution</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Zap size={16} className="text-yellow-400" />
                <span>Real-time Search</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors w-full p-2 hover:bg-slate-700 rounded">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-70 text-xs">
                  {msg.role === 'user' ? <UserIcon /> : <Bot size={14} />}
                  <span className="capitalize">{msg.role}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="relative max-w-4xl mx-auto">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Nano Banana Pro..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-200 focus:outline-none focus:border-yellow-500 resize-none h-[60px]"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500">Nano Banana Pro may produce inaccurate information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default NanoBananaProInterface;
