import { useState } from 'react';
import { Mic, MicOff, User, Bot } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface VocalChatInterfaceProps {
  skillId: string;
}

export default function VocalChatInterface({ skillId }: VocalChatInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'Hello! I am listening. How can I help you?' }
  ]);

  const toggleListening = async () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate listening and response
      setTimeout(async () => {
        setIsListening(false);
        const userText = "What's the weather like?";
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        
        // Mock sending to backend
        await runSkillCommand(skillId, 'process_audio', { text: userText });
        
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: "It's sunny and 25 degrees today." }]);
        }, 1000);
      }, 3000);
    } else {
      await runSkillCommand(skillId, 'stop_listening');
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Visualizer / Status */}
      <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 flex flex-col items-center justify-center min-h-[200px]">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isListening ? 'bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-110' : 'bg-slate-700/50'}`}>
          <button 
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-slate-600 hover:bg-slate-500 text-slate-300 hover:text-white'}`}
          >
            {isListening ? <MicOff size={40} /> : <Mic size={40} />}
          </button>
        </div>
        <p className="mt-6 text-slate-400 font-medium">
          {isListening ? 'Listening...' : 'Tap to speak'}
        </p>
      </div>

      {/* Chat Log */}
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Conversation History
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-blue-600/20 text-blue-100 border border-blue-600/30' : 'bg-slate-700 text-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
