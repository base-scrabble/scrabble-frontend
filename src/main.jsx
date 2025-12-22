import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

async function signalFarcasterReady() {
  try {
    const mod = await import('@farcaster/miniapp-sdk');
    const sdk = mod?.sdk ?? mod?.default ?? mod;
    const ready = sdk?.actions?.ready ?? sdk?.ready;
    if (typeof ready === 'function') {
      await ready();
    }
  } catch {
    // No-op: app should work normally outside Farcaster
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

if (typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    void signalFarcasterReady();
  });
}