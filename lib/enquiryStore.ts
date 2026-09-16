import { redis, isRedisConfigured } from "./redis";

export type EnquiryType = "contact" | "wholesale" | "bulk";

export interface StoredEnquiry {
  id: string;
  type: EnquiryType;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  /** Everything else the form submitted, kept for reference in the reply composer. */
  meta: Record<string, string>;
  status: "new" | "replied";
  createdAt: string;
}

const INDEX_KEY = "enquiries:index";
const keyFor = (id: string) => `enquiry:${id}`;

export function isEnquiryStoreConfigured(): boolean {
  return isRedisConfigured();
}

export function generateEnquiryId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ENQ-${stamp}-${rand}`;
}

export async function saveEnquiry(enquiry: StoredEnquiry): Promise<void> {
  await redis.set(keyFor(enquiry.id), enquiry);
  await redis.zadd(INDEX_KEY, Date.parse(enquiry.createdAt) || Date.now(), enquiry.id);
}

export async function listEnquiries(): Promise<StoredEnquiry[]> {
  const ids = await redis.zrangeAllDesc(INDEX_KEY);
  const enquiries = await Promise.all(ids.map((id) => redis.get<StoredEnquiry>(keyFor(id))));
  return enquiries.filter((e): e is StoredEnquiry => e != null);
}

export async function getEnquiry(id: string): Promise<StoredEnquiry | null> {
  return redis.get<StoredEnquiry>(keyFor(id));
}

export async function markEnquiryReplied(id: string): Promise<void> {
  const enquiry = await getEnquiry(id);
  if (!enquiry) return;
  enquiry.status = "replied";
  await redis.set(keyFor(id), enquiry);
}

export async function deleteEnquiry(id: string): Promise<void> {
  await redis.del(keyFor(id));
  await redis.zrem(INDEX_KEY, id);
}
