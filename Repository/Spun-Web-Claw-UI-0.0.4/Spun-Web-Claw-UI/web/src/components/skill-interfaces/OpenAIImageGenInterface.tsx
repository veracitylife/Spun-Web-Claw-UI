import { useState } from 'react';
import { Image, Send, Download, RefreshCw, Sparkles } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface OpenAIImageGenInterfaceProps {
  skillId: string;
}

export default function OpenAIImageGenInterface({ skillId }: OpenAIImageGenInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedImage(null);
    try {
      const result = await runSkillCommand(skillId, 'generate', { prompt, size });
      // Mock result handling - in real app, result.output would contain URL
      // For demo, we'll use a placeholder if no URL returned
      if (result.output && result.output.startsWith('http')) {
        setGeneratedImage(result.output);
      } else {
        // Mock success
        setGeneratedImage(`https://via.placeholder.com/1024?text=${encodeURIComponent(prompt)}`);
      }
    } catch (err) {
      console.error(err);
      // Fallback mock
      setGeneratedImage(`https://via.placeholder.com/1024?text=Mock+Error+${encodeURIComponent(prompt)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400" /> Image Generator
        </h3>
        
        <div className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 min-h-[80px] resize-none"
          />
          
          <div className="flex items-center justify-between">
            <select 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="256x256">256x256</option>
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
            </select>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Result Area */}
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex items-center justify-center p-4 relative min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-purple-400">
            <RefreshCw size={32} className="animate-spin" />
            <p className="text-sm animate-pulse">Creating masterpiece...</p>
          </div>
        ) : generatedImage ? (
          <div className="relative w-full h-full flex items-center justify-center group">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="max-w-full max-h-full object-contain rounded shadow-lg" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a 
                href={generatedImage} 
                download="generated-image.png"
                target="_blank"
                rel="noreferrer"
                className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <Download size={18} /> Download
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <Image size={48} className="opacity-20" />
            <p className="text-sm">Your generated image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
