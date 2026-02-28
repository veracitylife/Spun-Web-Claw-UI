import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSkill, runSkillCommand } from '../api';
import { Skill } from '../types';
import Layout from '../components/Layout';
import { Loader2, Terminal, Play, Globe, Mail, Square, RefreshCw } from 'lucide-react';
import { getIcon } from '../utils';
import { getInterfaceComponent } from '../components/skill-interfaces';

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState<string>('');
  const [command, setCommand] = useState('');

  useEffect(() => {
    if (id) {
      fetchSkill(id);
    }
  }, [id]);

  const fetchSkill = async (skillId: string) => {
    try {
      setLoading(true);
      const data = await getSkill(skillId);
      setSkill(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!skill || !command) return;
    try {
      setOutput(prev => prev + `\n> ${command}\nRunning...`);
      const result = await runSkillCommand(skill.id, command);
      setOutput(prev => prev + `\n${result.output}\n`);
      setCommand('');
    } catch (err) {
      setOutput(prev => prev + `\nError running command.\n`);
    }
  };

  const runCommand = async (cmd: string) => {
    if (!skill) return;
    try {
      setOutput(prev => prev + `\n> ${cmd}\nRunning...`);
      const result = await runSkillCommand(skill.id, cmd);
      setOutput(prev => prev + `\n${result.output}\n`);
    } catch (err) {
      setOutput(prev => prev + `\nError running command.\n`);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin" /></div></Layout>;
  }

  if (!skill) {
    return <Layout>Skill not found</Layout>;
  }

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-2">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">Skills</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white">{skill.name}</span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 min-h-[calc(100vh-140px)]">
        {/* Control Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-900 rounded-lg">
                {getIcon(skill)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">{skill.name}</h1>
                <p className="text-xs text-slate-400 capitalize">{skill.type} Skill</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {skill.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => runCommand('start')}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play size={16} /> Start
              </button>
              <button 
                onClick={() => runCommand('stop')}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Square size={16} /> Stop
              </button>
              <button 
                onClick={() => runCommand('restart')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Restart
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex-1 flex flex-col min-h-[300px]">
            <h2 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Terminal size={16} /> Console Output
            </h2>
            <div className="bg-slate-950 rounded p-3 font-mono text-xs text-green-400 overflow-y-auto flex-1 border border-slate-900 shadow-inner">
              {output || <span className="text-slate-600 opacity-50">Waiting for command...</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <input 
                type="text" 
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
                placeholder="Enter command..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleRun}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                <Play size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col min-h-[500px]">
          {(() => {
            const CustomInterface = getInterfaceComponent(skill.id);
            if (CustomInterface) return <CustomInterface skillId={skill.id} />;
            
            if (skill.type === 'browser') return (
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex-1 flex flex-col h-full">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                  <Globe size={16} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Browser View (Embedded)</span>
                </div>
                <div className="flex-1 bg-white relative">
                   <iframe src="https://example.com" className="w-full h-full border-0 absolute inset-0" title="Browser View" />
                </div>
              </div>
            );

            if (skill.type === 'email') return (
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex-1 flex flex-col h-full">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-xs text-slate-400">Email Client</span>
                </div>
                <div className="flex-1 p-6 flex items-center justify-center text-slate-500 flex-col gap-4">
                  <Mail size={48} className="opacity-20" />
                  <p>Email Interface Placeholder</p>
                  <div className="flex gap-2">
                     <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Compose</button>
                     <button className="bg-slate-700 text-white px-4 py-2 rounded text-sm">Check Inbox</button>
                  </div>
                </div>
              </div>
            );

            return (
               <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex-1 flex flex-col h-full p-8 items-center justify-center text-slate-500">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                    {getIcon(skill)}
                  </div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Custom Interface</h3>
                  <p className="max-w-md text-center text-sm">
                    This is a placeholder for the custom interface of <strong>{skill.name}</strong>. 
                    Each skill can render its own specialized controls here.
                  </p>
               </div>
            );
          })()}
        </div>
      </div>
    </Layout>
  );
}
