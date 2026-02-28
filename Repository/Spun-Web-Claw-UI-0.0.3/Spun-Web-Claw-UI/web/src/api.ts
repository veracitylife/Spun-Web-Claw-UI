import { Skill } from './types';

const DEFAULT_API_BASE = 'http://localhost:3001/api';

export const getApiBase = () => {
  return localStorage.getItem('clawhub_api_url') || DEFAULT_API_BASE;
};

export const setApiBase = (url: string) => {
  localStorage.setItem('clawhub_api_url', url);
};

const getUrl = (endpoint: string) => {
  let base = getApiBase().trim().replace(/\/$/, ''); // Remove trailing slash
  // Ensure base includes '/api' path segment expected by the server
  if (!/\/api(\b|\/|$)/.test(new URL(base, 'http://dummy.base').pathname)) {
    base = `${base}/api`;
  }
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export const getSkills = async (): Promise<Skill[]> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/skills'), { headers });
  if (!response.ok) throw new Error('Failed to fetch skills');
  return response.json();
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await getSkills();
    return true;
  } catch {
    return false;
  }
};

export const getSkill = async (id: string): Promise<Skill> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl(`/skills/${id}`), { headers });
  if (!response.ok) throw new Error('Failed to fetch skill');
  return response.json();
};

export const toggleSkillInstall = async (id: string): Promise<Skill> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl(`/skills/${id}/install`), { method: 'POST', headers });
  if (!response.ok) throw new Error('Failed to install skill');
  return response.json();
};

export const toggleSkillUninstall = async (id: string): Promise<Skill> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl(`/skills/${id}/uninstall`), { method: 'POST', headers });
  if (!response.ok) throw new Error('Failed to uninstall skill');
  return response.json();
};

export const toggleSkillEnable = async (id: string): Promise<Skill> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl(`/skills/${id}/toggle`), { method: 'POST', headers });
  if (!response.ok) throw new Error('Failed to toggle skill');
  return response.json();
};

export const runSkillCommand = async (id: string, command: string, args: any = {}): Promise<{success: boolean, output: string}> => {
  const response = await fetch(getUrl(`/skills/${id}/run`), {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(localStorage.getItem('clawhub_api_token') ? { 'x-claw-token': localStorage.getItem('clawhub_api_token') as string } : {})
    },
    body: JSON.stringify({ command, args })
  });
  if (!response.ok) throw new Error('Failed to run command');
  return response.json();
};

// Brave Search saved queries
export const getBraveSavedQueries = async (): Promise<string[]> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/brave/saved-queries'), { headers });
  if (!response.ok) throw new Error('Failed to load saved queries');
  return response.json();
};

export const addBraveSavedQuery = async (query: string): Promise<void> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/brave/saved-queries'), { method: 'POST', headers, body: JSON.stringify({ query }) });
  if (!response.ok) throw new Error('Failed to save query');
};

export const deleteBraveSavedQuery = async (query: string): Promise<void> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/brave/saved-queries'), { method: 'DELETE', headers, body: JSON.stringify({ query }) });
  if (!response.ok) throw new Error('Failed to delete query');
};

// Twitter OAuth helpers
export const getTwitterStatus = async (): Promise<{connected: boolean}> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/twitter/status'), { headers });
  if (!response.ok) throw new Error('Failed to load twitter status');
  return response.json();
};

export const getTwitterAuthUrl = async (): Promise<string> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/twitter/auth-url'), { headers });
  if (!response.ok) throw new Error('Failed to get twitter auth url');
  const data = await response.json();
  return data.url as string;
};

export const disconnectTwitter = async (): Promise<void> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/twitter/disconnect'), { method: 'POST', headers });
  if (!response.ok) throw new Error('Failed to disconnect twitter');
};

// Puppeteer settings
export const getPuppeteerSettings = async (): Promise<{ headless: boolean; proxy: string }> => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/settings/puppeteer'), { headers });
  if (!response.ok) throw new Error('Failed to load puppeteer settings');
  return response.json();
};

export const savePuppeteerSettings = async (opts: { headless: boolean; proxy: string }): Promise<void> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('clawhub_api_token');
  if (token) headers['x-claw-token'] = token;
  const response = await fetch(getUrl('/settings/puppeteer'), { method: 'POST', headers, body: JSON.stringify(opts) });
  if (!response.ok) throw new Error('Failed to save puppeteer settings');
};
