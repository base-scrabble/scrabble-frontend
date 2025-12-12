// Vercel Serverless API for Farcaster Frames v2
import renderWelcome from '../../src/miniapp/welcome.js';
import renderDemo from '../../src/miniapp/demo.js';
import renderRules from '../../src/miniapp/rules.js';

export default function handler(req, res) {
  try {
    const path = req.query?.path || req.url || '';
    const url = new URL(`http://local${path}`);
    const route = url.pathname.replace(/^\/frames\//, '');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');

    if (route === 'welcome' || url.pathname === '/frames/welcome') {
      return res.status(200).send(renderWelcome());
    }
    if (route === 'demo' || url.pathname.startsWith('/frames/demo')) {
      return res.status(200).send(renderDemo(req));
    }
    if (route === 'rules' || url.pathname === '/frames/rules') {
      return res.status(200).send(renderRules());
    }
    return res.status(404).send(`<html><body><pre>Not Found</pre></body></html>`);
  } catch (err) {
    return res.status(500).send(`<html><body><pre>${err?.message || 'Server Error'}</pre></body></html>`);
  }
}
