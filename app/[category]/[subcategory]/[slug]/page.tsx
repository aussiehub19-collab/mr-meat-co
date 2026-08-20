import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, CATEGORIES, SITE, SHOP, CONTACT } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ProductAddToCartForm } from '@/app/shop/[category]/[slug]/ProductAddToCartForm';
import { ProductCard } from '@/components/ProductCard';
import { Truck, ShieldCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => {
    const subSlug = (p.subcategory || 'cuts')
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/ \/ /g, '-')
      .replace(/ /g, '-');
    return {
      category: p.category,
      subcategory: subSlug,
      slug: p.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  return {
    title: `${product.product_name || product.name} | The Meat Cart Australia`,
    description: (product.full_description || product.description).slice(0, 155),
    alternates: {
      canonical: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
    },
    openGraph: {
      title: `${product.product_name || product.name} | ${SITE.name}`,
      description: product.short_description || product.shortDescription,
      images: [{ url: product.main_image || product.image }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function TopLevelProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug && p.category === categorySlug);

  if (!product) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name || product.name,
    image: [product.main_image || product.image],
    description: product.full_description || product.description,
    sku: product.SKU || product.slug,
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
      priceCurrency: SITE.currency,
      price: product.price || 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_status === 'In Stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE.name,
      },
    },
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
        name: 'Shop',
        item: `https://${SITE.domain}/shop/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category ? category.name : product.category,
        item: `https://${SITE.domain}/${product.category}/`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.product_name || product.name,
        item: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
      },
    ],
  };

  const displayPrice = product.price !== null && product.price !== undefined
    ? `$${product.price.toFixed(2)}`
    : 'Inquire for Price';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Back to Category Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${product.category}/`}
          className="inline-flex items-center space-x-2 text-xs font-bold text-red-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {category ? category.name : 'Category'} Cuts</span>
        </Link>

        {product.stock_status && (
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-lg">
            {product.stock_status}
          </span>
        )}
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#141414] p-6 sm:p-8 rounded-3xl border border-red-900/40">
        {/* Product Image Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-2xl overflow-hidden p-4 shadow-xl border border-zinc-800">
            <SmartImage
              src={product.main_image || product.image}
              alt={product.product_name || product.name}
              fill
              priority
              className="object-contain p-4"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-red-700 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          <div className="p-4 bg-[#1A1A1A] rounded-2xl border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-white">
              <Truck className="w-4 h-4 text-red-500" />
              <span>Free Cold-Chain Delivery across Sydney on orders ${SHOP.freeShippingThreshold}+</span>
            </div>
            <div className="flex items-center space-x-2 font-bold text-gray-200">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Fresh Chilled & Vacuum Sealed — Delivered in Cold-Chain Vans</span>
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 1. Product Name */}
            <div>
              <div className="text-xs font-bold uppercase text-red-500 tracking-widest mb-1">
                {product.main_category || product.category} &gt; {product.subcategory}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-serif leading-tight">
                {product.product_name || product.name}
              </h1>
            </div>

            {/* 3. Price & 4. Pack Size & 5. Price Unit */}
            <div className="flex items-baseline space-x-3 pt-1 border-t border-zinc-800">
              <span className="text-3xl sm:text-4xl font-black text-red-500">{displayPrice}</span>
              <span className="text-sm font-semibold text-gray-300">
                AUD ({product.pack_size || product.weight || 'Pack'} — {product.price_type === 'per_kg' ? 'per kg' : product.price_type === 'per_pack' ? 'per pack' : 'per item'})
              </span>
            </div>

            {/* 6. Stock Status */}
            <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Stock Status: {product.stock_status || 'In Stock'}</span>
            </div>

            {/* 7. Short Description & Full Description */}
            <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
              <p className="font-semibold text-white">{product.short_description || product.shortDescription}</p>
              <p className="text-xs text-gray-400">{product.full_description || product.description}</p>
            </div>

            {/* 8. Cooking Method */}
            {product.cooking_methods && product.cooking_methods.length > 0 && (
              <div className="text-xs text-gray-300 space-y-1">
                <span className="font-bold text-red-500 uppercase tracking-wider block">Recommended Cooking Method:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.cooking_methods.map((method) => (
                    <span key={method} className="px-2.5 py-1 bg-[#222] border border-zinc-800 rounded-md text-gray-200 font-medium">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Storage Information */}
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-zinc-800 text-xs text-gray-300 space-y-1">
              <span className="font-bold text-white block uppercase tracking-wider">Storage Information:</span>
              <p>{product.storage_type || 'Fresh Chilled'}: {product.storage_instructions || 'Keep refrigerated below 4°C. Consume within 3 days or freeze.'}</p>
            </div>
          </div>

          {/* 10. Add to Cart Button */}
          <div className="pt-2">
            <ProductAddToCartForm product={product} />
          </div>

          {/* Quick WhatsApp Inquiry */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-gray-400">
            <span>Custom butcher cut required?</span>
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                `Hi Sydney Butcher, I have a question about ${product.product_name || product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 font-bold hover:underline flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Butcher via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h3 className="text-2xl font-bold font-serif text-white">
            More Cuts From {category ? category.name : 'This Category'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
