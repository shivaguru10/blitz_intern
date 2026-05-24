type Attempt = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, Attempt>();

export function checkRateLimit(key: string, limit = 8, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  attempts.set(key, current);
  return true;
}
