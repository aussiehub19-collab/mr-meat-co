import React from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, SITE } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { ShopFilterClient } from '@/components/ShopFilterClient';
import { SeafoodCatalogueClient } from '@/components/SeafoodCatalogueClient';
import { PetFoodCatalogueClient } from '@/components/PetFoodCatalogueClient';
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

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';

  return {
    title: isSeafood
      ? `Seafood Catalogue | Fish, Prawns & Salmon`
      : isPetFood
      ? `Pet Food Catalogue | Raw Pet Mince, Bones & Offal`
      : `${category.name} Cuts & Products | Mr Meat & Co Australia`,
    description: isSeafood
      ? `Browse our seafood catalogue including Barramundi, Snapper, Flathead, King Prawns, and Tasmanian Salmon portions. Fresh chilled and frozen storage.`
      : isPetFood
      ? `Explore our raw pet food catalogue featuring Raw Mince, Bones, and Offal. Pet food only — not for human consumption.`
      : category.description,
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

  const isSeafood = categorySlug === 'seafood';
  const isPetFood = categorySlug === 'pet-food';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: isSeafood
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://${SITE.domain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Seafood',
            item: `https://${SITE.domain}/seafood/`,
          },
        ]
      : isPetFood
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://${SITE.domain}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Pet Food',
            item: `https://${SITE.domain}/pet-food/`,
          },
        ]
      : [
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
          <Link href="/" className="hover:underline text-gray-400">
            Home
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          {isSeafood
            ? 'Seafood Product Catalogue'
            : isPetFood
            ? 'Pet Food Product Catalogue'
            : `${category.name} Cuts & Fresh Meat`}
        </h1>
        <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
          {isSeafood
            ? 'Explore our complete seafood catalogue featuring fresh chilled and frozen fish fillets, raw and cooked prawns, and salmon portions. All prices are in AUD with clear storage and allergen information.'
            : isPetFood
            ? 'Raw pet meat, bones, and offal prepared strictly for animal diets. Pet food only — not for human consumption. Keep frozen until use.'
            : category.description}
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

      {/* Interactive Filter System */}
      {isSeafood ? (
        <SeafoodCatalogueClient initialSubcategory="all" />
      ) : isPetFood ? (
        <PetFoodCatalogueClient initialSubcategory="all" />
      ) : (
        <ShopFilterClient initialCategory={category.slug} />
      )}
    </div>
  );
}
