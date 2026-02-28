import { useState, useEffect } from 'react';
import { Twitter, Search, User, Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { runSkillCommand, getTwitterStatus, getTwitterAuthUrl, disconnectTwitter } from '../../api';

interface TwitterInterfaceProps {
  skillId: string;
}

interface Tweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
}

const TwitterInterface: React.FC<TwitterInterfaceProps> = ({ skillId }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile' | 'automation'>('home');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState('');
  const [threadText, setThreadText] = useState('');
  const [scheduleText, setScheduleText] = useState('');
  const [scheduleWhen, setScheduleWhen] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    loadMockTweets();
    (async () => {
      try {
        const s = await getTwitterStatus();
        setConnected(s.connected);
      } catch {
        setConnected(false);
      }
    })();
  }, []);

  const loadMockTweets = () => {
    setTweets([
      {
        id: '1',
        author: { name: 'Elon Musk', handle: '@elonmusk' },
        content: 'To the moon! 🚀 #SpaceX',
        timestamp: '2h',
        likes: 154000,
        retweets: 45000,
        replies: 12000
      },
      {
        id: '2',
        author: { name: 'OpenClaw', handle: '@openclaw_ai' },
        content: 'Just released a new skill for Twitter integration! Check it out.',
        timestamp: '5h',
        likes: 42,
        retweets: 12,
        replies: 5
      },
      {
        id: '3',
        author: { name: 'TechNews', handle: '@technews' },
        content: 'Breaking: AI models are getting smarter every day. What does this mean for the future of coding?',
        timestamp: '1d',
        likes: 890,
        retweets: 230,
        replies: 150
      }
    ]);
  };

  const handlePostTweet = async () => {
    if (!newTweet.trim()) return;

    setLoading(true);
    try {
      await runSkillCommand(skillId, 'post_tweet', { text: newTweet });
      
      const tweet: Tweet = {
        id: Date.now().toString(),
        author: { name: 'You', handle: '@user' },
        content: newTweet,
        timestamp: 'Just now',
        likes: 0,
        retweets: 0,
        replies: 0
      };

      setTweets([tweet, ...tweets]);
      setNewTweet('');
    } catch (error) {
      console.error('Failed to post tweet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Mock search
    setTimeout(() => {
      setLoading(false);
      // In reality, this would fetch from API
      console.log('Searching for:', searchQuery);
    }, 1000);
  };

  const handlePostThread = async () => {
    const lines = threadText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    setLoading(true);
    try {
      await runSkillCommand(skillId, 'post_thread', { lines });
      setThreadText('');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTweet = async () => {
    if (!scheduleText.trim() || !scheduleWhen) return;
    setLoading(true);
    try {
      await runSkillCommand(skillId, 'schedule_tweet', { text: scheduleText, when: scheduleWhen });
      setScheduleText('');
      setScheduleWhen('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Twitter className="text-blue-400" />
          X / Twitter
        </h2>
        <div className="flex items-center gap-4 text-sm font-medium">
          {!connected ? (
            <button
              onClick={async () => {
                try {
                  const url = await getTwitterAuthUrl();
                  window.open(url, '_blank');
                } catch {}
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded"
            >
              Connect Twitter
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await disconnectTwitter();
                  setConnected(false);
                } catch {}
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded"
            >
              Disconnect
            </button>
          )}
          <button 
            onClick={() => setActiveTab('home')}
            className={`pb-1 ${activeTab === 'home' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('search')}
            className={`pb-1 ${activeTab === 'search' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Search
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-1 ${activeTab === 'profile' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            className={`pb-1 ${activeTab === 'automation' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Automation
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Compose Tweet Box */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <textarea 
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent border-none focus:outline-none text-slate-200 text-lg resize-none min-h-[80px]"
              />
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-700">
                <div className="flex gap-3 text-blue-400">
                  {/* Icons for media upload would go here */}
                </div>
                <button 
                  onClick={handlePostTweet}
                  disabled={loading || !newTweet.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Posting...' : 'Tweet'}
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {tweets.map((tweet) => (
                <div key={tweet.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-200">{tweet.author.name}</span>
                        <span className="text-slate-500 text-sm">{tweet.author.handle}</span>
                        <span className="text-slate-500 text-sm">· {tweet.timestamp}</span>
                      </div>
                      <p className="text-slate-300 mb-3 whitespace-pre-wrap">{tweet.content}</p>
                      <div className="flex justify-between text-slate-500 text-sm max-w-md">
                        <button className="flex items-center gap-2 hover:text-blue-400 group">
                          <MessageCircle size={16} className="group-hover:bg-blue-400/10 rounded-full p-0.5" />
                          <span>{tweet.replies}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-400 group">
                          <Repeat size={16} className="group-hover:bg-green-400/10 rounded-full p-0.5" />
                          <span>{tweet.retweets}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-pink-400 group">
                          <Heart size={16} className="group-hover:bg-pink-400/10 rounded-full p-0.5" />
                          <span>{tweet.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-400 group">
                          <Share size={16} className="group-hover:bg-blue-400/10 rounded-full p-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
             <div className="w-full max-w-md mb-8">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                   placeholder="Search Twitter"
                   className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-blue-500"
                 />
               </div>
             </div>
             <p>Search for people, topics, or keywords</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="h-32 bg-blue-900"></div>
            <div className="px-4 pb-4">
              <div className="relative flex justify-between items-end -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 p-1">
                  <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center">
                     <User size={40} className="text-slate-400" />
                  </div>
                </div>
                <button className="border border-slate-500 text-slate-200 px-4 py-1.5 rounded-full font-bold hover:bg-slate-700 transition-colors">
                  Edit profile
                </button>
              </div>
              <h2 className="text-xl font-bold text-white">Your Name</h2>
              <p className="text-slate-500 text-sm mb-4">@yourhandle</p>
              <div className="flex gap-4 text-sm text-slate-400">
                <span><strong className="text-white">120</strong> Following</span>
                <span><strong className="text-white">45</strong> Followers</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="grid gap-6">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-white font-bold mb-2">Thread Composer</h3>
              <p className="text-slate-400 text-sm mb-2">Enter one tweet per line. Lines will post sequentially as a thread.</p>
              <textarea
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
                placeholder={"Line 1\nLine 2\nLine 3"}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 min-h-[120px]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePostThread}
                  disabled={loading || !threadText.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Post Thread
                </button>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="text-white font-bold mb-2">Schedule Tweet</h3>
              <div className="space-y-2">
                <input
                  type="datetime-local"
                  value={scheduleWhen}
                  onChange={(e) => setScheduleWhen(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
                />
                <textarea
                  value={scheduleText}
                  onChange={(e) => setScheduleText(e.target.value)}
                  placeholder="Tweet text..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleScheduleTweet}
                  disabled={loading || !scheduleText.trim() || !scheduleWhen}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterInterface;
