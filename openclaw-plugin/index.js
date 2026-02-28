const path = require('path');
const serveStatic = require('serve-static');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function register(app, opts = {}) {
  const route = opts.route || '/claw-skill-ui';
  console.log(`[ClawSkillUI] Registering plugin at ${route}`);
  console.log(`[ClawSkillUI] Access the UI at: ${route}`);
  const distPath = path.join(__dirname, '..', 'web', 'dist');
  const devTarget = process.env.CLAW_SKILL_UI_DEV || 'http://localhost:5173';
  if (process.env.CLAW_SKILL_UI_USE_DEV === '1') {
    app.use(route, createProxyMiddleware({ target: devTarget, changeOrigin: true }));
  } else {
    app.use(route, serveStatic(distPath));
    // SPA Fallback: serve index.html for any other GET request under this route
    app.use(route, (req, res, next) => {
      if (req.method === 'GET' && !req.path.includes('.')) {
        res.sendFile(path.join(distPath, 'index.html'));
      } else {
        next();
      }
    });
  }
};

