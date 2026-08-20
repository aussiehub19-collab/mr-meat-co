'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Layers, PhoneCall, ChevronRight } from 'lucide-react';
import { WHOLESALE_BULK_SUBCATEGORIES } from '@/config/site';

export function WholesaleNav() {
  const pathname = usePathname() || '';

  const isTrade = pathname === '/wholesale' || pathname === '/wholesale/';
  const isBulkRoot = pathname === '/wholesale/bulk-meat-orders' || pathname === '/wholesale/bulk-meat-orders/';
  const isContact = pathname.startsWith('/wholesale/contact-us');

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Top Level Wholesale Navigation */}
      <div className="bg-[#141414] p-2 sm:p-3 rounded-2xl border border-[#991B1B]/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/wholesale/"
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              isTrade
                ? 'bg-red-700 text-white shadow-md border border-red-500/50'
                : 'text-gray-300 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Building2 className="w-4 h-4 text-red-400" />
            <span>Trade & Wholesale Enquiries</span>
          </Link>

          <Link
            href="/wholesale/bulk-meat-orders/"
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              isBulkRoot || (pathname.includes('/wholesale/bulk-meat-orders') && !isContact)
                ? 'bg-red-700 text-white shadow-md border border-red-500/50'
                : 'text-gray-300 hover:text-white hover:bg-[#1E1E1E]'
            }`}
          >
            <Layers className="w-4 h-4 text-red-400" />
            <span>Bulk Meat Orders & Animal Shares</span>
          </Link>
        </div>

        <Link
          href="/wholesale/contact-us/"
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            isContact
              ? 'bg-amber-600 text-white shadow-md border border-amber-400/50'
              : 'bg-[#1C1414] text-amber-300 hover:text-white hover:bg-amber-950/60 border border-amber-600/40'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-amber-400" />
          <span>Contact Us for Large Orders</span>
        </Link>
      </div>

      {/* Sub-categories row if inside /wholesale/bulk-meat-orders */}
      {(pathname.includes('/wholesale/bulk-meat-orders') || isBulkRoot) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] pl-1 shrink-0">
            Bulk Categories:
          </span>
          <Link
            href="/wholesale/bulk-meat-orders/"
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border shrink-0 ${
              isBulkRoot
                ? 'bg-red-900/60 text-white border-red-500/60 font-bold'
                : 'bg-[#141414] text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white'
            }`}
          >
            All Bulk Products
          </Link>
          {WHOLESALE_BULK_SUBCATEGORIES.map((sub) => {
            const subHref = `/wholesale/bulk-meat-orders/${sub.slug}/`;
            const isActive = pathname.startsWith(subHref) || pathname === `/wholesale/bulk-meat-orders/${sub.slug}`;
            return (
              <Link
                key={sub.slug}
                href={subHref}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors border shrink-0 ${
                  isActive
                    ? 'bg-red-900/60 text-white border-red-500/60 font-bold'
                    : 'bg-[#141414] text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white'
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
