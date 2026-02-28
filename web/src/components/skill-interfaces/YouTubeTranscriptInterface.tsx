import { useState } from 'react';
import { Youtube, FileText, Loader2, Download, Copy } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface YouTubeTranscriptInterfaceProps {
  skillId: string;
}

export default function YouTubeTranscriptInterface({ skillId }: YouTubeTranscriptInterfaceProps) {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setTranscript(null);
    try {
      const result = await runSkillCommand(skillId, 'fetch', { url });
      if (result.output) {
        setTranscript(result.output);
      } else {
        // Mock success
        setTranscript(
          `[00:00] Speaker 1: Welcome to this tutorial.\n` +
          `[00:05] Speaker 1: Today we'll learn about React hooks.\n` +
          `[00:10] Speaker 2: What are hooks?\n` +
          `[00:15] Speaker 1: Hooks let you use state without classes.\n` +
          `... (Mock transcript for ${url})`
        );
      }
    } catch (err) {
      setError('Failed to fetch transcript. Check the URL or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Input Area */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Youtube size={16} className="text-red-500" /> Video URL
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
          />
          <button
            onClick={handleFetch}
            disabled={loading || !url}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
            Get Transcript
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Result Area */}
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col min-h-[400px]">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileText size={16} /> Transcript Content
          </h4>
          {transcript && (
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 hover:border-slate-500 transition-colors"
              >
                <Copy size={12} /> Copy
              </button>
              <button 
                className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 hover:border-slate-500 transition-colors"
              >
                <Download size={12} /> Download .txt
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed relative">
          {transcript ? (
            transcript
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
              <FileText size={48} className="opacity-20 mb-2" />
              <p>Enter a video URL to extract the transcript</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
