import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function saveState(label, data) {
  const outPath = path.join(__dirname, `state-${label}.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  log(`Saved state snapshot: ${label}`);
}
