import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'public');

async function ensureExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function resizeIcon() {
  const src = path.join(root, 'icon.png');
  const out = path.join(root, 'icon-256.png');
  if (!(await ensureExists(src))) {
    console.error(`Missing source icon: ${src}`);
    return;
  }
  await sharp(src)
    .resize(256, 256, { fit: 'cover' })
    .png({ quality: 90 })
    .toFile(out);
  console.log(`Wrote ${out}`);
}

async function resizeFrame() {
  const candidates = ['scrabble-board.png', 'banner.png', 'icon.png'];
  let srcFile = null;
  for (const f of candidates) {
    const p = path.join(root, f);
    if (await ensureExists(p)) { srcFile = p; break; }
  }
  if (!srcFile) {
    console.error('No suitable source image found in public/. Tried: scrabble-board.png, banner.png, icon.png');
    return;
  }
  const out = path.join(root, 'frame-1200x630.png');
  await sharp(srcFile)
    .resize(1200, 630, { fit: 'cover' })
    .png({ quality: 90 })
    .toFile(out);
  console.log(`Wrote ${out}`);
}

async function main() {
  await resizeIcon();
  await resizeFrame();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
