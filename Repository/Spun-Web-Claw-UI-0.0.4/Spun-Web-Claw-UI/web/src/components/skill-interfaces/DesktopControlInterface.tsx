import React, { useState, useEffect } from 'react';
import { Monitor, Camera, Keyboard, MousePointer, Power, RefreshCw, Terminal } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface DesktopControlInterfaceProps {
  skillId: string;
}

const DesktopControlInterface: React.FC<DesktopControlInterfaceProps> = ({ skillId }) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    // Initial screenshot
    handleScreenshot();
  }, []);

  const handleScreenshot = async () => {
    setLoading(true);
    try {
      // In a real app, this would get a base64 image
      await runSkillCommand(skillId, 'get_screenshot');
      
      // Mock update
      setTimeout(() => {
        // Placeholder image for demo
        setScreenshot('https://picsum.photos/1920/1080'); 
        setLoading(false);
        setLastAction('Screenshot captured');
      }, 1000);
    } catch (error) {
      console.error('Screenshot failed:', error);
      setLoading(false);
    }
  };

  const sendKey = async (key: string) => {
    try {
      await runSkillCommand(skillId, 'press_key', { key });
      setLastAction(`Key pressed: ${key}`);
    } catch (error) {
      console.error('Key press failed:', error);
    }
  };

  const sendCommand = async (cmd: string) => {
    try {
      await runSkillCommand(skillId, 'run_command', { command: cmd });
      setLastAction(`Command sent: ${cmd}`);
    } catch (error) {
      console.error('Command failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Monitor className="text-blue-400" />
            Desktop Control
          </h2>
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          <button 
            onClick={handleScreenshot}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
          >
            <Camera size={16} />
            Capture
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
           {loading && <RefreshCw size={14} className="animate-spin" />}
           <span>{lastAction || 'Ready'}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main View (Screenshot) */}
        <div className="flex-1 bg-black flex items-center justify-center relative overflow-auto p-4">
          {screenshot ? (
            <img 
              src={screenshot} 
              alt="Desktop Screenshot" 
              className="max-w-full max-h-full object-contain shadow-2xl border border-slate-800 rounded"
            />
          ) : (
            <div className="text-slate-500 flex flex-col items-center">
              <Monitor size={64} className="mb-4 opacity-50" />
              <p>No screenshot available</p>
            </div>
          )}
          
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="w-72 bg-slate-800 border-l border-slate-700 p-4 flex flex-col gap-6 overflow-y-auto">
          {/* Quick Keys */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Keyboard size={14} />
              Quick Keys
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => sendKey('enter')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Enter</button>
              <button onClick={() => sendKey('esc')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Esc</button>
              <button onClick={() => sendKey('space')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Space</button>
              <button onClick={() => sendKey('backspace')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Backspace</button>
              <button onClick={() => sendKey('up')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Up</button>
              <button onClick={() => sendKey('down')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors">Down</button>
            </div>
          </div>

          {/* Mouse Controls */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <MousePointer size={14} />
              Mouse Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => sendCommand('click_left')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors text-left px-3">Left Click</button>
              <button onClick={() => sendCommand('click_right')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors text-left px-3">Right Click</button>
              <button onClick={() => sendCommand('scroll_down')} className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors text-left px-3">Scroll Down</button>
            </div>
          </div>

          {/* System Commands */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Terminal size={14} />
              System
            </h3>
            <div className="space-y-2">
              <button onClick={() => sendCommand('lock_screen')} className="w-full bg-slate-700 hover:bg-slate-600 p-2 rounded text-sm transition-colors flex items-center gap-2 text-yellow-400">
                Lock Screen
              </button>
              <button onClick={() => sendCommand('shutdown')} className="w-full bg-slate-700 hover:bg-red-900/50 p-2 rounded text-sm transition-colors flex items-center gap-2 text-red-400">
                <Power size={14} />
                Shutdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopControlInterface;
