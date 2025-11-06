import { API_BASE_URL } from "../config";

export async function isValidWord(word) {
  try {
    if (!word) return false;
    const res = await fetch(`${API_BASE_URL}/words/validate/${encodeURIComponent(word)}`);
    if (!res.ok) throw new Error("Failed to validate word");
    const data = await res.json();
    return data.isValid;
  } catch (err) {
    console.error('Word validation error:', err);
    return false;
  }
}