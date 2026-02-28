import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { loadState, saveState, PersistedState } from './state';
import { SERVER_VERSION } from './version';
import type { Browser, Page } from 'puppeteer';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const AUTH_TOKEN = process.env.CLAWHUB_TOKEN; // Optional token; if set, all requests must include it
const TW_CLIENT_ID = process.env.TWITTER_CLIENT_ID || '';
const TW_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || '';
const TW_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/api/twitter/callback';

app.use(cors());
app.use(express.json());

// Simple token auth
app.use('/api', (req, res, next) => {
  if (!AUTH_TOKEN) return next();
  const headerToken = (req.headers['x-claw-token'] as string) || (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  if (headerToken === AUTH_TOKEN) return next();
  res.status(401).json({ message: 'Unauthorized' });
});

interface Skill {
  id: string;
  name: string;
  description: string;
  url: string;
  installed: boolean;
  enabled: boolean;
  type: 'browser' | 'email' | 'cli' | 'api' | 'automation' | 'other';
}

let persisted: PersistedState = loadState();

const initialSkills: Skill[] = [
  {
    id: 'trae-cli',
    name: 'TRAE-CLI',
    description: 'Interface for Trae CLI attached to OpenClaw',
    url: 'internal://trae-cli',
    installed: true,
    enabled: true,
    type: 'cli'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Notion integration for OpenClaw',
    url: 'https://clawhub.ai/steipete/notion',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'nano-banana-pro',
    name: 'Nano Banana Pro',
    description: 'Advanced AI capabilities',
    url: 'https://clawhub.ai/steipete/nano-banana-pro',
    installed: false,
    enabled: false,
    type: 'other'
  },
  {
    id: 'openai-whisper',
    name: 'OpenAI Whisper',
    description: 'Speech to text capabilities',
    url: 'https://clawhub.ai/steipete/openai-whisper',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'brave-search',
    name: 'Brave Search',
    description: 'Web search capabilities',
    url: 'https://clawhub.ai/steipete/brave-search',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'himalaya',
    name: 'Himalaya',
    description: 'Email management CLI wrapper',
    url: 'https://clawhub.ai/lamelas/himalaya',
    installed: false,
    enabled: false,
    type: 'email'
  },
  {
    id: 'vocal-chat',
    name: 'Vocal Chat',
    description: 'Voice interaction interface',
    url: 'https://clawhub.ai/rubenfb23/vocal-chat',
    installed: false,
    enabled: false,
    type: 'other'
  },
  {
    id: 'vapi-calls',
    name: 'VAPI Calls',
    description: 'Voice API integration',
    url: 'https://clawhub.ai/vapi-calls',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'youtube-api',
    name: 'YouTube API',
    description: 'YouTube integration',
    url: 'https://clawhub.ai/byungkyu/youtube-api-skill',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'UI generation capabilities',
    url: 'https://clawhub.ai/steipete/frontend-design',
    installed: false,
    enabled: false,
    type: 'other'
  },
  {
    id: 'blogwatcher',
    name: 'Blogwatcher',
    description: 'Monitor blogs for updates',
    url: 'https://clawhub.ai/steipete/blogwatcher',
    installed: false,
    enabled: false,
    type: 'automation'
  },
  {
    id: 'automation-workflows',
    name: 'Automation Workflows',
    description: 'Create and manage workflows',
    url: 'https://clawhub.ai/JK-0001/automation-workflows',
    installed: false,
    enabled: false,
    type: 'automation'
  },
  {
    id: 'whatsapp-business',
    name: 'WhatsApp Business',
    description: 'WhatsApp integration',
    url: 'https://clawhub.ai/byungkyu/whatsapp-business',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'browser-use',
    name: 'Browser Use',
    description: 'Control a web browser',
    url: 'https://clawhub.ai/ShawnPana/browser-use',
    installed: false,
    enabled: false,
    type: 'browser'
  },
  {
    id: 'desktop-control',
    name: 'Desktop Control',
    description: 'Control desktop environment',
    url: 'https://clawhub.ai/matagul/desktop-control',
    installed: false,
    enabled: false,
    type: 'other'
  },
  {
    id: 'calendly-api',
    name: 'Calendly API',
    description: 'Schedule management',
    url: 'https://clawhub.ai/byungkyu/calendly-api',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'spotify-player',
    name: 'Spotify Player',
    description: 'Music playback control',
    url: 'https://clawhub.ai/steipete/spotify-player',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'youtube-transcript',
    name: 'YouTube Transcript',
    description: 'Get video transcripts',
    url: 'https://clawhub.ai/xthezealot/youtube-transcript',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'openai-image-gen',
    name: 'OpenAI Image Gen',
    description: 'Generate images with DALL-E',
    url: 'https://clawhub.ai/steipete/openai-image-gen',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'x-twitter',
    name: 'X / Twitter',
    description: 'Social media integration',
    url: 'https://clawhub.ai/annettemekuro30/x-twitter',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Calendar management',
    url: 'https://clawhub.ai/AdrianMiller99/google-calendar',
    installed: false,
    enabled: false,
    type: 'api'
  },
  {
    id: 'buddyclaw',
    name: 'BuddyClaw',
    description: 'AI Companion',
    url: 'https://github.com/veracitylife/BuddyClaw',
    installed: false,
    enabled: false,
    type: 'other'
  }
];

// Merge persisted flags into initial skills
let skills = initialSkills.map(s => {
  const ps = persisted.skills[s.id];
  return ps ? { ...s, installed: ps.installed, enabled: ps.enabled } : s;
});

// Puppeteer manager (lazy)
let browser: Browser | null = null;
let page: Page | null = null;
async function getPuppeteer() {
  const puppeteer = await import('puppeteer');
  return puppeteer.default || (puppeteer as any);
}
async function getPage() {
  if (!browser) {
    const puppeteer = await getPuppeteer();
    const headless = persisted.puppeteer?.headless !== false;
    const proxy = persisted.puppeteer?.proxy || '';
    const args = proxy ? [`--proxy-server=${proxy}`] : [];
    browser = await puppeteer.launch({ headless, args });
  }
  if (!page) {
    const pages = await browser!.pages();
    page = pages[0] || await browser!.newPage();
  }
  return page!;
}

// Get all skills
app.get('/api/skills', (req, res) => {
  res.json(skills);
});

// Get single skill
app.get('/api/skills/:id', (req, res) => {
  const skill = skills.find(s => s.id === req.params.id);
  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
});

// Toggle install status (mock)
app.post('/api/skills/:id/install', (req, res) => {
  const skill = skills.find(s => s.id === req.params.id);
  if (skill) {
    skill.installed = true;
    persisted.skills[skill.id] = { installed: true, enabled: !!skill.enabled };
    saveState(persisted);
    res.json(skill);
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
});

// Toggle uninstall status (mock)
app.post('/api/skills/:id/uninstall', (req, res) => {
  const skill = skills.find(s => s.id === req.params.id);
  if (skill) {
    skill.installed = false;
    skill.enabled = false;
    persisted.skills[skill.id] = { installed: false, enabled: false };
    saveState(persisted);
    res.json(skill);
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
});

// Toggle enable status (mock)
app.post('/api/skills/:id/toggle', (req, res) => {
  const skill = skills.find(s => s.id === req.params.id);
  if (skill) {
    skill.enabled = !skill.enabled;
    persisted.skills[skill.id] = { installed: !!skill.installed, enabled: !!skill.enabled };
    saveState(persisted);
    res.json(skill);
  } else {
    res.status(404).json({ message: 'Skill not found' });
  }
});

// Command registry with stubs (Puppeteer-ready)
type Handler = (args: any) => Promise<{ success: boolean; output: string }>;
const registry: Record<string, Record<string, Handler>> = {
  'brave-search': {
    async scrape(args) {
      const { url, type, selector } = args || {};
      if (!url || !type) return { success: false, output: 'Missing required args: url, type' };
      const p = await getPage();
      await p.goto(url, { waitUntil: 'domcontentloaded' });
      if (type === 'text') {
        const content = await p.evaluate(() => document.body.innerText.slice(0, 20000));
        return { success: true, output: JSON.stringify({ content }) };
      }
      if (type === 'links') {
        const links = await p.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => (a as HTMLAnchorElement).href).slice(0, 500));
        return { success: true, output: JSON.stringify({ links }) };
      }
      if (type === 'images') {
        const images = await p.evaluate(() => Array.from(document.querySelectorAll('img[src]')).map(i => (i as HTMLImageElement).src).slice(0, 500));
        return { success: true, output: JSON.stringify({ images }) };
      }
      if (type === 'selector') {
        if (!selector) return { success: false, output: 'Missing selector' };
        const payload = await p.evaluate((sel) => {
          const el = document.querySelector(sel as string);
          return el ? { text: (el as HTMLElement).innerText, html: (el as HTMLElement).outerHTML } : null;
        }, selector);
        if (!payload) return { success: false, output: 'Selector not found' };
        return { success: true, output: JSON.stringify({ selector, ...payload }) };
      }
      return { success: false, output: 'Unknown scrape type' };
    },
    async login(args) {
      const { url, username, password, usernameSelector, passwordSelector, submitSelector } = args || {};
      if (!url || !username || !password) return { success: false, output: 'Missing url, username or password' };
      const p = await getPage();
      await p.goto(url, { waitUntil: 'domcontentloaded' });
      const uSel = usernameSelector || 'input[name="username"], input[type="email"], input[type="text"]';
      const pSel = passwordSelector || 'input[type="password"], input[name="password"]';
      const sSel = submitSelector || 'button[type="submit"], button[name="login"], input[type="submit"]';
      await p.waitForSelector(uSel, { timeout: 10000 }).catch(() => {});
      await p.type(uSel, username, { delay: 20 }).catch(() => {});
      await p.waitForSelector(pSel, { timeout: 10000 }).catch(() => {});
      await p.type(pSel, password, { delay: 20 }).catch(() => {});
      await p.click(sSel).catch(() => {});
      await p.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      return { success: true, output: 'Login attempted' };
    }
  },
  'browser-use': {
    async navigate(args) {
      const { url } = args || {};
      if (!url) return { success: false, output: 'Missing url' };
      const p = await getPage();
      await p.goto(url, { waitUntil: 'domcontentloaded' });
      return { success: true, output: `Navigated to ${url}` };
    },
    async run_task(args) {
      const { instructions } = args || {};
      // Placeholder for higher-level automation; for now, just acknowledge
      return { success: true, output: `Task started: ${instructions || 'no instructions'}` };
    },
    async stop() {
      if (browser) {
        await browser.close().catch(() => {});
      }
      browser = null;
      page = null;
      return { success: true, output: 'Stopped' };
    },
    async get_screenshot() {
      const p = await getPage();
      const b64 = await p.screenshot({ encoding: 'base64' });
      return { success: true, output: `data:image/png;base64,${b64}` };
    }
  },
  'trae-cli': {
    async execute(args) {
      const { command } = args || {};
      return { success: true, output: `Executed: ${command || ''} (stub)` };
    }
  },
  'buddyclaw': {
    async chat(args) {
      const { message } = args || {};
      return { success: true, output: `Assistant (stub): Received "${message}"` };
    }
  },
  'vapi-calls': {
    async start_call(args) {
      const { phoneNumber, voiceId } = args || {};
      return { success: true, output: `Calling ${phoneNumber} with voice ${voiceId || 'default'}...` };
    },
    async end_call(args) {
      const { phoneNumber } = args || {};
      return { success: true, output: `Ended call with ${phoneNumber}` };
    }
  },
  'x-twitter': {
    async post_tweet(args) {
      const { text } = args || {};
      if (!text) return { success: false, output: 'Missing text' };
      if (!persisted.twitter?.accessToken) return { success: false, output: 'Not connected to Twitter' };
      const client = new TwitterApi(persisted.twitter.accessToken);
      const res = await client.v2.tweet(text);
      return { success: true, output: JSON.stringify(res) };
    },
    async post_thread(args) {
      const { lines } = args || {};
      if (!Array.isArray(lines) || lines.length === 0) return { success: false, output: 'Missing lines' };
      if (!persisted.twitter?.accessToken) return { success: false, output: 'Not connected to Twitter' };
      const client = new TwitterApi(persisted.twitter.accessToken);
      let replyTo: string | undefined;
      for (const line of lines) {
        const res = await client.v2.tweet(line, replyTo ? { reply: { in_reply_to_tweet_id: replyTo } } : {});
        replyTo = res.data?.id;
      }
      return { success: true, output: `Thread posted (${lines.length})` };
    },
    async schedule_tweet(args) {
      const { text, when } = args || {};
      if (!text || !when) return { success: false, output: 'Missing text or when' };
      // Demo: immediate post with mention of schedule time
      if (!persisted.twitter?.accessToken) return { success: false, output: 'Not connected to Twitter' };
      const client = new TwitterApi(persisted.twitter.accessToken);
      const res = await client.v2.tweet(`[Scheduled ${when}] ${text}`);
      return { success: true, output: JSON.stringify(res) };
    }
  }
};

// Saved queries endpoints (persistence)
app.get('/api/brave/saved-queries', (req, res) => {
  res.json(persisted.braveSavedQueries || []);
});
app.post('/api/brave/saved-queries', (req, res) => {
  const { query } = req.body || {};
  if (!query || typeof query !== 'string') return res.status(400).json({ message: 'Invalid query' });
  if (!persisted.braveSavedQueries.includes(query)) {
    persisted.braveSavedQueries.push(query);
    saveState(persisted);
  }
  res.json({ success: true });
});
app.delete('/api/brave/saved-queries', (req, res) => {
  const { query } = req.body || {};
  if (!query || typeof query !== 'string') return res.status(400).json({ message: 'Invalid query' });
  persisted.braveSavedQueries = (persisted.braveSavedQueries || []).filter(q => q !== query);
  saveState(persisted);
  res.json({ success: true });
});

app.get('/api/settings/puppeteer', (req, res) => {
  res.json(persisted.puppeteer || { headless: true, proxy: '' });
});
app.post('/api/settings/puppeteer', (req, res) => {
  const { headless, proxy } = req.body || {};
  persisted.puppeteer = { headless: !!headless, proxy: proxy || '' };
  saveState(persisted);
  res.json({ success: true });
});

// Twitter OAuth2 (PKCE helper)
app.get('/api/twitter/status', (req, res) => {
  res.json({ connected: !!persisted.twitter?.accessToken });
});
app.get('/api/twitter/auth-url', async (req, res) => {
  if (!TW_CLIENT_ID || !TW_CLIENT_SECRET) {
    return res.status(500).json({ message: 'Twitter client not configured' });
  }
  const client = new TwitterApi({ clientId: TW_CLIENT_ID, clientSecret: TW_CLIENT_SECRET });
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(TW_CALLBACK_URL, { 
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] 
  });
  
  // Store verifier/state ephemeral in memory
  (app as any).__tw_verifier = codeVerifier;
  (app as any).__tw_state = state;
  
  res.json({ url });
});
app.get('/api/twitter/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const state = String(req.query.state || '');
    const codeVerifier = (app as any).__tw_verifier;
    const savedState = (app as any).__tw_state;
    
    if (!codeVerifier || !state || !savedState || state !== savedState) {
      return res.status(400).send('Invalid OAuth session or state mismatch');
    }
    
    const client = new TwitterApi({ clientId: TW_CLIENT_ID, clientSecret: TW_CLIENT_SECRET });
    const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({ 
      code, 
      codeVerifier, 
      redirectUri: TW_CALLBACK_URL 
    });
    
    persisted.twitter = { accessToken, refreshToken, expiresAt: Date.now() + (expiresIn || 0) * 1000 };
    saveState(persisted);
    
    const me = await loggedClient.v2.me();
    res.send(`Connected as @${me.data.username}. You can close this window.`);
  } catch (e: any) {
    res.status(500).send(`Twitter OAuth failed: ${e.message || e}`);
  }
});
app.post('/api/twitter/disconnect', (req, res) => {
  persisted.twitter = {};
  saveState(persisted);
  res.json({ success: true });
});

// Run command (registry-backed)
app.post('/api/skills/:id/run', (req, res) => {
  const { command, args } = req.body;
  const skillId = req.params.id;
  const skillHandlers = registry[skillId];
  if (skillHandlers && typeof skillHandlers[command] === 'function') {
    skillHandlers[command](args)
      .then(result => res.json(result))
      .catch(err => res.status(500).json({ success: false, output: String(err) }));
  } else {
    res.json({ success: true, output: `Mock execution of ${command} for skill ${skillId} with args: ${JSON.stringify(args)}` });
  }
});

app.listen(port, () => {
  console.log(`Server v${SERVER_VERSION} running at http://localhost:${port}`);
});

// Keep process alive just in case
setInterval(() => {}, 10000);
