import { useState } from 'react';
import { Globe, Play, Square, Camera, Terminal, ArrowRight, RefreshCw } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface BrowserUseInterfaceProps {
  skillId: string;
}

const BrowserUseInterface: React.FC<BrowserUseInterfaceProps> = ({ skillId }) => {
  const [url, setUrl] = useState('https://google.com');
  const [task, setTask] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleNavigate = async () => {
    setIsRunning(true);
    addLog(`Navigating to ${url}...`);
    try {
      await runSkillCommand(skillId, 'navigate', { url });
      addLog(`Navigated to ${url}`);
      const shot = await runSkillCommand(skillId, 'get_screenshot', {});
      if (shot?.output) setScreenshot(shot.output);
    } catch (error) {
      addLog(`Error: ${(error as any).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTask = async () => {
    if (!task.trim()) return;
    setIsRunning(true);
    addLog(`Running task: ${task}`);
    try {
      await runSkillCommand(skillId, 'run_task', { instructions: task });
      addLog('Task completed successfully');
      const shot = await runSkillCommand(skillId, 'get_screenshot', {});
      if (shot?.output) setScreenshot(shot.output);
    } catch (error) {
      addLog(`Error: ${(error as any).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    try {
      await runSkillCommand(skillId, 'stop', {});
      addLog('Browser agent stopped');
      setIsRunning(false);
    } catch (error) {
      addLog(`Error stopping: ${(error as any).message}`);
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 gap-4 overflow-hidden">
      {/* Control Bar */}
      <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to visit..."
              className="w-full bg-slate-900 border border-slate-700 rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={handleNavigate}
            disabled={isRunning}
            className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowRight size={16} />
            Go
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Terminal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe a task for the browser agent (e.g., 'Find the cheapest flight to London')..."
              className="w-full bg-slate-900 border border-slate-700 rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={handleRunTask}
            disabled={isRunning || !task.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Play size={16} />
            Run Agent
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Square size={16} />
            Stop
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Browser View / Screenshot */}
        <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 flex flex-col overflow-hidden">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} />
              Live Browser View
            </span>
            <button 
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              onClick={async () => {
                const shot = await runSkillCommand(skillId, 'get_screenshot', {});
                if (shot?.output) setScreenshot(shot.output);
              }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {screenshot ? (
              <img src={screenshot} alt="Browser Screenshot" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-slate-600 flex flex-col items-center gap-2">
                <Globe size={48} className="opacity-20" />
                <span>No active browser session</span>
              </div>
            )}
          </div>
        </div>

        {/* Logs */}
        <div className="w-80 bg-slate-800 rounded-lg border border-slate-700 flex flex-col overflow-hidden">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-700">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} />
              Agent Logs
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
            {logs.length === 0 ? (
              <span className="text-slate-600 italic">No logs yet...</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="break-words border-b border-slate-700/50 pb-1 last:border-0">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserUseInterface;
