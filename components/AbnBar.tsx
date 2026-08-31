import React from 'react';
import { SITE } from '@/config/site';
import { ShieldCheck } from 'lucide-react';

const ABN_DIGITS = SITE.abn.replace(/\s+/g, '');

export function AbnBar() {
  return (
    <div className="bg-[#0A0A0A] border-b border-[#991B1B]/30 text-[#D4D4D4] text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center gap-2 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" aria-hidden="true" />
        <span className="font-semibold tracking-wide">
          {SITE.legalName} &middot; ABN {SITE.abn}
        </span>
        <a
          href={`https://abr.business.gov.au/ABN/View?abn=${ABN_DIGITS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-red-400 hover:text-red-300 underline underline-offset-2"
        >
          Verify on ABR
        </a>
      </div>
    </div>
  );
}
