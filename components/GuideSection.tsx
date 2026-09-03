import React from 'react';
import { Article } from '@/components/Article';

/**
 * Long-form buying / cooking guide rendered under the product grid on
 * category, subcategory and landing pages. Content is markdown (## / ###
 * headings, links, lists) fed straight to the Article renderer.
 */
export function GuideSection({
  guide,
  keyword,
}: {
  guide?: string;
  keyword?: string;
}) {
  if (!guide || !guide.trim()) return null;
  const heading = keyword
    ? `${keyword.replace(/\b\w/g, (c) => c.toUpperCase())} — Buying & Cooking Guide`
    : 'Buying & Cooking Guide';
  return (
    <section className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40">
      <h2 className="text-2xl font-black text-white font-serif mb-4">{heading}</h2>
      <div className="prose-invert max-w-3xl text-sm text-gray-300 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:font-serif [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-1.5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5">
        <Article content={guide} />
      </div>
    </section>
  );
}
