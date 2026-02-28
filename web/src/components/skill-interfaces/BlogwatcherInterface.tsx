import React, { useState, useEffect } from 'react';
import { Rss, Plus, ExternalLink, Bell, RefreshCw, Filter, Bookmark } from 'lucide-react';
import { runSkillCommand } from '../../api';

interface BlogwatcherInterfaceProps {
  skillId: string;
}

interface Feed {
  id: string;
  name: string;
  url: string;
  lastUpdated: string;
  unreadCount: number;
}

interface Article {
  id: string;
  feedId: string;
  title: string;
  snippet: string;
  url: string;
  publishedAt: string;
  read: boolean;
  bookmarked: boolean;
}

const BlogwatcherInterface: React.FC<BlogwatcherInterfaceProps> = ({ skillId }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');

  useEffect(() => {
    // Mock data
    setFeeds([
      { id: '1', name: 'TechCrunch', url: 'https://techcrunch.com/feed', lastUpdated: '10 mins ago', unreadCount: 5 },
      { id: '2', name: 'Hacker News', url: 'https://news.ycombinator.com/rss', lastUpdated: '1 hour ago', unreadCount: 12 },
      { id: '3', name: 'Dev.to', url: 'https://dev.to/feed', lastUpdated: '2 hours ago', unreadCount: 3 },
    ]);

    setArticles([
      { id: 'a1', feedId: '1', title: 'AI Startup Raises $50M Series A', snippet: 'The new round of funding will accelerate the development of...', url: '#', publishedAt: '15 mins ago', read: false, bookmarked: false },
      { id: 'a2', feedId: '1', title: 'Review: The New MacBook Pro', snippet: 'Apple\'s latest laptop brings back the ports we missed...', url: '#', publishedAt: '45 mins ago', read: true, bookmarked: true },
      { id: 'a3', feedId: '2', title: 'Show HN: Open Source CRM', snippet: 'A lightweight CRM built with React and Node.js...', url: '#', publishedAt: '1 hour ago', read: false, bookmarked: false },
    ]);
  }, []);

  const handleAddFeed = async () => {
    if (!newFeedUrl.trim()) return;
    setLoading(true);
    try {
      await runSkillCommand(skillId, 'add_feed', { url: newFeedUrl });
      setFeeds(prev => [...prev, {
        id: Date.now().toString(),
        name: 'New Feed',
        url: newFeedUrl,
        lastUpdated: 'Just now',
        unreadCount: 0
      }]);
      setNewFeedUrl('');
      setShowAddFeed(false);
    } catch (error) {
      console.error('Failed to add feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Mock refresh
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredArticles = selectedFeedId 
    ? articles.filter(a => a.feedId === selectedFeedId)
    : articles;

  return (
    <div className="flex h-full bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Sidebar - Feeds List */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <Rss size={20} className="text-orange-500" />
            Feeds
          </h2>
          <button 
            onClick={() => setShowAddFeed(!showAddFeed)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        {showAddFeed && (
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <input 
              type="text" 
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="Enter RSS URL"
              className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 mb-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button 
              onClick={handleAddFeed}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded transition-colors disabled:opacity-50"
            >
              Add Feed
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <button 
            onClick={() => setSelectedFeedId(null)}
            className={`w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!selectedFeedId ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500' : 'border-l-4 border-transparent'}`}
          >
            <span>All Articles</span>
            <span className="bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs px-1.5 rounded-full">
              {articles.length}
            </span>
          </button>
          
          {feeds.map((feed) => (
            <button 
              key={feed.id}
              onClick={() => setSelectedFeedId(feed.id)}
              className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${selectedFeedId === feed.id ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500' : 'border-l-4 border-transparent'}`}
            >
              <span className="truncate max-w-[140px]">{feed.name}</span>
              {feed.unreadCount > 0 && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-xs px-1.5 rounded-full font-bold">
                  {feed.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Article List */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shadow-sm z-10">
          <h1 className="text-xl font-bold truncate">
            {selectedFeedId ? feeds.find(f => f.id === selectedFeedId)?.name : 'All Articles'}
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ${loading ? 'animate-spin text-orange-500' : 'text-slate-500'}`}
            >
              <RefreshCw size={20} />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900 space-y-4">
          {filteredArticles.map((article) => (
            <div key={article.id} className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow ${article.read ? 'opacity-75' : ''}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                    {article.snippet}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {feeds.find(f => f.id === article.feedId)?.name}
                    </span>
                    <span>•</span>
                    <span>{article.publishedAt}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                   <button className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${article.bookmarked ? 'text-blue-500' : 'text-slate-400'}`}>
                     <Bookmark size={18} fill={article.bookmarked ? "currentColor" : "none"} />
                   </button>
                   <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-blue-500">
                     <ExternalLink size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <Bell size={48} className="mx-auto mb-4 opacity-50" />
              <p>No articles found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogwatcherInterface;
