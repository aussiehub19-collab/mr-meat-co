/**
 * Short order reference — generated identically on the client (WhatsApp
 * checkout, before any server round-trip) and the server (email-form
 * checkout, and as a fallback), so every channel gets a real, consistent
 * number immediately with no dependency on Redis being reachable.
 *
 * "MM-" + 4 base36 timestamp chars + 2 random base36 chars — 9 characters
 * total, effectively collision-free at small-business order volumes, and
 * has zero imports so it's safe to bundle into either a client or server
 * module.
 */
export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `MM-${stamp}${rand}`;
}
