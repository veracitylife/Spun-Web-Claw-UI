import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
// import { runSkillCommand } from '../../api';

interface GoogleCalendarInterfaceProps {
  skillId: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  color: string;
}

const GoogleCalendarInterface: React.FC<GoogleCalendarInterfaceProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    // Mock events
    setEvents([
      {
        id: '1',
        title: 'Team Sync',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 0, 0, 0)),
        location: 'Zoom',
        color: 'bg-blue-100 text-blue-700 border-blue-200'
      },
      {
        id: '2',
        title: 'Project Deadline',
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        color: 'bg-red-100 text-red-700 border-red-200'
      },
      {
        id: '3',
        title: 'Lunch with Client',
        start: new Date(new Date().setHours(13, 0, 0, 0)),
        end: new Date(new Date().setHours(14, 30, 0, 0)),
        location: 'Downtown Cafe',
        color: 'bg-green-100 text-green-700 border-green-200'
      }
    ]);
  }, []);

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-500" />
            <span className="hidden md:inline">Google Calendar</span>
          </h2>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button onClick={handlePrev} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><ChevronLeft size={20} /></button>
            <span className="px-3 font-medium min-w-[140px] text-center">
              {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={handleNext} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={18} />
            <span className="hidden sm:inline">Create</span>
          </button>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${view === 'month' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${view === 'day' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      <div className="flex-1 overflow-y-auto p-4">
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-slate-50 dark:bg-slate-800 p-2 text-center text-xs font-semibold uppercase text-slate-500">
                {day}
              </div>
            ))}
            
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white dark:bg-slate-900 min-h-[120px] p-2 opacity-50"></div>
            ))}
            
            {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = events.filter(e => e.start.toDateString() === date.toDateString());
              const isToday = new Date().toDateString() === date.toDateString();
              
              return (
                <div key={day} className={`bg-white dark:bg-slate-900 min-h-[120px] p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group relative ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                  <div className={`text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div key={event.id} className={`text-xs p-1.5 rounded border ${event.color} truncate cursor-pointer hover:opacity-80 transition-opacity`}>
                        <div className="font-semibold truncate">{event.title}</div>
                        {event.start.getHours() !== 0 && (
                          <div className="text-[10px] opacity-80 flex items-center gap-1">
                            <Clock size={10} />
                            {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all text-slate-400">
                    <Plus size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {view !== 'month' && (
          <div className="flex items-center justify-center h-full text-slate-400">
             <div className="text-center">
               <Calendar size={48} className="mx-auto mb-4 opacity-50" />
               <p>Week and Day views are under construction.</p>
               <button onClick={() => setView('month')} className="text-blue-500 hover:underline mt-2">Return to Month View</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarInterface;
