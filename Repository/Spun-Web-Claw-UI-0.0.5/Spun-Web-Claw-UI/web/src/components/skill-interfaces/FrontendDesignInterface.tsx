import { useState } from 'react';
import { Code, Play, Eye, Download, Layers, Tablet, Monitor, Smartphone } from 'lucide-react';
// import { runSkillCommand } from '../../api';

interface FrontendDesignInterfaceProps {
  skillId: string;
}

const FrontendDesignInterface: React.FC<FrontendDesignInterfaceProps> = () => {
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [code, setCode] = useState(`// Welcome to Frontend Design Skill
// Write React/Tailwind code here to generate UI

export default function MyComponent() {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-2xl">
      <h1 className="text-4xl font-bold mb-4">Hello World</h1>
      <p className="text-lg opacity-90">
        This is a generated component using the Frontend Design skill.
      </p>
      <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all">
        Get Started
      </button>
    </div>
  );
}`);

  const handleGenerate = async () => {
    // Mock generation/preview update
    setActiveView('preview');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button 
              onClick={() => setActiveView('editor')}
              className={`p-2 rounded transition-colors ${activeView === 'editor' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Code Editor"
            >
              <Code size={18} />
            </button>
            <button 
              onClick={() => setActiveView('preview')}
              className={`p-2 rounded transition-colors ${activeView === 'preview' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Live Preview"
            >
              <Eye size={18} />
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>

          <div className="flex gap-2">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded transition-colors ${device === 'desktop' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded transition-colors ${device === 'tablet' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              <Tablet size={18} />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded transition-colors ${device === 'mobile' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700'}`}
            >
              <Smartphone size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            Export Code
          </button>
          <button 
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            <Play size={16} />
            Generate
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Components */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-700 font-semibold text-slate-300 flex items-center gap-2">
            <Layers size={18} />
            Components
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {['Heroes', 'Features', 'Testimonials', 'Pricing', 'Footers'].map((category) => (
               <div key={category} className="space-y-2">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{category}</h4>
                 <div className="grid grid-cols-2 gap-2">
                   {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="aspect-video bg-slate-700 rounded border border-slate-600 hover:border-blue-500 cursor-pointer transition-colors opacity-50 hover:opacity-100"></div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col">
          {activeView === 'editor' ? (
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#1e1e1e] text-slate-300 p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          ) : (
            <div className="flex-1 bg-slate-900 flex items-center justify-center p-8 overflow-auto">
              <div 
                className={`bg-white transition-all duration-300 shadow-2xl overflow-hidden origin-top ${
                  device === 'mobile' ? 'w-[375px] h-[667px] rounded-[30px] border-[8px] border-slate-800' :
                  device === 'tablet' ? 'w-[768px] h-[1024px] rounded-[20px] border-[8px] border-slate-800' :
                  'w-full h-full rounded-lg border border-slate-700'
                }`}
              >
                {/* Mock Preview Content */}
                <div className="w-full h-full overflow-auto">
                  <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-full text-white flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl font-bold mb-4">Hello World</h1>
                    <p className="text-lg opacity-90 max-w-md">
                      This is a generated component using the Frontend Design skill.
                    </p>
                    <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontendDesignInterface;
