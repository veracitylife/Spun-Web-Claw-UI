import { useState } from 'react';
import { FileText, Send, Inbox, Archive, Trash2, Plus, RefreshCw } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface HimalayaInterfaceProps {
  skillId: string;
}

export default function HimalayaInterface({ skillId }: HimalayaInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'drafts'>('inbox');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock data
  const emails = [
    { id: 1, subject: 'Project Update', from: 'alice@example.com', date: '10:30 AM', preview: 'Here is the latest update on the project...' },
    { id: 2, subject: 'Meeting Notes', from: 'bob@example.com', date: 'Yesterday', preview: 'Thanks for attending the meeting. Key takeaways...' },
    { id: 3, subject: 'Invoice #1234', from: 'billing@service.com', date: 'Feb 26', preview: 'Your invoice for February is ready...' },
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

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Function Bar */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => handleCommand('compose')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Compose
          </button>
          <button 
            onClick={() => handleCommand('sync')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Sync
          </button>
        </div>
        
        {/* Templates */}
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Templates:</span>
          <button 
            onClick={() => handleCommand('template', { name: 'meeting-request' })}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs flex items-center gap-2 border border-slate-600"
          >
            <FileText size={12} /> Meeting Req
          </button>
          <button 
            onClick={() => handleCommand('template', { name: 'follow-up' })}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs flex items-center gap-2 border border-slate-600"
          >
            <FileText size={12} /> Follow-up
          </button>
          <button 
            onClick={() => handleCommand('template', { name: 'invoice' })}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs flex items-center gap-2 border border-slate-600"
          >
            <FileText size={12} /> Invoice
          </button>
        </div>
      </div>

      {/* Main Email View */}
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'inbox' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
          >
            <Inbox size={16} /> Inbox
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'sent' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
          >
            <Send size={16} /> Sent
          </button>
          <button 
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'drafts' ? 'border-blue-500 text-blue-400 bg-slate-700/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
          >
            <Archive size={16} /> Drafts
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <div key={email.id} className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors p-4 group">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-white">{email.from}</span>
                <span className="text-xs text-slate-400">{email.date}</span>
              </div>
              <h4 className="text-sm font-medium text-slate-200 mb-1">{email.subject}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{email.preview}</p>
              
              <div className="mt-2 hidden group-hover:flex gap-2 justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCommand('reply', { id: email.id }); }}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded"
                >
                  Reply
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCommand('delete', { id: email.id }); }}
                  className="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          
          <div className="p-8 text-center text-slate-500 text-sm">
            End of list
          </div>
        </div>
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
