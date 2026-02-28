import { useState } from 'react';
import { GitMerge, Plus, Activity, CheckCircle, XCircle, Pause, Play, Settings } from 'lucide-react';
// import { runSkillCommand } from '../../api';

interface AutomationWorkflowsInterfaceProps {
  skillId: string;
}

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  triggers: number;
  actions: number;
}

const AutomationWorkflowsInterface: React.FC<AutomationWorkflowsInterfaceProps> = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'logs'>('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: '1', name: 'New Lead Notification', status: 'active', lastRun: '2 mins ago', triggers: 1, actions: 3 },
    { id: '2', name: 'Weekly Report Generator', status: 'paused', lastRun: '5 days ago', triggers: 1, actions: 2 },
    { id: '3', name: 'Sync CRM to Google Sheets', status: 'error', lastRun: '1 hour ago', triggers: 2, actions: 4 },
  ]);

  const toggleWorkflow = async (id: string, currentStatus: string) => {
    // Mock toggle
    setWorkflows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, status: currentStatus === 'active' ? 'paused' : 'active' };
      }
      return w;
    }));
  };

  return (
    <div className="flex h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            New Workflow
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('workflows')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'workflows' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
          >
            <GitMerge size={18} />
            My Workflows
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}
          >
            <Activity size={18} />
            Execution Logs
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'workflows' ? 'Active Workflows' : 'Recent Activity'}
            </h1>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search workflows..." 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
              />
            </div>
          </div>

          {activeTab === 'workflows' && (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                      workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      <GitMerge size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{workflow.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Activity size={14} />
                          Last run: {workflow.lastRun}
                        </span>
                        <span>•</span>
                        <span>{workflow.triggers} trigger, {workflow.actions} actions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleWorkflow(workflow.id, workflow.status)}
                      className={`p-2 rounded-lg transition-colors ${
                        workflow.status === 'active' 
                          ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={workflow.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}
                    >
                      {workflow.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <Settings size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Workflow</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle size={16} />
                        Success
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">New Lead Notification</td>
                    <td className="px-6 py-4 text-slate-500">2 mins ago</td>
                    <td className="px-6 py-4 text-slate-500">1.2s</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium">
                        <XCircle size={16} />
                        Failed
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Sync CRM to Google Sheets</td>
                    <td className="px-6 py-4 text-slate-500">1 hour ago</td>
                    <td className="px-6 py-4 text-slate-500">5.4s</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationWorkflowsInterface;
