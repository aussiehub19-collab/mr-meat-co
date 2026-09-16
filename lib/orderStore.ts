import { redis, isRedisConfigured } from "./redis";
export { generateOrderNumber } from "./orderNumber";

export interface StoredOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface StoredOrder {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  items: StoredOrderItem[];
  subtotal: number;
  amountDue: number;
  paymentMethod: string;
  notes?: string;
  status: "pending" | "payment-sent";
  channel: "whatsapp" | "email";
  createdAt: string;
}

const INDEX_KEY = "orders:index";
const keyFor = (orderNumber: string) => `order:${orderNumber}`;

export function isOrderStoreConfigured(): boolean {
  return isRedisConfigured();
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  await redis.set(keyFor(order.orderNumber), order);
  await redis.zadd(INDEX_KEY, Date.parse(order.createdAt) || Date.now(), order.orderNumber);
}

export async function listOrders(): Promise<StoredOrder[]> {
  const ids = await redis.zrangeAllDesc(INDEX_KEY);
  const orders = await Promise.all(ids.map((id) => redis.get<StoredOrder>(keyFor(id))));
  return orders.filter((o): o is StoredOrder => o != null);
}

export async function getOrder(orderNumber: string): Promise<StoredOrder | null> {
  return redis.get<StoredOrder>(keyFor(orderNumber));
}

export async function markOrderSent(orderNumber: string): Promise<void> {
  const order = await getOrder(orderNumber);
  if (!order) return;
  order.status = "payment-sent";
  await redis.set(keyFor(orderNumber), order);
}

export async function deleteOrder(orderNumber: string): Promise<void> {
  await redis.del(keyFor(orderNumber));
  await redis.zrem(INDEX_KEY, orderNumber);
}
