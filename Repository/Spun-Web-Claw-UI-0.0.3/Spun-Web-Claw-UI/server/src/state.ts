import fs from 'fs';
import path from 'path';

type SkillStateMap = Record<string, { installed: boolean; enabled: boolean }>;

export interface PersistedState {
  skills: SkillStateMap;
  braveSavedQueries: string[];
  twitter?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
  puppeteer?: {
    headless?: boolean;
    proxy?: string;
  };
}

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

const DEFAULT_STATE: PersistedState = {
  skills: {},
  braveSavedQueries: [],
  twitter: {},
  puppeteer: { headless: true, proxy: '' }
};

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadState(): PersistedState {
  try {
    ensureDataDir();
    if (!fs.existsSync(STATE_FILE)) {
      fs.writeFileSync(STATE_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
      return { ...DEFAULT_STATE };
    }
    const raw = fs.readFileSync(STATE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as PersistedState;
    return { ...DEFAULT_STATE, ...parsed, skills: { ...(parsed.skills || {}) } };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: PersistedState) {
  ensureDataDir();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}
