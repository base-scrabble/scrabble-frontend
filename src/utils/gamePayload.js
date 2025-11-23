export function extractGamePayload(raw) {
  if (!raw) return null;

  if (raw.gameState) {
    const rack = Array.isArray(raw.rack)
      ? raw.rack
      : Array.isArray(raw.gameState.rack)
        ? raw.gameState.rack
        : null;

    return {
      ...raw.gameState,
      rack,
    };
  }

  if (raw.data) {
    return extractGamePayload(raw.data);
  }

  return raw;
}

export function resolveGameId(raw, fallback = null) {
  const payload = extractGamePayload(raw);
  return payload?.gameId || payload?.id || fallback || null;
}
