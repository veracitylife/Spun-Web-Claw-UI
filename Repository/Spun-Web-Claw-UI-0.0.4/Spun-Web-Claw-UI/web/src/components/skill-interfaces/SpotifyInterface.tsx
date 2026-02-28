import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, List, Search } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface SpotifyInterfaceProps {
  skillId: string;
}

export default function SpotifyInterface({ skillId }: SpotifyInterfaceProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Not Playing',
    artist: 'Select a track',
    album: '',
    cover: ''
  });
  const handleCommand = async (cmd: string, args: any = {}) => {
    try {
      await runSkillCommand(skillId, cmd, args);
      if (cmd === 'play') setIsPlaying(true);
      if (cmd === 'pause') setIsPlaying(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Now Playing */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-48 h-48 bg-slate-900 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden group">
          {currentTrack.cover ? (
            <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <Music size={64} className="text-slate-700" />
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{currentTrack.title}</h2>
          <p className="text-slate-400">{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-4">
          <button 
            onClick={() => handleCommand('prev')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={() => handleCommand(isPlaying ? 'pause' : 'play')}
            className="w-14 h-14 bg-green-500 hover:bg-green-400 text-black rounded-full flex items-center justify-center transition-colors shadow-lg hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={() => handleCommand('next')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-full max-w-xs mt-4">
          <Volume2 size={16} className="text-slate-500" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              handleCommand('volume', { level: e.target.value });
            }}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>

      {/* Playlists / Search */}
      <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
        <div className="flex border-b border-slate-700">
          <div className="px-4 py-3 flex items-center gap-2 text-sm font-medium text-white border-b-2 border-green-500 bg-slate-700/50">
            <List size={16} /> Playlists
          </div>
          <div className="px-4 py-3 flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">
            <Search size={16} /> Search
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {['Discover Weekly', 'Daily Mix 1', 'Release Radar', 'Liked Songs'].map((list, i) => (
            <div 
              key={i}
              className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded cursor-pointer transition-colors group"
              onClick={() => {
                setCurrentTrack({ title: 'Song from ' + list, artist: 'Various Artists', album: list, cover: '' });
                setIsPlaying(true);
                handleCommand('play_playlist', { name: list });
              }}
            >
              <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center text-slate-500 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                <Music size={16} />
              </div>
              <span className="text-sm text-slate-300 font-medium group-hover:text-white">{list}</span>
              <button className="ml-auto opacity-0 group-hover:opacity-100 text-green-500 transition-opacity">
                <Play size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
