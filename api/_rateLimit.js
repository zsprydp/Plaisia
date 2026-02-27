const ipRequests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

export function checkRateLimit(req, res) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown';

  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now - record.start > WINDOW_MS) {
    ipRequests.set(ip, { start: now, count: 1 });
    return false;
  }

  record.count++;

  if (record.count > MAX_REQUESTS) {
    res.status(429).json({
      error: 'Too many requests. Please wait a moment before trying again.',
    });
    return true;
  }

  return false;
}

// Periodically clean up stale entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequests) {
    if (now - record.start > WINDOW_MS * 2) {
      ipRequests.delete(ip);
    }
  }
}, WINDOW_MS * 2);
