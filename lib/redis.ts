/**
 * Minimal Upstash Redis REST client — no SDK dependency, just fetch.
 * Checks four common credential-variable name pairs so whatever Vercel's
 * Storage tab happened to name them (Upstash native vs Vercel KV vs the
 * newer "Storage" naming) just works without renaming anything.
 *
 * Uses Upstash's POST-with-JSON-array-body call shape (`POST {url}` with
 * body `["SET", "key", "value"]`) rather than cramming arguments into the
 * URL path — the path-based GET form breaks for long/complex values (a
 * whole order object, say) and is fussier about encoding. POST-with-body
 * is Upstash's own documented default for exactly that reason.
 */

const CREDENTIAL_CANDIDATES: [string, string][] = [
  ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
  ["STORAGE_REST_API_URL", "STORAGE_REST_API_TOKEN"],
  ["STORAGE_KV_REST_API_URL", "STORAGE_KV_REST_API_TOKEN"],
];

/**
 * Normalises a pasted REST URL: adds a missing `https://` scheme (a common
 * copy-paste slip), and refuses `console.upstash.com` outright — that's
 * the dashboard's own hostname, not a database's REST endpoint, and using
 * it produces a confusing low-level "Invalid URL" error deep in a Redis
 * call instead of a clear message pointing at the actual mistake.
 */
function normaliseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (/^https?:\/\/console\.upstash\.com/i.test(withScheme)) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL is set to the Upstash dashboard URL (console.upstash.com), " +
        "not a database's REST endpoint. Open your database in the Upstash console → the " +
        "\"Connect\" / REST section shows the real value, e.g. https://<name>.upstash.io"
    );
  }
  return withScheme;
}

function credentials(): { url: string; token: string } | null {
  for (const [urlKey, tokenKey] of CREDENTIAL_CANDIDATES) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url: normaliseUrl(url), token };
  }
  return null;
}

export function isRedisConfigured(): boolean {
  try {
    return credentials() !== null;
  } catch {
    // A malformed URL still counts as "configured" for UI purposes (env
    // vars are present) — the actual command call below is what surfaces
    // the real error message.
    return true;
  }
}

async function command<T = unknown>(parts: (string | number)[]): Promise<T> {
  const creds = credentials();
  if (!creds) throw new Error("Redis not configured — no matching env var pair found.");
  const res = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parts),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Redis command failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) throw new Error(`Redis error: ${data.error}`);
  return data.result;
}

export const redis = {
  /** Set a plain string/JSON value. */
  async set(key: string, value: unknown): Promise<void> {
    await command(["SET", key, JSON.stringify(value)]);
  },
  /** Get and JSON-parse a value; null if missing. */
  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await command<string | null>(["GET", key]);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  async del(key: string): Promise<void> {
    await command(["DEL", key]);
  },
  /** Add a member (with score) to a sorted set — used as an index of ids ordered by time. */
  async zadd(key: string, score: number, member: string): Promise<void> {
    await command(["ZADD", key, score, member]);
  },
  async zrem(key: string, member: string): Promise<void> {
    await command(["ZREM", key, member]);
  },
  /** All members, newest first. */
  async zrangeAllDesc(key: string): Promise<string[]> {
    const result = await command<string[]>(["ZRANGE", key, 0, -1, "REV"]);
    return result ?? [];
  },
};
