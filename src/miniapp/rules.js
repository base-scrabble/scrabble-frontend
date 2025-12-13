// Farcaster Frames v2 - Rules Frame
export default function renderRules() {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Base Scrabble — Rules" />
      <meta property="og:image" content="https://www.basescrabble.xyz/icon.png" />
      <meta name="fc:frame:image" content="https://www.basescrabble.xyz/frame-1200x630.png" />
      <meta name="fc:frame:version" content="2024-02-01" />
      <meta name="fc:frame:button:1" content="Back to Home" />
      <meta name="fc:frame:button:1:action" content="post" />
      <meta name="fc:frame:button:1:target" content="https://www.basescrabble.xyz/frames/welcome" />
      <title>Base Scrabble — Rules</title>
    </head>
    <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#fff;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <div style="text-align:left;max-width:720px;padding:24px;background:#111827;border-radius:16px;border:1px solid #1f2937;">
        <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:800;">Base Scrabble — Summary Rules</h1>
        <ul style="color:#e5e7eb;font-size:14px;line-height:1.6;">
          <li>Place tiles to form valid words horizontally or vertically.</li>
          <li>Each letter has a point value; special squares may boost score.</li>
          <li>Words must appear in the Base Scrabble dictionary.</li>
          <li>Highest total score wins. Ties are possible.</li>
          <li>Competitive matches and tournaments run on schedules.</li>
        </ul>
        <p style="color:#93c5fd;font-size:13px;">This is a preview. Full on-chain game coming soon.</p>
        <p style="margin:16px 0 0 0;font-size:13px;color:#93c5fd;">
          <a href="https://www.basescrabble.xyz/frames/welcome" style="color:#93c5fd;text-decoration:underline;">Back to Home</a>
        </p>
      </div>
    </body>
  </html>`;
}
