import React from 'react';
import { notFound } from 'next/navigation';
import { POSTS, SITE } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { SmartImage } from '@/components/SmartImage';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${SITE.name}`,
    description: post.excerpt,
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: SITE.name,
      url: `https://${SITE.domain}/`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `https://${SITE.domain}/images/logo.png`,
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://${SITE.domain}/blog/${post.slug}/`,
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
        name: 'Blog',
        item: `https://${SITE.domain}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://${SITE.domain}/blog/${post.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />

      <Link href="/blog/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Masterclass Articles</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-xs font-bold text-red-400 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif leading-tight">
          {post.title}
        </h1>
        <p className="text-base text-gray-300 leading-relaxed font-medium">
          {post.excerpt}
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#991B1B]/40 shadow-md">
        <SmartImage src={post.image} alt={post.title} fill priority className="object-cover" />
      </div>

      {/* Content body */}
      <div className="bg-[#141414] p-8 sm:p-12 rounded-3xl border border-[#991B1B]/40 shadow-sm space-y-6 text-gray-200 leading-relaxed text-sm sm:text-base prose max-w-none">
        {post.content ? (
          <div className="whitespace-pre-line leading-loose space-y-4">
            {post.content}
          </div>
        ) : (
          <p>{post.excerpt}</p>
        )}
      </div>

      {/* Bottom CTA Box */}
      <div className="bg-[#141414] text-white p-8 rounded-3xl space-y-4 text-center border border-[#991B1B]/50 shadow-xl">
        <h3 className="text-xl font-bold font-serif">
          Ready to Cook with 100% Australian Grass-Fed Beef Mince?
        </h3>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Ground fresh daily by our Alexandria master butchers. Delivered cold-chain refrigerated across Sydney Metro.
        </p>
        <Link
          href="/shop/beef/grass-fed-premium-beef-mince/"
          className="inline-block bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:from-red-600 hover:to-red-900 text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide shadow-lg border border-red-500/30"
        >
          Order Fresh Beef Mince Now →
        </Link>
      </div>
    </div>
  );
}
