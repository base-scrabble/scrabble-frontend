let storageAvailableCache = null;

const hasSessionStorage = () => {
  if (storageAvailableCache !== null) return storageAvailableCache;
  if (typeof window === "undefined") {
    storageAvailableCache = false;
    return false;
  }
  try {
    const storage = window.sessionStorage;
    storageAvailableCache = typeof storage !== "undefined";
    return storageAvailableCache;
  } catch (error) {
    console.warn("[sessionStorage] access blocked", error);
    storageAvailableCache = false;
    return false;
  }
};

const normalizeValue = (value) => {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value : String(value);
};

export const getSessionItem = (key, fallback = null) => {
  if (!hasSessionStorage()) return fallback;
  try {
    const value = window.sessionStorage.getItem(key);
    return value ?? fallback;
  } catch (error) {
    console.warn(`[sessionStorage] get failed for key "${key}"`, error);
    return fallback;
  }
};

export const setSessionItem = (key, value) => {
  if (!hasSessionStorage()) return;
  try {
    window.sessionStorage.setItem(key, normalizeValue(value));
  } catch (error) {
    console.warn(`[sessionStorage] set failed for key "${key}"`, error);
  }
};

export const removeSessionItem = (key) => {
  if (!hasSessionStorage()) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`[sessionStorage] remove failed for key "${key}"`, error);
  }
};

export const getSessionJSON = (key, fallback = null) => {
  const raw = getSessionItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[sessionStorage] parse failed for key "${key}"`, error);
    return fallback;
  }
};

export const setSessionJSON = (key, value) => {
  try {
    setSessionItem(key, JSON.stringify(value ?? null));
  } catch (error) {
    console.warn(`[sessionStorage] JSON stringify failed for key "${key}"`, error);
  }
};
