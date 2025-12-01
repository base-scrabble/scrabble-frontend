import axios from 'axios';
import { log } from '../utils/logger.js';

const testMoves = [
  { row: 7, col: 7, direction: 'H', word: 'TEST' },
  { row: 7, col: 8, direction: 'V', word: 'OX' },
  { row: 8, col: 6, direction: 'H', word: 'RAIN' },
  { row: 6, col: 5, direction: 'V', word: 'SUN' },
  { row: 9, col: 9, direction: 'H', word: 'PLAY' },
  { row: 5, col: 9, direction: 'V', word: 'AXE' },
];

let moveCursor = 0;

function nextMovePayload() {
  const move = testMoves[moveCursor % testMoves.length];
  moveCursor += 1;
  return move;
}

export async function playRandomMove(backendUrl, gameId, name) {
  log(`${name}: Attempting random move…`);
  const move = nextMovePayload();

  try {
    const res = await axios.post(
      `${backendUrl}/api/gameplay/${gameId}/move`,
      {
        playerName: name,
        ...move,
      }
    );
    log(`${name}: Move OK`, JSON.stringify(res.data));
  } catch (err) {
    log(`${name}: Move FAILED`, err.code || err.message);
  }
}

export async function passTurn(backendUrl, gameId, name) {
  log(`${name}: Passing turn`);
  try {
    await axios.post(`${backendUrl}/api/gameplay/${gameId}/skip`, {
      playerName: name,
    });
    log(`${name}: Pass OK`);
  } catch (err) {
    log(`${name}: Pass FAILED`, err.response?.data?.message || err.message);
  }
}
