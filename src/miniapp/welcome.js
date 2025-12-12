// Farcaster Frames v2 - Welcome Frame
export default function renderWelcome() {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Base Scrabble — Mini App" />
      <meta property="og:image" content="https://www.basescrabble.xyz/icon.png" />
      <meta name="of:version" content="vNext" />
      <meta name="of:accepts:xmtp" content="1" />
      <meta name="of:accepts:warpcast" content="1" />
      <meta name="of:frame" content="vNext" />
      <meta name="of:button:1" content="Join Waitlist" />
      <meta name="of:button:1:action" content="link" />
      <meta name="of:button:1:target" content="https://www.basescrabble.xyz/waitlist" />
      <meta name="of:button:2" content="Play Demo" />
      <meta name="of:button:2:action" content="post" />
      <meta name="of:button:2:target" content="https://www.basescrabble.xyz/frames/demo" />
      <meta name="of:button:3" content="Rules" />
      <meta name="of:button:3:action" content="post" />
      <meta name="of:button:3:target" content="https://www.basescrabble.xyz/frames/rules" />
      <title>Base Scrabble — Mini App</title>
    </head>
    <body style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#fff;font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
      <div style="text-align:center;max-width:600px;padding:24px;background:#111827;border-radius:16px;border:1px solid #1f2937;">
        <h1 style="margin:0 0 12px 0;font-size:24px;font-weight:800;">Base Scrabble — Mini App</h1>
        <p style="margin:0 0 16px 0;font-size:14px;color:#93c5fd;">Welcome! Choose an option below to continue.</p>
        <ol style="text-align:left;color:#e5e7eb;font-size:14px;">
          <li>Join Waitlist → opens website</li>
          <li>Play Demo → interactive mini board</li>
          <li>Rules → quick summary</li>
        </ol>
      </div>
    </body>
  </html>`;
}
