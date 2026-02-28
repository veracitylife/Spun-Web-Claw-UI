import { useState } from 'react';
import { Youtube, Search, Upload, BarChart2, PlaySquare, ThumbsUp, Eye, MessageSquare } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface YouTubeApiInterfaceProps {
  skillId: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  publishedAt: string;
}

const YouTubeApiInterface: React.FC<YouTubeApiInterfaceProps> = ({ skillId }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'stats' | 'upload'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      await runSkillCommand(skillId, 'search_videos', { query: searchQuery });
      
      // Mock results
      setTimeout(() => {
        setVideos([
          {
            id: '1',
            title: 'Building a React App from Scratch',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            views: '1.2M',
            likes: '45K',
            publishedAt: '2 days ago'
          },
          {
            id: '2',
            title: 'Advanced TypeScript Patterns',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            views: '890K',
            likes: '32K',
            publishedAt: '1 week ago'
          },
          {
            id: '3',
            title: 'AI in 2026: What to Expect',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            views: '2.5M',
            likes: '120K',
            publishedAt: '3 days ago'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search failed:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-red-600">
          <Youtube size={28} />
          YouTube Manager
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('search')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'search' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Search
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Channel Stats
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-8">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search videos, channels, or playlists..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full py-3 pl-12 pr-4 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <button 
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="relative aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">12:34</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span>{video.views} views</span>
                      <span className="mx-1">•</span>
                      <span>{video.publishedAt}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <ThumbsUp size={14} />
                        {video.likes}
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-xs font-medium uppercase">
                        Analytics
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && videos.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <PlaySquare size={64} className="mx-auto mb-4 opacity-50" />
                <p>Enter a keyword to search for videos</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                  <Eye size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Views</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,234,567</h3>
                </div>
              </div>
              <div className="text-green-500 text-sm flex items-center gap-1">
                <span>+12.5%</span>
                <span className="text-slate-400">vs last 28 days</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <ThumbsUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Likes</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">45,678</h3>
                </div>
              </div>
              <div className="text-green-500 text-sm flex items-center gap-1">
                <span>+5.2%</span>
                <span className="text-slate-400">vs last 28 days</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Comments</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">8,901</h3>
                </div>
              </div>
              <div className="text-red-500 text-sm flex items-center gap-1">
                <span>-2.1%</span>
                <span className="text-slate-400">vs last 28 days</span>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-64 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart2 size={48} className="mx-auto mb-2 opacity-50" />
                <p>Engagement Chart Placeholder</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer mb-8">
              <Upload size={48} className="text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Drag and drop video files to upload</h3>
              <p className="text-slate-500 mb-6">Your videos will be private until you publish them.</p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Select Files
              </button>
            </div>
            <div className="text-center text-xs text-slate-400">
              By submitting your videos to YouTube, you acknowledge that you agree to YouTube's Terms of Service and Community Guidelines.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeApiInterface;
