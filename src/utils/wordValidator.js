// very simple validator placeholder. replace with real dict/back-end validation.
const SAMPLE_DICTIONARY = new Set(["HELLO", "WORLD", "BASED", "SCRABBLE"]);

export function isValidWord(word) {
  const clean = (word || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (!clean) return false;
  return SAMPLE_DICTIONARY.has(clean);
}
