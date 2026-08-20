import React from 'react';
import { FAQ, SITE, SHOP } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Frequently Asked Questions | Beef Delivery & Payment FAQ',
  description: 'Answers to top questions regarding our $300 AUD minimum order, free Sydney cold-chain delivery routes, PayID and 10% Crypto discounts, and beef mince freshness.',
  alternates: {
    canonical: `https://${SITE.domain}/faq/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `https://${SITE.domain}/faq/`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <JsonLd data={[faqSchema, breadcrumbSchema]} />

      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Customer & Delivery Help
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-300 text-sm max-w-2xl mx-auto">
          Everything you need to know about ordering 100% Australian grass-fed beef mince, minimum order values, refrigerated Sydney delivery, and payment options.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#141414] p-6 sm:p-8 rounded-2xl border border-[#991B1B]/40 shadow-sm space-y-3"
          >
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <h2 className="font-bold text-white text-base sm:text-lg font-serif">
                {item.question}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-8">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="p-8 bg-[#141414] rounded-3xl border border-[#991B1B]/40 text-center space-y-4 shadow-xl">
        <h3 className="font-bold font-serif text-white text-lg">Still Have Questions?</h3>
        <p className="text-xs text-gray-300 max-w-md mx-auto">
          Our Sydney master butchers are on hand to assist with custom orders, delivery inquiries, or bulk inquiries.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact/"
            className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md border border-red-500/30 hover:from-red-600 hover:to-red-900"
          >
            Contact Butcher Team
          </Link>
        </div>
      </div>
    </div>
  );
}
