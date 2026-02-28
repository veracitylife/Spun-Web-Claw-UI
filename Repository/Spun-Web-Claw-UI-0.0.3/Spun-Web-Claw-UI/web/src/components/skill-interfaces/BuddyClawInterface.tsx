import { useState, useEffect } from 'react';
import { Heart, Zap, Smile, Frown, Meh, Send } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface BuddyClawInterfaceProps {
  skillId: string;
}

interface Message {
  role: 'user' | 'buddy';
  content: string;
  timestamp: number;
}

const BuddyClawInterface: React.FC<BuddyClawInterfaceProps> = ({ skillId }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'buddy', content: "Hi friend! I'm BuddyClaw. How can I help you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState<'happy' | 'sad' | 'neutral' | 'excited'>('happy');
  const [energy, setEnergy] = useState(85);
  const [friendship, setFriendship] = useState(42);

  useEffect(() => {
    // Mood changes over time mock
    const interval = setInterval(() => {
      setEnergy(prev => Math.max(0, Math.min(100, prev + (Math.random() > 0.5 ? -1 : 1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock response
    setTimeout(async () => {
      try {
        await runSkillCommand(skillId, 'chat', { message: input });
        
        const responses = [
          "That's interesting! Tell me more.",
          "I can help with that task.",
          "You're doing great!",
          "Let's explore that together.",
          "I'm feeling happy to chat with you."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, { role: 'buddy', content: randomResponse, timestamp: Date.now() }]);
        setFriendship(prev => Math.min(100, prev + 1));
        setMood('excited');
        setTimeout(() => setMood('happy'), 3000);
      } catch (error) {
        console.error('Chat error:', error);
      }
    }, 1000);
  };

  return (
    <div className="flex h-full bg-indigo-950 text-indigo-100 overflow-hidden rounded-xl border border-indigo-900 shadow-2xl">
      {/* Buddy Status Panel */}
      <div className="w-64 bg-indigo-900/50 border-r border-indigo-800 p-6 flex flex-col items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg transition-transform duration-300 transform group-hover:scale-110 ${
            mood === 'happy' ? 'bg-yellow-400' :
            mood === 'sad' ? 'bg-blue-400' :
            mood === 'excited' ? 'bg-pink-400' : 'bg-slate-400'
          }`}>
            {mood === 'happy' && <Smile size={64} className="text-white" />}
            {mood === 'sad' && <Frown size={64} className="text-white" />}
            {mood === 'excited' && <Zap size={64} className="text-white animate-pulse" />}
            {mood === 'neutral' && <Meh size={64} className="text-white" />}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white text-indigo-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            Lv. 5
          </div>
        </div>

        <div className="w-full space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1 text-indigo-300">
              <span className="flex items-center gap-1"><Zap size={12} /> Energy</span>
              <span>{energy}%</span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold uppercase mb-1 text-indigo-300">
              <span className="flex items-center gap-1"><Heart size={12} /> Friendship</span>
              <span>{friendship}%</span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${friendship}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-auto text-center">
          <h3 className="font-bold text-xl text-white">BuddyClaw</h3>
          <p className="text-indigo-400 text-sm">Your AI Companion</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-indigo-950/80 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-indigo-900 rounded-tl-none'
              }`}>
                <p>{msg.content}</p>
                <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-900 border-t border-indigo-800">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Say something to BuddyClaw..."
              className="w-full bg-indigo-950 border border-indigo-700 rounded-full py-3 pl-5 pr-12 text-indigo-100 placeholder-indigo-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyClawInterface;
