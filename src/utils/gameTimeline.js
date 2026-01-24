const STORAGE_KEY = 'scrabble:timeline';

function isEnabled() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage?.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const timeline = {
  events: [],
  maxEvents: 500,
};

export function timelineEnabled() {
  return isEnabled();
}

export function timelineRecord(type, details = {}) {
  if (!isEnabled()) return;
  const ts = Date.now();
  timeline.events.push({ ts, type, details });
  if (timeline.events.length > timeline.maxEvents) {
    timeline.events.splice(0, timeline.events.length - timeline.maxEvents);
  }
}

export function timelineClear() {
  timeline.events = [];
}

export function timelineDump({ includeDetails = true } = {}) {
  const rows = (timeline.events || []).map((e) => {
    const time = new Date(e.ts).toISOString();
    const detail = includeDetails ? ` ${safeJson(e.details)}` : '';
    return `${time}  ${e.type}${detail}`;
  });
  return rows;
}

export function timelineInstallToWindow() {
  if (typeof window === 'undefined') return;
  window.scrabbleTimeline = {
    enable() {
      try {
        window.localStorage?.setItem(STORAGE_KEY, '1');
      } catch {
        // ignore
      }
    },
    disable() {
      try {
        window.localStorage?.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
    dump: timelineDump,
    clear: timelineClear,
    record: timelineRecord,
    enabled: timelineEnabled,
  };
}
