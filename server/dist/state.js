"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDataDir = ensureDataDir;
exports.loadState = loadState;
exports.saveState = saveState;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '..', 'data');
const STATE_FILE = path_1.default.join(DATA_DIR, 'state.json');
const DEFAULT_STATE = {
    skills: {},
    braveSavedQueries: [],
    twitter: {},
    puppeteer: { headless: true, proxy: '' }
};
function ensureDataDir() {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
}
function loadState() {
    try {
        ensureDataDir();
        if (!fs_1.default.existsSync(STATE_FILE)) {
            fs_1.default.writeFileSync(STATE_FILE, JSON.stringify(DEFAULT_STATE, null, 2), 'utf-8');
            return { ...DEFAULT_STATE };
        }
        const raw = fs_1.default.readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...parsed, skills: { ...(parsed.skills || {}) } };
    }
    catch {
        return { ...DEFAULT_STATE };
    }
}
function saveState(state) {
    ensureDataDir();
    fs_1.default.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}
