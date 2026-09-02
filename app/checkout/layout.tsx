import type { Metadata } from 'next';

// Checkout is transactional — keep it out of the index (still followable).
export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
