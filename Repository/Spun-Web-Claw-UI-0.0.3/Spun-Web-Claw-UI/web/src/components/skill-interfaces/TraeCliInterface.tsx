import { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Trash2, Command, ChevronRight } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface TraeCliInterfaceProps {
  skillId: string;
}

const TraeCliInterface: React.FC<TraeCliInterfaceProps> = ({ skillId }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ type: 'input' | 'output' | 'error'; content: string }[]>([
    { type: 'output', content: 'Trae CLI Interface v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add command to output
    setOutput(prev => [...prev, { type: 'input', content: `> ${cmd}` }]);
    setInput('');
    setIsProcessing(true);

    try {
      // Execute command via API
      const response = await runSkillCommand(skillId, 'execute', { command: cmd });
      
      // Mock response if API is just a mock
      const result = response.output || `Executed: ${cmd}`;
      
      setOutput(prev => [...prev, { type: 'output', content: result }]);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', content: `Error: ${(error as any).message}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommand(input);
    }
  };

  const clearTerminal = () => {
    setOutput([{ type: 'output', content: 'Terminal cleared.' }]);
  };

  const quickCommands = [
    { label: 'Status', cmd: 'status' },
    { label: 'Version', cmd: 'version' },
    { label: 'List Skills', cmd: 'list-skills' },
    { label: 'System Info', cmd: 'sysinfo' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-mono">
      {/* Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-sky-500" />
          <span className="font-bold text-sm text-slate-300">Trae CLI Console</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearTerminal}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            title="Clear Terminal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {output.map((line, index) => (
          <div 
            key={index} 
            className={`whitespace-pre-wrap break-words ${
              line.type === 'input' ? 'text-sky-400 font-bold mt-4 mb-1' : 
              line.type === 'error' ? 'text-red-400' : 
              'text-slate-300'
            }`}
          >
            {line.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-slate-500 animate-pulse">Processing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        {/* Quick Commands */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {quickCommands.map((qc) => (
            <button
              key={qc.cmd}
              onClick={() => handleCommand(qc.cmd)}
              disabled={isProcessing}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Command size={12} />
              {qc.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <ChevronRight size={18} className="text-sky-500 absolute left-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            autoFocus
            placeholder="Enter command..."
            className="w-full bg-transparent border-none focus:ring-0 pl-6 text-slate-200 placeholder-slate-600 font-mono"
          />
          <button
            onClick={() => handleCommand(input)}
            disabled={isProcessing || !input.trim()}
            className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraeCliInterface;
