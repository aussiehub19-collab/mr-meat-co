'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, POSTS } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { products: [], posts: [] };
    }

    const matchingProducts = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
    );

    const matchingPosts = POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
    );

    return { products: matchingProducts, posts: matchingPosts };
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Search Bar */}
      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Catalog Search
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-serif">
          Search Meat Catalog & Masterclass
        </h1>

        <div className="relative max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search beef mince, wagyu steak, lamb cutlets..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#141414] border border-[#991B1B]/40 rounded-2xl text-sm font-medium text-white placeholder-gray-500 shadow-sm focus:outline-none focus:border-red-500"
          />
          <Search className="w-5 h-5 text-red-500 absolute left-4 top-4" />
        </div>
      </div>

      {/* Results Section */}
      {query && (
        <div className="space-y-10">
          {/* Products Results */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-serif text-white">
              Matching Products ({results.products.length})
            </h2>

            {results.products.length === 0 ? (
              <p className="text-sm text-gray-300 bg-[#141414] p-6 rounded-2xl border border-[#991B1B]/40">
                No products found matching &quot;{query}&quot;. Try searching for &quot;beef mince&quot;, &quot;steak&quot;, or &quot;lamb&quot;.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </div>

          {/* Posts Results */}
          {results.posts.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-[#991B1B]/40">
              <h2 className="text-xl font-bold font-serif text-white">
                Matching Masterclass Guides ({results.posts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="p-5 bg-[#141414] rounded-2xl border border-[#991B1B]/40 shadow-sm hover:border-red-500 transition-all block space-y-2 group"
                  >
                    <span className="text-xs font-bold text-red-400 uppercase">{post.category}</span>
                    <h3 className="font-bold text-white group-hover:text-red-300 transition-colors text-base">{post.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-400">Loading search engine...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

