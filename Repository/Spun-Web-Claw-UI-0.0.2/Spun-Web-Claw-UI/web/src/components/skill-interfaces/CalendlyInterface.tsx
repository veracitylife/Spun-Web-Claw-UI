import { useState, useEffect } from 'react';
import { Calendar, Clock, Link as LinkIcon } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface CalendlyInterfaceProps {
  skillId: string;
}

interface EventType {
  id: string;
  name: string;
  duration: number;
  url: string;
  active: boolean;
  color: string;
}

interface ScheduledEvent {
  id: string;
  name: string;
  startTime: string;
  status: 'active' | 'canceled';
  invitee: string;
}

const CalendlyInterface: React.FC<CalendlyInterfaceProps> = ({ skillId }) => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'types' | 'scheduled'>('types');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setEventTypes([
      {
        id: '1',
        name: '30 Minute Meeting',
        duration: 30,
        url: 'https://calendly.com/user/30min',
        active: true,
        color: 'bg-purple-500'
      },
      {
        id: '2',
        name: '1 Hour Strategy Session',
        duration: 60,
        url: 'https://calendly.com/user/60min',
        active: true,
        color: 'bg-blue-500'
      },
      {
        id: '3',
        name: 'Quick Chat',
        duration: 15,
        url: 'https://calendly.com/user/15min',
        active: false,
        color: 'bg-green-500'
      }
    ]);

    setScheduledEvents([
      {
        id: 'e1',
        name: 'Project Sync',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        status: 'active',
        invitee: 'john.doe@example.com'
      },
      {
        id: 'e2',
        name: 'Client Demo',
        startTime: new Date(Date.now() + 172800000).toISOString(),
        status: 'active',
        invitee: 'jane.smith@client.com'
      },
      {
        id: 'e3',
        name: 'Interview',
        startTime: new Date(Date.now() - 86400000).toISOString(),
        status: 'canceled',
        invitee: 'candidate@test.com'
      }
    ]);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast or feedback (omitted for brevity)
  };

  const toggleEventType = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      await runSkillCommand(skillId, 'toggle_event_type', { id, active: !currentStatus });
      setEventTypes(prev => prev.map(et => 
        et.id === id ? { ...et, active: !currentStatus } : et
      ));
    } catch (error) {
      console.error('Failed to toggle event type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Calendar className="w-8 h-8" />
          Calendly
        </h2>
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab('types')}
             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'types' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
           >
             Event Types
           </button>
           <button 
             onClick={() => setActiveTab('scheduled')}
             className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
           >
             Scheduled Events
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((et) => (
              <div key={et.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 ${et.color}`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{et.name}</h3>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          name={`toggle-${et.id}`} 
                          id={`toggle-${et.id}`} 
                          checked={et.active}
                          onChange={() => toggleEventType(et.id, et.active)}
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5"
                          disabled={loading}
                        />
                        <label 
                          htmlFor={`toggle-${et.id}`} 
                          className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${et.active ? 'bg-green-400' : 'bg-slate-300'}`}
                        ></label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 text-sm">
                    <Clock size={16} />
                    <span>{et.duration} min</span>
                    <span className="mx-1">•</span>
                    <span>One-on-One</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                    <button 
                      onClick={() => copyLink(et.url)}
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <LinkIcon size={14} />
                      Copy Link
                    </button>
                    <button className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-600 rounded px-3 py-1">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Event Type Card */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <span className="text-2xl">+</span>
              </div>
              <span className="font-medium">New Event Type</span>
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Invitee</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {scheduledEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${event.status === 'active' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                          {event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(event.startTime).toLocaleDateString()} at {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                           {event.invitee.charAt(0).toUpperCase()}
                         </div>
                         {event.invitee}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-blue-500 transition-colors mr-3">
                           Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {scheduledEvents.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                No scheduled events found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendlyInterface;
