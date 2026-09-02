'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, WHOLESALE_BULK_SUBCATEGORIES, PAGE_SEO, Product } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import { WholesaleNav } from '@/components/WholesaleNav';
import { BulkOrderContactSection } from '@/components/BulkOrderContactSection';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { Search, Filter, Layers, CheckCircle, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

export default function BulkMeatOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Filter products belonging to wholesale main_category
  const wholesaleProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => (p.main_category || p.category || '').toLowerCase() === 'wholesale' || p.is_wholesale
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return wholesaleProducts.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (product.product_name || product.name || '').toLowerCase();
        const desc = (product.description || product.short_description || '').toLowerCase();
        const sub = (product.subcategory || '').toLowerCase();
        if (!name.includes(q) && !desc.includes(q) && !sub.includes(q)) {
          return false;
        }
      }

      // Subcategory / Animal filter
      if (selectedSubcategory !== 'all') {
        const subSlug = (product.subcategory || '').toLowerCase().replace(/\s+/g, '-');
        if (subSlug !== selectedSubcategory && product.subcategory !== selectedSubcategory) {
          return false;
        }
      }

      // Format filter (Animal Share vs Bulk Carton vs Freezer Pack vs Box)
      if (selectedFormat !== 'all') {
        const isShare = product.is_animal_share || (product.product_name || product.name).toLowerCase().includes('share');
        if (selectedFormat === 'animal_share' && !isShare) return false;
        if (selectedFormat === 'carton' && !product.slug.includes('carton') && !product.slug.includes('box')) return false;
        if (selectedFormat === 'freezer_pack' && !product.slug.includes('pack') && !product.slug.includes('box')) return false;
      }

      // Storage filter
      if (selectedStorage !== 'all') {
        if (product.storage_type !== selectedStorage) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'name-asc') return (a.product_name || a.name).localeCompare(b.product_name || b.name);
      return 0;
    });
  }, [wholesaleProducts, searchQuery, selectedSubcategory, selectedFormat, selectedStorage, sortBy]);

  const hasActiveFilters = searchQuery || selectedSubcategory !== 'all' || selectedFormat !== 'all' || selectedStorage !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubcategory('all');
    setSelectedFormat('all');
    setSelectedStorage('all');
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/" className="hover:text-white transition-colors">Wholesale</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-red-400 font-semibold">Bulk Meat Orders & Animal Shares</span>
      </nav>

      {/* Wholesale Section Nav */}
      <WholesaleNav />

      {/* Hero Header */}
      <div className="bg-[#141414] rounded-3xl border border-[#991B1B]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <span>Sydney Bulk Butchery & Freezer Stocks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
            Bulk Meat Orders & Animal Shares
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Shop large-quantity meat orders, freezer packs and animal shares. Add listed bulk products directly to cart. For quantities larger than the listed options, customers must contact us for a custom bulk-order price.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-300">
            <div className="flex items-center gap-1.5 bg-[#1C1414] px-3 py-1.5 rounded-lg border border-red-900/30">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Online Ordering (Fixed Price)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1C1414] px-3 py-1.5 rounded-lg border border-red-900/30">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cold-Chain Refrigerated Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1C1414] px-3 py-1.5 rounded-lg border border-red-900/30">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NSW Van Delivery + National Frozen Courier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#141414] rounded-2xl border border-[#991B1B]/40 p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bulk products, cuts, animal shares..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
            />
          </div>

          {/* Subcategory / Animal Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
            >
              <option value="all">All Meat Categories (All)</option>
              {WHOLESALE_BULK_SUBCATEGORIES.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
            >
              <option value="all">All Bulk Formats</option>
              <option value="animal_share">Animal Shares (Half / Whole)</option>
              <option value="carton">Bulk Cartons (10kg - 20kg)</option>
              <option value="freezer_pack">Freezer Variety Packs</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Quick Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 border ${
              selectedSubcategory === 'all'
                ? 'bg-red-700 text-white border-red-500 font-bold'
                : 'bg-[#0D0D0D] text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            All Bulk Items ({wholesaleProducts.length})
          </button>
          {WHOLESALE_BULK_SUBCATEGORIES.map((sub) => {
            const count = wholesaleProducts.filter(
              (p) => (p.subcategory || '').toLowerCase().replace(/\s+/g, '-') === sub.slug
            ).length;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setSelectedSubcategory(sub.slug)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 border ${
                  selectedSubcategory === sub.slug
                    ? 'bg-red-700 text-white border-red-500 font-bold'
                    : 'bg-[#0D0D0D] text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Active filter reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
            <span className="text-gray-400">
              Showing <strong className="text-white">{filteredProducts.length}</strong> of {wholesaleProducts.length} products
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-red-400 hover:text-red-300 font-semibold underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id || product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-2xl border border-[#991B1B]/40 p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bulk Products Match Your Filter</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Try adjusting your search query or reset the filters to view all available bulk meat orders and animal shares.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-bold"
          >
            Show All Bulk Products
          </button>
        </div>
      )}

      {/* Need More Than This? Contact Section */}
      <BulkOrderContactSection />

      {PAGE_SEO['/wholesale/bulk-meat-orders/']?.faqs && (
        <SeoFaqSection faqs={PAGE_SEO['/wholesale/bulk-meat-orders/']!.faqs} />
      )}
    </div>
  );
}
