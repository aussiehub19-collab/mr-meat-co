import React from 'react';
import type { FAQItem } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';

/**
 * Renders a visible FAQ block plus a matching FAQPage JSON-LD script.
 * Used on category, subcategory, landing and shop pages that carry PAGE_SEO faqs.
 */
export function SeoFaqSection({
  faqs,
  heading = 'Frequently asked questions',
}: {
  faqs?: FAQItem[];
  heading?: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 space-y-4">
      <JsonLd data={schema} />
      <h2 className="text-2xl font-black text-white font-serif">{heading}</h2>
      <div className="divide-y divide-[#991B1B]/20">
        {faqs.map((f, i) => (
          <div key={i} className="py-4">
            <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">{f.question}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
