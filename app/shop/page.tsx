import React from 'react';
import { SITE } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { ShopFilterClient } from '@/components/ShopFilterClient';

export const metadata = {
  title: 'Shop All Fresh Beef, Lamb, Poultry & Butcher Boxes',
  description: 'Browse 100% Australian grass-fed beef mince, Wagyu steaks, pasture-raised lamb cutlets, and bulk butcher boxes. Temperature-controlled delivery across Greater Sydney.',
  alternates: {
    canonical: `https://${SITE.domain}/shop/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ShopIndexPage() {
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
        name: 'Shop',
        item: `https://${SITE.domain}/shop/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="space-y-3 border-b border-[#991B1B]/40 pb-6">
        <div className="text-xs font-bold uppercase text-red-400 tracking-widest">
          100% Australian Grass-Fed Butcher & Master Market
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          Craft Butcher Meat Market
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          Filter through all 12 artisanal butcher categories, subcategories, and specialty meat cuts. Ground fresh daily in Alexandria with zero preservatives or fillers. Cold-chain refrigerated express delivery across Greater Sydney.
        </p>
      </div>

      {/* Interactive Shop Filter System */}
      <ShopFilterClient initialCategory="all" />
    </div>
  );
}
