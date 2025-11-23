import { calculateScrabbleScore } from "./scoreCalculator";

const MIN_RACK_SIZE = 7;

function buildTile(letter, isBlank) {
  const normalized = typeof letter === "string" ? letter.trim().toUpperCase() : "";
  if (!normalized) return null;
  const blank = isBlank || normalized === "?";
  const face = blank ? "?" : normalized;
  const value = blank ? 0 : calculateScrabbleScore(face);
  return { letter: face, isBlank: blank, value };
}

export function normalizeTile(input) {
  if (!input) return null;
  if (typeof input === "string") {
    return buildTile(input, input.trim().toUpperCase() === "?");
  }
  if (typeof input === "object" && input.letter) {
    const base = String(input.letter).trim().toUpperCase();
    if (!base) return null;
    const blank = input.isBlank === true || base === "?";
    const value = typeof input.value === "number"
      ? input.value
      : blank ? 0 : calculateScrabbleScore(base);
    return { letter: blank ? "?" : base, isBlank: blank, value };
  }
  return null;
}

export function cloneTile(tile) {
  const normalized = normalizeTile(tile);
  return normalized ? { ...normalized } : null;
}

export function normalizeRack(rack = [], size = MIN_RACK_SIZE) {
  const normalized = Array.isArray(rack) ? rack.map((tile) => normalizeTile(tile)) : [];
  while (normalized.length < size) {
    normalized.push(null);
  }
  return normalized;
}

export function serializeTileLetter(tile) {
  if (!tile) return null;
  if (typeof tile === "string") return tile;
  if (typeof tile === "object") {
    return tile.isBlank ? "?" : tile.letter;
  }
  return null;
}

export function createBlankTile() {
  return { letter: "?", isBlank: true, value: 0 };
}
