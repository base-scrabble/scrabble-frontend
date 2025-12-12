// Farcaster Frames v2 - Demo Frame (frontend-only mock)
function renderBoard(tiles) {
  const rows = 5, cols = 5;
  let html = '<div style="display:grid;grid-template-columns:repeat('+cols+',40px);gap:6px;justify-content:center;">';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = tiles[r*cols+c] || '';
      html += `<div style="width:40px;height:40px;background:#fde68a;border:2px solid #ca8a04;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#111827;">${ch}</div>`;
    }
  }
  html += '</div>';
  return html;
}

function randomTiles() {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const tiles = [];
  for (let i = 0; i < 25; i++) tiles.push(pool[Math.floor(Math.random()*pool.length)]);
  return tiles;
}

export default function renderDemo(req) {
  const shuffled = req?.method === 'POST' ? randomTiles() : Array(25).fill('');
  const board = renderBoard(shuffled);
  const messageFrame = req?.headers?.['content-type'] === 'application/json' && req?.method === 'POST' && req?.url?.includes('play')
    ? `<meta name="of:post:redirect" content="https://www.basescrabble.xyz/frames/demo" />`
    : '';

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Base Scrabble — Demo" />
      <meta property="og:image" content="https://www.basescrabble.xyz/icon.png" />
      <meta name="of:version" content="vNext" />
      <meta name="of:frame" content="vNext" />
      ${messageFrame}
      <meta name="of:button:1" content="Shuffle Tiles" />
      <meta name="of:button:1:action" content="post" />
      <meta name="of:button:1:target" content="https://www.basescrabble.xyz/frames/demo" />
      <meta name="of:button:2" content="Play Move" />
      <meta name="of:button:2:action" content="post" />
      <meta name="of:button:2:post_url" content="https://www.basescrabble.xyz/frames/demo/play" />
      <meta name="of:button:3" content="Back to Home" />
      <meta name="of:button:3:action" content="post" />
      <meta name="of:button:3:target" content="https://www.basescrabble.xyz/frames/welcome" />
      <title>Base Scrabble — Demo</title>
    </head>
    <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#fff;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <div style="text-align:center;max-width:640px;padding:24px;background:#111827;border-radius:16px;border:1px solid #1f2937;">
        <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:800;">Base Scrabble — Demo</h1>
        <p style="margin:0 0 16px 0;font-size:14px;color:#93c5fd;">Try a mini board. Shuffle tiles or play a mock move.</p>
        <div style="margin:16px auto;">${board}</div>
        <p style="margin:16px 0 0 0;font-size:13px;color:#e5e7eb;">Nice move! Full game coming soon.</p>
      </div>
    </body>
  </html>`;
}
