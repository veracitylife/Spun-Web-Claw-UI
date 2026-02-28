import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Activity, MessageSquare, ExternalLink } from 'lucide-react';
import { APP_VERSION } from '../version';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const gatewayUrl = (typeof window !== 'undefined' && (localStorage.getItem('gateway_url') || 'http://localhost:18789')) as string;
  const betterGatewayUrl = (typeof window !== 'undefined' && (localStorage.getItem('better_gateway_url') || `${gatewayUrl.replace(/\/$/, '')}/better-gateway/`)) as string;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 leading-tight">
                Spun Web
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">ClawHub Skill UI</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <a 
              href={gatewayUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium hover:bg-slate-700 text-slate-300"
              title="OpenClaw Gateway"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Gateway</span>
            </a>
            <a 
              href={betterGatewayUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium hover:bg-slate-700 text-slate-300"
              title="OpenClaw Better Gateway"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">Better Gateway</span>
            </a>
            <Link 
              to="/skill/buddyclaw" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                location.pathname.startsWith('/skill/buddyclaw') ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
              title="Original OpenClaw Chat/Dashboard"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">OpenClaw Dashboard</span>
            </Link>
            <Link 
              to="/openclaw-chat" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/openclaw-chat' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <MessageSquare size={16} />
              <span className="hidden sm:inline">OpenClaw Chat</span>
            </Link>
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                location.pathname === '/settings' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 container mx-auto max-w-7xl">
        {children}
      </main>
      <footer className="bg-slate-950 py-4 px-4 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()} Spun Web Technology • v{APP_VERSION}</p>
      </footer>
    </div>
  );
}
