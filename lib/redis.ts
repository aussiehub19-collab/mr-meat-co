/**
 * Minimal Upstash Redis REST client — no SDK dependency, just fetch.
 * Checks four common credential-variable name pairs so whatever Vercel's
 * Storage tab happened to name them (Upstash native vs Vercel KV vs the
 * newer "Storage" naming) just works without renaming anything.
 */

const CREDENTIAL_CANDIDATES: [string, string][] = [
  ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
  ["STORAGE_REST_API_URL", "STORAGE_REST_API_TOKEN"],
  ["STORAGE_KV_REST_API_URL", "STORAGE_KV_REST_API_TOKEN"],
];

function credentials(): { url: string; token: string } | null {
  for (const [urlKey, tokenKey] of CREDENTIAL_CANDIDATES) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url, token };
  }
  return null;
}

export function isRedisConfigured(): boolean {
  return credentials() !== null;
}

async function command<T = unknown>(parts: (string | number)[]): Promise<T> {
  const creds = credentials();
  if (!creds) throw new Error("Redis not configured — no matching env var pair found.");
  const res = await fetch(`${creds.url}/${parts.map((p) => encodeURIComponent(String(p))).join("/")}`, {
    headers: { Authorization: `Bearer ${creds.token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Redis command failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { result: T };
  return data.result;
}

export const redis = {
  /** Set a plain string/JSON value. */
  async set(key: string, value: unknown): Promise<void> {
    await command(["set", key, JSON.stringify(value)]);
  },
  /** Get and JSON-parse a value; null if missing. */
  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await command<string | null>(["get", key]);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  async del(key: string): Promise<void> {
    await command(["del", key]);
  },
  /** Add a member (with score) to a sorted set — used as an index of ids ordered by time. */
  async zadd(key: string, score: number, member: string): Promise<void> {
    await command(["zadd", key, score, member]);
  },
  async zrem(key: string, member: string): Promise<void> {
    await command(["zrem", key, member]);
  },
  /** All members, newest first. */
  async zrangeAllDesc(key: string): Promise<string[]> {
    const result = await command<string[]>(["zrange", key, 0, -1, "REV"]);
    return result ?? [];
  },
};
