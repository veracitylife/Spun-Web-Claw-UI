import { useEffect, useState } from 'react';
import { getSkills, toggleSkillInstall, toggleSkillUninstall, toggleSkillEnable, getApiBase, setApiBase, testConnection, getPuppeteerSettings, savePuppeteerSettings } from '../api';
import { Skill } from '../types';
import Layout from '../components/Layout';
import { Loader2, Download, Trash, Power, PowerOff, Save, Globe } from 'lucide-react';

export default function Settings() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(getApiBase());
  const [screenshotPath, setScreenshotPath] = useState(localStorage.getItem('clawhub_screenshot_path') || 'C:\\Users\\Public\\Pictures');
  const [savingUrl, setSavingUrl] = useState(false);
  const needsApiSuffix = (() => {
    try {
      const u = new URL(apiUrl, 'http://dummy.base');
      return !/\/api(\b|\/|$)/.test(u.pathname || '');
    } catch {
      return false;
    }
  })();
  const [apiToken, setApiToken] = useState(localStorage.getItem('clawhub_api_token') || '');
  const [pupHeadless, setPupHeadless] = useState(true);
  const [pupProxy, setPupProxy] = useState('');
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState<boolean | null>(null);
  const [gatewayUrl, setGatewayUrl] = useState(localStorage.getItem('gateway_url') || 'http://localhost:18789');
  const [betterGatewayUrl, setBetterGatewayUrl] = useState(localStorage.getItem('better_gateway_url') || (gatewayUrl.replace(/\/$/, '') + '/better-gateway/'));

  useEffect(() => {
    fetchSkills();
    (async () => {
      try {
        const s = await getPuppeteerSettings();
        setPupHeadless(s.headless);
        setPupProxy(s.proxy || '');
      } catch {}
    })();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError('Failed to load skills. Check connection settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = () => {
    setSavingUrl(true);
    setApiBase(apiUrl);
    localStorage.setItem('clawhub_screenshot_path', screenshotPath);
    localStorage.setItem('clawhub_api_token', apiToken);
    localStorage.setItem('gateway_url', gatewayUrl);
    localStorage.setItem('better_gateway_url', betterGatewayUrl);
    savePuppeteerSettings({ headless: pupHeadless, proxy: pupProxy }).catch(() => {});
    setTimeout(() => {
      setSavingUrl(false);
      fetchSkills(); // Retry connection
    }, 500);
  };

  const handleInstall = async (id: string, install: boolean) => {
    try {
      if (install) {
        await toggleSkillInstall(id);
      } else {
        await toggleSkillUninstall(id);
      }
      fetchSkills(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnable = async (id: string) => {
    try {
      await toggleSkillEnable(id);
      fetchSkills(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center h-96 items-center"><Loader2 className="animate-spin" /></div></Layout>;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Skill Settings</h1>
        <p className="text-slate-400">Manage installed skills and configurations.</p>
      </div>

      {/* Connection Settings */}
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe size={20} /> Remote Connection
        </h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-1">
              OpenClaw API URL
            </label>
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:3001/api"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button 
            onClick={handleSaveUrl}
            disabled={savingUrl}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {savingUrl ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save & Connect
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Enter the URL of your local or remote OpenClaw server (e.g., http://192.168.1.50:3001/api).
        </p>
        {needsApiSuffix && (
          <div className="mt-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">
            Hint: Your URL doesn’t include “/api”. We will automatically use {apiUrl.replace(/\/$/, '')}/api for requests.
          </div>
        )}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">OpenClaw Gateway URL</label>
            <input 
              type="text"
              value={gatewayUrl}
              onChange={(e) => setGatewayUrl(e.target.value)}
              placeholder="http://localhost:18789"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Used by header links to launch the original gateway.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Better Gateway URL</label>
            <input 
              type="text"
              value={betterGatewayUrl}
              onChange={(e) => setBetterGatewayUrl(e.target.value)}
              placeholder={gatewayUrl.replace(/\/$/, '') + '/better-gateway/'}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">Set to your Better Gateway route after installing the plugin.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Puppeteer Headless</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={pupHeadless} onChange={e => setPupHeadless(e.target.checked)} className="accent-blue-500" />
              <span className="text-slate-300 text-sm">Run without visible window</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Proxy (optional)</label>
            <input 
              type="text"
              value={pupProxy}
              onChange={e => setPupProxy(e.target.value)}
              placeholder="http://user:pass@host:port"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={async () => {
              setTesting(true);
              const ok = await testConnection();
              setTestOk(ok);
              setTesting(false);
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm"
            disabled={testing}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          {testOk !== null && (
            <span className={`ml-3 text-sm ${testOk ? 'text-green-400' : 'text-red-400'}`}>
              {testOk ? 'Connected' : 'Failed'}
            </span>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-1">
            API Access Token
          </label>
          <input 
            type="text" 
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Optional token for secured servers"
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-slate-500 mt-1">
            If your server requires a token, requests will include it in the header.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Screenshot Save Path
          </label>
          <input 
            type="text" 
            value={screenshotPath}
            onChange={(e) => setScreenshotPath(e.target.value)}
            placeholder="C:\Users\Public\Pictures"
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-slate-500 mt-1">
            Directory where Brave Search screenshots will be saved.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={fetchSkills} className="text-xs bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/30">Retry</button>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-xs uppercase text-slate-400">
                <th className="p-4">Skill Name</th>
                <th className="p-4">ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-medium text-white">{skill.name}</td>
                  <td className="p-4 text-slate-400 text-sm font-mono">{skill.id}</td>
                  <td className="p-4">
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs uppercase font-bold">
                      {skill.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${skill.installed ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                      <span className="text-sm text-slate-300">{skill.installed ? 'Installed' : 'Not Installed'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <label className="flex items-center gap-2 text-xs text-slate-300 mr-2">
                        <input 
                          type="checkbox" 
                          checked={!!skill.enabled} 
                          onChange={() => handleEnable(skill.id)} 
                          disabled={!skill.installed}
                          className="accent-blue-500"
                        />
                        Enabled
                      </label>
                      <button 
                        onClick={() => handleInstall(skill.id, !skill.installed)}
                        className={`p-2 rounded transition-colors ${
                          skill.installed 
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        }`}
                        title={skill.installed ? "Uninstall" : "Install"}
                      >
                        {skill.installed ? <Trash size={16} /> : <Download size={16} />}
                      </button>
                      
                      {skill.installed && (
                        <button 
                          onClick={() => handleEnable(skill.id)}
                          className={`p-2 rounded transition-colors ${
                            skill.enabled 
                              ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                          title={skill.enabled ? "Disable" : "Enable"}
                        >
                          {skill.enabled ? <Power size={16} /> : <PowerOff size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {skills.map(skill => (
            <div key={skill.id} className="p-4 border-b border-slate-700 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white">{skill.name}</h3>
                  <div className="text-xs text-slate-400 font-mono">{skill.id}</div>
                </div>
                <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                  {skill.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${skill.installed ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                  <span className="text-xs text-slate-300">{skill.installed ? 'Installed' : 'Not Installed'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={!!skill.enabled} 
                      onChange={() => handleEnable(skill.id)} 
                      disabled={!skill.installed}
                      className="accent-blue-500"
                    />
                    Enabled
                  </label>
                  <button 
                    onClick={() => handleInstall(skill.id, !skill.installed)}
                    className={`p-2 rounded transition-colors ${
                      skill.installed 
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                    }`}
                  >
                    {skill.installed ? <Trash size={16} /> : <Download size={16} />}
                  </button>
                  
                  {skill.installed && (
                    <button 
                      onClick={() => handleEnable(skill.id)}
                      className={`p-2 rounded transition-colors ${
                        skill.enabled 
                          ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {skill.enabled ? <Power size={16} /> : <PowerOff size={16} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
