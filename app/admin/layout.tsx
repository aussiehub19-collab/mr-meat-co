import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: { absolute: `Admin — ${SITE.name}` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="border-b border-[#991B1B]/40 bg-[#141414]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6">
          <Link href="/admin/" className="font-black font-serif text-white text-sm hover:text-red-400">{SITE.name} Admin</Link>
          <nav className="flex items-center gap-4 text-xs font-bold">
            <Link href="/admin/" className="text-gray-300 hover:text-red-400">Dashboard</Link>
            <Link href="/admin/orders/" className="text-gray-300 hover:text-red-400">Orders</Link>
            <Link href="/admin/enquiries/" className="text-gray-300 hover:text-red-400">Enquiries</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
