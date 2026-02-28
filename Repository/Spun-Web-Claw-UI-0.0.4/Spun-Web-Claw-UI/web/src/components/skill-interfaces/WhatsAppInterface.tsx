import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, QrCode, User, Check, RefreshCw } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface WhatsAppInterfaceProps {
  skillId: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const WhatsAppInterface: React.FC<WhatsAppInterfaceProps> = ({ skillId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock check auth status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // In a real app, this would check with the backend
    // For now, we simulate unauthenticated state initially
    setTimeout(() => {
      // randomly authenticate for demo purposes if not already
      if (!isAuthenticated && Math.random() > 0.7) {
        setIsAuthenticated(true);
        loadMockMessages();
      } else if (!isAuthenticated) {
        generateMockQr();
      }
    }, 1000);
  };

  const generateMockQr = () => {
    // In reality, this would come from the backend whatsapp-web.js client
    setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MockWhatsAppAuth');
  };

  const loadMockMessages = () => {
    setMessages([
      {
        id: '1',
        from: 'me',
        to: '1234567890',
        content: 'Hello! This is a test message from OpenClaw.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      {
        id: '2',
        from: '1234567890',
        to: 'me',
        content: 'Hi! Received loud and clear.',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'read'
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !recipient.trim()) return;

    setLoading(true);
    try {
      await runSkillCommand(skillId, 'send_message', {
        to: recipient,
        message: newMessage
      });

      const newMsg: Message = {
        id: Date.now().toString(),
        from: 'me',
        to: recipient,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Simulate reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          from: recipient,
          to: 'me',
          content: `Auto-reply: I received "${newMsg.content}"`,
          timestamp: new Date().toISOString(),
          status: 'delivered'
        }]);
      }, 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshConnection = () => {
    setIsAuthenticated(false);
    setQrCode(null);
    checkAuthStatus();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="text-green-500" />
          WhatsApp Business
        </h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
            {isAuthenticated ? 'Connected' : 'Disconnected'}
          </span>
          <button 
            onClick={refreshConnection}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            title="Refresh Connection"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code to Connect</h3>
          {qrCode ? (
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48" />
            </div>
          ) : (
            <div className="w-48 h-48 bg-slate-700 animate-pulse rounded-lg mb-4 flex items-center justify-center">
              <QrCode className="text-slate-500" size={48} />
            </div>
          )}
          <p className="text-slate-400 text-center max-w-md">
            Open WhatsApp on your phone, go to Settings {'>'} Linked Devices {'>'} Link a Device, and scan this code.
          </p>
          <button 
            onClick={() => setIsAuthenticated(true)}
            className="mt-6 text-sm text-slate-500 hover:text-slate-300 underline"
          >
            (Dev: Force Connect)
          </button>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Recent Chats List */}
          <div className="w-1/3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
            <div className="p-3 border-b border-slate-700 font-semibold">
              Recent Chats
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 transition-colors">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">1234567890</span>
                  <span className="text-xs text-slate-500">Just now</span>
                </div>
                <div className="text-sm text-slate-400 truncate">
                  {messages[messages.length - 1]?.content || 'No messages'}
                </div>
              </div>
              {/* Mock other chats */}
              <div className="p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 transition-colors opacity-70">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Alice Smith</span>
                  <span className="text-xs text-slate-500">Yesterday</span>
                </div>
                <div className="text-sm text-slate-400 truncate">
                  Can we schedule a meeting?
                </div>
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
            <div className="p-3 border-b border-slate-700 flex items-center gap-2">
              <User size={16} />
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient Number (e.g. 1234567890)"
                className="bg-transparent border-none focus:outline-none text-slate-200 w-full"
              />
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.from === 'me' ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-200'}`}>
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-[10px] opacity-70 flex items-center gap-1 justify-end mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      {msg.from === 'me' && (
                        <span>
                          {msg.status === 'sent' && <Check size={10} />}
                          {msg.status === 'delivered' && <Check size={10} className="text-slate-300" />}
                          {msg.status === 'read' && <Check size={10} className="text-blue-300" />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-700 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-green-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading || !newMessage.trim()}
                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppInterface;
