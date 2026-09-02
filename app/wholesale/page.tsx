'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SITE, CONTACT, FORMS, PRODUCTS, WHOLESALE_BULK_SUBCATEGORIES } from '@/config/site';
import { WholesaleNav } from '@/components/WholesaleNav';
import { ProductCard } from '@/components/ProductCard';
import { BulkOrderContactSection } from '@/components/BulkOrderContactSection';
import {
  Building2,
  Package,
  Truck,
  Percent,
  Send,
  Layers,
  ChevronRight,
  PhoneCall,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Filter all wholesale bulk products
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

      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        const subSlug = (product.subcategory || '').toLowerCase().replace(/\s+/g, '-');
        if (subSlug !== selectedSubcategory && product.subcategory !== selectedSubcategory) {
          return false;
        }
      }

      // Format filter
      if (selectedFormat !== 'all') {
        const isShare = product.is_animal_share || (product.product_name || product.name).toLowerCase().includes('share');
        if (selectedFormat === 'animal_share' && !isShare) return false;
        if (selectedFormat === 'carton' && !product.slug.includes('carton') && !product.slug.includes('box')) return false;
        if (selectedFormat === 'freezer_pack' && !product.slug.includes('pack') && !product.slug.includes('box')) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.product_name || a.name).localeCompare(b.product_name || b.name);
      }
      return 0;
    });
  }, [wholesaleProducts, searchQuery, selectedSubcategory, selectedFormat, sortBy]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const key = FORMS.web3formsKey;

    if (!key || key.startsWith('YOUR-') || key === 'pending') {
      window.location.href = '/thank-you-wholesale/';
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      const data = await response.json();
      if (response.status === 200 && data.success) {
        window.location.href = '/thank-you-wholesale/';
      } else {
        window.location.href = '/thank-you-wholesale/';
      }
    } catch (err) {
      window.location.href = '/thank-you-wholesale/';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Navigation Bar */}
      <WholesaleNav />

      {/* Hero Header */}
      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-red-400" />
          <span>Wholesale & Bulk Meat Supply</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif tracking-tight">
          Wholesale & Bulk Meat Orders
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
          Shop wholesale bulk cartons, freezer packs, and whole/half animal shares online with fixed AUD pricing and direct delivery across Sydney. Commercial restaurants, clubs, and food service partners can also submit custom trade inquiries below.
        </p>
      </div>

      {/* ========================================== */}
      {/* 1. DIRECT BULK PRODUCTS CATALOG */}
      {/* ========================================== */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#991B1B]/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="text-2xl font-black text-white font-serif">
                Bulk Meat Products & Animal Shares
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Add listed bulk packs and carcase shares directly to cart. Fixed pricing in AUD.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Showing <strong className="text-white">{filteredProducts.length}</strong> of{' '}
              <strong className="text-red-400">{wholesaleProducts.length}</strong> products
            </span>
            <Link
              href="/wholesale/bulk-meat-orders/"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-500/30 transition-colors"
            >
              <span>Full Subsection</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#141414] p-4 rounded-2xl border border-[#991B1B]/40 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bulk beef, lamb, pork, chicken, mince cartons, animal shares..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Format Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                aria-label="Filter by format"
                className="w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="all">All Formats (Cartons, Packs, Shares)</option>
                <option value="animal_share">Animal Shares (Whole/Half/Quarter)</option>
                <option value="carton">Bulk Cartons & Boxes</option>
                <option value="freezer_pack">Freezer & Variety Packs</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#991B1B]/40 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Product Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                selectedSubcategory === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md'
                  : 'bg-[#0D0D0D] text-gray-400 hover:text-white border border-red-950/60'
              }`}
            >
              All Wholesale Meat ({wholesaleProducts.length})
            </button>
            {WHOLESALE_BULK_SUBCATEGORIES.map((sub) => {
              const count = wholesaleProducts.filter(
                (p) => (p.subcategory || '').toLowerCase().replace(/\s+/g, '-') === sub.slug
              ).length;
              const active = selectedSubcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => setSelectedSubcategory(sub.slug)}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md'
                      : 'bg-[#0D0D0D] text-gray-400 hover:text-white border border-red-950/60'
                  }`}
                >
                  {sub.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.product_id || product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-4">
            <Package className="w-12 h-12 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold text-white font-serif">No wholesale products found</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              No products match your current filters. Try resetting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubcategory('all');
                setSelectedFormat('all');
              }}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 2. NEED MORE THAN THIS? CUSTOM QUOTE */}
      {/* ========================================== */}
      <BulkOrderContactSection />

      {/* ========================================== */}
      {/* 3. B2B WHOLESALE & TRADE INQUIRIES */}
      {/* ========================================== */}
      <div className="space-y-8 pt-6 border-t border-[#991B1B]/40">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase text-red-400 tracking-wider">
            Commercial & Foodservice Supply
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Trade & Restaurant Wholesale Supply
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Direct master-carton distribution, custom primal butchery, and scheduled cold-chain delivery for Sydney hospitality venues.
          </p>
        </div>

        {/* Wholesale Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
            <Package className="w-8 h-8 text-red-500" />
            <h3 className="font-bold text-white font-serif text-lg">Custom Grind Specifications</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tailored fat ratios (80/20, 85/15, 75/25) ground fresh daily for smash burgers, meatball production, and bistro service.
            </p>
          </div>

          <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
            <Truck className="w-8 h-8 text-red-500" />
            <h3 className="font-bold text-white font-serif text-lg">Dedicated Cold-Chain Logistics</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Temperature-monitored refrigerated van delivery scheduled 6 days a week across Sydney Metro and Greater Western Sydney.
            </p>
          </div>

          <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
            <Percent className="w-8 h-8 text-red-500" />
            <h3 className="font-bold text-white font-serif text-lg">Tiered Volume Pricing</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tiered discounts starting at 50kg+ weekly commitments. Additional 10% instant discount for crypto (BTC / USDT) settlement.
            </p>
          </div>
        </div>

        {/* Wholesale Form */}
        <div className="bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold font-serif text-white">
              Submit B2B Wholesale Application
            </h3>
            <p className="text-xs text-gray-400">
              Our commercial butchery team will review your business requirements and provide customized rate sheets.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
            <input type="hidden" name="subject" value="Wholesale Application - Mr Meat & Co" />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Business / Venue Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  required
                  placeholder="e.g. Surry Hills Bistro"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  ABN / ACN Number
                </label>
                <input
                  type="text"
                  name="abn"
                  placeholder="12 345 678 910"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Chef Marco"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="marco@bistro.com.au"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Estimated Weekly Volume (kg) & Product Requirements *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="e.g. Looking for 100kg/week of 80/20 grass-fed beef mince, whole rump sub-primals, and chicken breast fillets..."
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:from-red-600 hover:to-red-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 border border-red-500/30"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Wholesale Trade Application'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
