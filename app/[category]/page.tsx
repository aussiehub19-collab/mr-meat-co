import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, SITE } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { ShopFilterClient } from '@/components/ShopFilterClient';
import Link from 'next/link';

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return {};

  return {
    title: `${category.name} Cuts & Products | The Meat Cart Australia`,
    description: category.description,
    alternates: {
      canonical: `https://${SITE.domain}/${category.slug}/`,
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function TopLevelCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

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
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://${SITE.domain}/${category.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="space-y-3 border-b border-red-900/40 pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-500">
          <Link href="/shop/" className="hover:underline text-gray-400">
            Shop
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {category.name} Cuts & Fresh Meat
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {category.description}
        </p>

        {/* Subcategories Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-red-500 uppercase mr-1">Subcategories:</span>
          {category.subcategories.map((sub) => {
            const subSlug = sub.toLowerCase().replace(/ & /g, '-').replace(/ \/ /g, '-').replace(/ /g, '-');
            return (
              <Link
                key={sub}
                href={`/${category.slug}/${subSlug}/`}
                className="px-3 py-1 bg-[#1A1A1A] hover:bg-red-700 hover:text-white text-white text-xs font-bold rounded-lg border border-red-900/40 transition-colors"
              >
                {sub}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Interactive Shop Filter pre-selected to this category */}
      <ShopFilterClient initialCategory={category.slug} />
    </div>
  );
}
