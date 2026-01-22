const TRANSIENT_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const TRANSIENT_ERROR_CODES = new Set([
  "ECONNABORTED",
  "ETIMEDOUT",
  "ECONNRESET",
  "EPIPE",
]);

const DEFAULT_RETRY_OPTIONS = {
  attempts: 3,
  baseDelay: 350,
  backoffFactor: 1.8,
  maxDelay: 2500,
  jitter: 0.25,
};

function retryDebugEnabled() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage?.getItem('scrabble:retryDebug') === '1';
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function computeDelay(base, factor, attempt, maxDelay, jitter) {
  const exponential = Math.min(base * factor ** (attempt - 1), maxDelay);
  const jitterOffset = exponential * jitter * (Math.random() - 0.5) * 2;
  return Math.max(100, exponential + jitterOffset);
}

export function isTransientError(error) {
  if (!error) return true;
  const status = error?.response?.status ?? error?.status;
  if (typeof status === "number" && TRANSIENT_STATUS.has(status)) {
    return true;
  }
  const code = error?.code;
  if (code && TRANSIENT_ERROR_CODES.has(code)) {
    return true;
  }
  if (!status && !code) {
    // Likely a network or CORS failure where the request never reached the server
    return true;
  }
  return false;
}

export async function retryAsync(operation, options = {}) {
  const {
    attempts,
    baseDelay,
    backoffFactor,
    maxDelay,
    jitter,
    onRetry,
    shouldRetry = isTransientError,
    id,
    endpoint,
  } = { ...DEFAULT_RETRY_OPTIONS, ...options };

  let lastError;
  const label = endpoint || id || "retry-operation";
  const verbose = retryDebugEnabled();

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      if (verbose) {
        console.debug(`[retry] ${label} → attempt ${attempt}/${attempts}`);
      }
      const result = await operation(attempt);
      if (verbose && attempt > 1) {
        console.debug(`[retry] ${label} succeeded on attempt ${attempt}`);
      }
      return result;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status ?? error?.status;
      const timeout = Boolean(error?.code && TRANSIENT_ERROR_CODES.has(error.code))
        || /timeout/i.test(error?.message || "");
      const allowRetry = attempt < attempts && shouldRetry(error);
      if (verbose) {
        console.warn(
          `[retry] ${label} failed (attempt ${attempt}/${attempts})`,
          {
            status,
            code: error?.code,
            timeout,
          }
        );
      }
      if (!allowRetry) {
        console.error(`[retry] ${label} retries exhausted`, {
          attempts,
          status,
          timeout,
          message: error?.message,
        });
        throw error;
      }
      const delay = computeDelay(baseDelay, backoffFactor, attempt, maxDelay, jitter);
      onRetry?.({ attempt, delay, error, id: label, status, timeout });
      await sleep(delay);
    }
  }

  throw lastError;
}

export function withApiRetry(factory, options) {
  return retryAsync(factory, options);
}
