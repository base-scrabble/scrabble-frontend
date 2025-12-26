import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const MINIAPP_READY_FLAG = '__baseScrabbleMiniAppReady__'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function signalMiniAppReadyOnce() {
  try {
    const mod = await import('@farcaster/miniapp-sdk')
    const sdk = mod?.sdk ?? mod?.default ?? mod
    const ready = sdk?.actions?.ready ?? sdk?.ready
    if (typeof ready !== 'function') {
      // SDK present but no ready() API; don't spin forever.
      return 'stop'
    }

    await ready()
    return 'signaled'
  } catch {
    // Transient timing/handshake issues can happen in embeds.
    return 'retry'
  }
}

async function signalMiniAppReadyWithRetries() {
  if (typeof window === 'undefined') return
  if (window[MINIAPP_READY_FLAG]) return

  const maxAttempts = 10

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await signalMiniAppReadyOnce()

    if (result === 'signaled') {
      window[MINIAPP_READY_FLAG] = true
      return
    }

    if (result === 'stop') {
      return
    }

    // Backoff: 150ms, 300ms, ... (caps at 1500ms)
    const delayMs = Math.min(150 * attempt, 1500)
    await sleep(delayMs)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

if (typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    void signalMiniAppReadyWithRetries()
  })
}