import React, { useState, useEffect } from 'react';
import { Phone, Settings, List, Users, FileText, Volume2, Plus, Trash, Play, Save, ArrowDown, X } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface VapiCallsInterfaceProps {
  skillId: string;
}

interface CallLog {
  id: string;
  phoneNumber: string;
  duration: string;
  status: 'completed' | 'failed' | 'busy';
  timestamp: string;
  cost: number;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
}

interface Script {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

interface Campaign {
  id: string;
  name: string;
  scriptId: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  progress: number;
  total: number;
}

const VapiCallsInterface: React.FC<VapiCallsInterfaceProps> = ({ skillId }) => {
  const [activeTab, setActiveTab] = useState<'dialer' | 'contacts' | 'scripts' | 'campaigns'>('dialer');
  
  // Dialer State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('Ready');
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [selectedVoice] = useState('rachel');

  // Call Center State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Forms State
  const [newContact, setNewContact] = useState({ name: '', phone: '', tags: '' });
  const [newScript, setNewScript] = useState({ name: '', content: '' });
  const [newCampaign, setNewCampaign] = useState({ name: '', scriptId: '' });

  useEffect(() => {
    // Mock Data Initialization
    setCallLogs([
      { id: '1', phoneNumber: '+1234567890', duration: '05:23', status: 'completed', timestamp: new Date(Date.now() - 3600000).toISOString(), cost: 0.15 },
      { id: '2', phoneNumber: '+1987654321', duration: '00:45', status: 'failed', timestamp: new Date(Date.now() - 7200000).toISOString(), cost: 0.02 },
    ]);

    setContacts([
      { id: '1', name: 'John Doe', phone: '+15550101', tags: ['lead', 'tech'] },
      { id: '2', name: 'Jane Smith', phone: '+15550102', tags: ['customer', 'vip'] },
      { id: '3', name: 'Acme Corp', phone: '+15550103', tags: ['business'] },
    ]);

    setScripts([
      { id: '1', name: 'Sales Intro', content: "Hi {name}, this is calling from Spun Web. Do you have a moment?", variables: ['name'] },
      { id: '2', name: 'Appointment Reminder', content: "Hello {name}, reminding you of your appointment tomorrow.", variables: ['name'] },
    ]);

    setCampaigns([
      { id: '1', name: 'Weekly Outreach', scriptId: '1', status: 'completed', progress: 50, total: 50 },
      { id: '2', name: 'New Product Launch', scriptId: '1', status: 'running', progress: 12, total: 100 },
    ]);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleCall = async () => {
    if (!phoneNumber || isCallActive) return;
    setCallStatus('Connecting...');
    setIsCallActive(true);
    setCallDuration(0);
    try {
      await runSkillCommand(skillId, 'start_call', { phoneNumber, voiceId: selectedVoice });
      setCallStatus('Connected');
    } catch (error) {
      setCallStatus('Failed');
      setIsCallActive(false);
    }
  };

  const handleHangup = async () => {
    if (!isCallActive) return;
    try {
      await runSkillCommand(skillId, 'end_call', { phoneNumber });
      setCallStatus('Ended');
      setTimeout(() => {
        setIsCallActive(false);
        setCallStatus('Ready');
        setCallLogs(prev => [{
          id: Date.now().toString(),
          phoneNumber,
          duration: formatDuration(callDuration),
          status: 'completed',
          timestamp: new Date().toISOString(),
          cost: 0.05
        }, ...prev]);
      }, 1000);
    } catch (error) {
      setIsCallActive(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // CRUD Operations
  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts([...contacts, { 
      id: Date.now().toString(), 
      name: newContact.name, 
      phone: newContact.phone, 
      tags: newContact.tags.split(',').map(t => t.trim()).filter(Boolean) 
    }]);
    setNewContact({ name: '', phone: '', tags: '' });
  };

  const addScript = () => {
    if (!newScript.name || !newScript.content) return;
    const variables = (newScript.content.match(/\{([^}]+)\}/g) || []).map(v => v.slice(1, -1));
    setScripts([...scripts, { 
      id: Date.now().toString(), 
      name: newScript.name, 
      content: newScript.content,
      variables 
    }]);
    setNewScript({ name: '', content: '' });
  };

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.scriptId) return;
    setCampaigns([...campaigns, {
      id: Date.now().toString(),
      name: newCampaign.name,
      scriptId: newCampaign.scriptId,
      status: 'draft',
      progress: 0,
      total: contacts.length
    }]);
    setNewCampaign({ name: '', scriptId: '' });
  };

  const toggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'running' ? 'paused' : 'running' };
      }
      return c;
    }));
  };

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-slate-800 border-r border-slate-700 flex flex-col items-center py-6 gap-6 z-10">
        <button 
          onClick={() => setActiveTab('dialer')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'dialer' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="Dialer"
        >
          <Phone size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('campaigns')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'campaigns' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="Call Center"
        >
          <Volume2 size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="Contacts"
        >
          <Users size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('scripts')}
          className={`p-3 rounded-xl transition-all ${activeTab === 'scripts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
          title="Scripts"
        >
          <FileText size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        
        {/* DIALER TAB */}
        {activeTab === 'dialer' && (
          <div className="h-full flex flex-col md:flex-row">
            {/* Phone Keypad Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                  <div className={`text-3xl font-mono mb-2 ${isCallActive ? 'text-green-400' : 'text-white'}`}>
                    {isCallActive ? formatDuration(callDuration) : '00:00'}
                  </div>
                  <div className="text-slate-400 font-medium">{callStatus}</div>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl mb-8">
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full bg-transparent text-3xl text-center text-white focus:outline-none placeholder-slate-600 font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                    <button 
                      key={key}
                      onClick={() => setPhoneNumber(prev => prev + key)}
                      className="h-16 rounded-full bg-slate-800 hover:bg-slate-700 text-2xl font-bold text-slate-200 transition-colors shadow-sm active:scale-95"
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-6">
                  {isCallActive ? (
                    <button 
                      onClick={handleHangup}
                      className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <X size={32} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleCall}
                      disabled={!phoneNumber}
                      className="w-20 h-20 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Phone size={32} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Call History Sidebar */}
            <div className="w-full md:w-96 bg-slate-900 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <List size={20} /> Recent Calls
              </h3>
              <div className="space-y-3">
                {callLogs.map((log) => (
                  <div key={log.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${log.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {log.status === 'completed' ? <Phone size={16} /> : <X size={16} />}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{log.phoneNumber}</div>
                        <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()} • {log.duration}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-300">${log.cost.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Vapi Call Center</h1>
                <p className="text-slate-400">Manage bulk calling campaigns and automated outreach.</p>
              </div>
              <div className="flex gap-2">
                 {/* Create Campaign Form would be a modal in real app */}
              </div>
            </div>

            {/* Create Campaign Box */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Create New Campaign</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Campaign Name</label>
                  <input 
                    type="text" 
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                    placeholder="e.g. Summer Sale Outreach"
                  />
                </div>
                <div className="w-64">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Script Template</label>
                  <select 
                    value={newCampaign.scriptId}
                    onChange={(e) => setNewCampaign({...newCampaign, scriptId: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                  >
                    <option value="">Select Script...</option>
                    {scripts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <button 
                  onClick={createCampaign}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium flex items-center gap-2"
                >
                  <Plus size={18} /> Create
                </button>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{campaign.name}</h3>
                    <p className="text-sm text-slate-400 mb-4">
                      Script: <span className="text-blue-400">{scripts.find(s => s.id === campaign.scriptId)?.name || 'Unknown'}</span> • 
                      Status: <span className={`uppercase font-bold text-xs px-2 py-0.5 rounded ${
                        campaign.status === 'running' ? 'bg-green-500/20 text-green-400' :
                        campaign.status === 'completed' ? 'bg-slate-600/20 text-slate-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{campaign.status}</span>
                    </p>
                    <div className="w-96 bg-slate-900 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(campaign.progress / campaign.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{campaign.progress} / {campaign.total} calls completed</div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toggleCampaign(campaign.id)}
                      className={`p-3 rounded-lg flex items-center gap-2 font-medium ${
                        campaign.status === 'running' 
                        ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
                        : 'bg-green-600 hover:bg-green-500 text-white'
                      }`}
                    >
                      {campaign.status === 'running' ? <PauseIcon /> : <Play size={18} />}
                      {campaign.status === 'running' ? 'Pause' : 'Start'}
                    </button>
                    <button className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCRIPTS TAB */}
        {activeTab === 'scripts' && (
          <div className="p-8 max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Call Scripts</h1>
                <p className="text-slate-400">Manage templates for AI voice agents.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor */}
              <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Script Editor</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Script Name</label>
                    <input 
                      type="text" 
                      value={newScript.name}
                      onChange={(e) => setNewScript({...newScript, name: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white"
                      placeholder="e.g. Sales Intro v1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
                    <textarea 
                      value={newScript.content}
                      onChange={(e) => setNewScript({...newScript, content: e.target.value})}
                      className="w-full h-64 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm leading-relaxed"
                      placeholder="Hi {name}, this is an automated call..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Use {'{variable}'} syntax for dynamic fields.</p>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={addScript}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-medium flex items-center gap-2"
                    >
                      <Save size={18} /> Save Script
                    </button>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="space-y-4">
                {scripts.map((script) => (
                  <div key={script.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-white">{script.name}</h4>
                      <button className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-3">{script.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {script.variables.map(v => (
                        <span key={v} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <div className="p-8 max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
                <p className="text-slate-400">Manage contact lists for campaigns.</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded border border-slate-700 flex items-center gap-2">
                  <ArrowDown size={18} /> Import CSV
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex gap-4">
                <input 
                  type="text" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Name"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
                <input 
                  type="text" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Phone"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
                <input 
                  type="text" 
                  value={newContact.tags}
                  onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                  placeholder="Tags (comma separated)"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                />
                <button 
                  onClick={addContact}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Tags</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{contact.name}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono">{contact.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {contact.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs border border-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setContacts(prev => prev.filter(c => c.id !== contact.id))}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Helper component for Pause icon since it might not be imported or conflict
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export default VapiCallsInterface;