'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PRODUCTS, Product } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Fish,
  Snowflake,
  ShieldAlert,
} from 'lucide-react';

interface SeafoodCatalogueClientProps {
  initialSubcategory?: string;
}

const SEAFOOD_TYPES = [
  'All Types',
  'Barramundi',
  'Snapper',
  'Flathead',
  'Threadfin Salmon',
  'Salmon',
  'Prawns',
];

const PRODUCT_TYPES = [
  'All Formats',
  'Fish Fillet',
  'Fish Portion',
  'Whole Fish',
  'Raw Prawns',
  'Cooked Prawns',
  'Prawn Meat',
  'Smoked Salmon',
];

const COOKING_METHODS = [
  'All Cooking Methods',
  'BBQ',
  'Grill',
  'Pan-Fry',
  'Oven',
  'Air Fryer',
  'Boil',
  'Stir-Fry',
  'Ready to Eat',
];

const PACK_TYPES = [
  'All Pack Types',
  '150g Pack',
  '250g Pack',
  '500g Pack',
  '1kg Pack',
  '2kg Pack',
  '3kg Pack',
  'Whole Fish',
];

const STORAGE_TYPES = ['All Storage', 'Fresh Chilled', 'Frozen', 'Refrigerated'];

const SUBCATEGORIES = [
  { slug: 'all', name: 'All Seafood' },
  { slug: 'fish', name: 'Fish' },
  { slug: 'prawns', name: 'Prawns' },
  { slug: 'salmon', name: 'Salmon' },
];

export function SeafoodCatalogueClient({ initialSubcategory = 'all' }: SeafoodCatalogueClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedType, setSelectedType] = useState<string>('All Types');
  const [selectedProductType, setSelectedProductType] = useState<string>('All Formats');
  const [selectedCookingMethod, setSelectedCookingMethod] = useState<string>('All Cooking Methods');
  const [selectedPackType, setSelectedPackType] = useState<string>('All Pack Types');
  const [selectedStorage, setSelectedStorage] = useState<string>('All Storage');
  const [sortBy, setSortBy] = useState<'lowest' | 'highest' | 'popularity' | 'newest'>('popularity');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // All seafood products
  const seafoodProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => (p.main_category || p.category || '').toLowerCase() === 'seafood'
    );
  }, []);

  // Filtered & Sorted
  const filteredProducts = useMemo(() => {
    let list = seafoodProducts.filter((product) => {
      // 1. Subcategory filter
      if (selectedSubcategory !== 'all') {
        const subSlug = (product.subcategory || '').toLowerCase().replace(/\s+/g, '-');
        if (subSlug !== selectedSubcategory.toLowerCase()) {
          return false;
        }
      }

      // 2. Seafood type filter
      if (selectedType !== 'All Types') {
        const name = (product.product_name || product.name || '').toLowerCase();
        const pType = (product.product_type || '').toLowerCase();
        const desc = (product.short_description || '').toLowerCase();
        const full = `${name} ${pType} ${desc}`;

        if (selectedType === 'Barramundi' && !full.includes('barramundi')) return false;
        if (selectedType === 'Snapper' && !full.includes('snapper')) return false;
        if (selectedType === 'Flathead' && !full.includes('flathead')) return false;
        if (selectedType === 'Threadfin Salmon' && !full.includes('threadfin')) return false;
        if (selectedType === 'Salmon' && !full.includes('salmon') && !pType.includes('salmon')) return false;
        if (selectedType === 'Prawns' && !full.includes('prawn')) return false;
      }

      // 3. Product type filter
      if (selectedProductType !== 'All Formats') {
        const pType = (product.product_type || '').toLowerCase();
        const name = (product.product_name || product.name || '').toLowerCase();
        const target = selectedProductType.toLowerCase();

        if (target === 'fish fillet' && !pType.includes('fillet') && !name.includes('fillet')) return false;
        if (target === 'fish portion' && !pType.includes('portion') && !name.includes('portion')) return false;
        if (target === 'whole fish' && !pType.includes('whole') && !name.includes('whole')) return false;
        if (target === 'raw prawns' && (!pType.includes('raw') || !pType.includes('prawn')) && (!name.includes('raw') || !name.includes('prawn'))) return false;
        if (target === 'cooked prawns' && (!pType.includes('cooked') || !pType.includes('prawn')) && !name.includes('cooked')) return false;
        if (target === 'prawn meat' && !pType.includes('meat') && !name.includes('meat')) return false;
        if (target === 'smoked salmon' && !pType.includes('smoked') && !name.includes('smoked')) return false;
      }

      // 4. Cooking method
      if (selectedCookingMethod !== 'All Cooking Methods') {
        const methods = product.cooking_methods || [];
        const hasMethod = methods.some((m) =>
          m.toLowerCase().includes(selectedCookingMethod.toLowerCase())
        );
        if (!hasMethod) return false;
      }

      // 5. Pack type filter
      if (selectedPackType !== 'All Pack Types') {
        const packSize = (product.pack_size || product.weight || '').toLowerCase();
        const name = (product.product_name || product.name || '').toLowerCase();
        const target = selectedPackType.toLowerCase();

        if (target === '150g pack' && !packSize.includes('150g')) return false;
        if (target === '250g pack' && !packSize.includes('250g')) return false;
        if (target === '500g pack' && !packSize.includes('500g')) return false;
        if (target === '1kg pack' && !packSize.includes('1kg')) return false;
        if (target === '2kg pack' && !packSize.includes('2kg')) return false;
        if (target === '3kg pack' && !packSize.includes('3kg')) return false;
        if (target === 'whole fish' && !name.includes('whole') && !packSize.includes('whole')) return false;
      }

      // 6. Storage filter
      if (selectedStorage !== 'All Storage') {
        if (product.storage_type !== selectedStorage) {
          return false;
        }
      }

      // 7. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (product.product_name || product.name || '').toLowerCase();
        const desc = (product.short_description || '').toLowerCase();
        const sub = (product.subcategory || '').toLowerCase();
        const pType = (product.product_type || '').toLowerCase();
        if (!name.includes(q) && !desc.includes(q) && !sub.includes(q) && !pType.includes(q)) {
          return false;
        }
      }

      return true;
    });

    // Sort
    const sorted = [...list];
    if (sortBy === 'lowest') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'highest') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'newest') {
      sorted.reverse();
    }
    return sorted;
  }, [
    seafoodProducts,
    selectedSubcategory,
    selectedType,
    selectedProductType,
    selectedCookingMethod,
    selectedPackType,
    selectedStorage,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSubcategory !== 'all') count++;
    if (selectedType !== 'All Types') count++;
    if (selectedProductType !== 'All Formats') count++;
    if (selectedCookingMethod !== 'All Cooking Methods') count++;
    if (selectedPackType !== 'All Pack Types') count++;
    if (selectedStorage !== 'All Storage') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedSubcategory,
    selectedType,
    selectedProductType,
    selectedCookingMethod,
    selectedPackType,
    selectedStorage,
    searchQuery,
  ]);

  const resetAllFilters = () => {
    setSelectedSubcategory('all');
    setSelectedType('All Types');
    setSelectedProductType('All Formats');
    setSelectedCookingMethod('All Cooking Methods');
    setSelectedPackType('All Pack Types');
    setSelectedStorage('All Storage');
    setSearchQuery('');
    setSortBy('popularity');
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#991B1B]/30">
        {SUBCATEGORIES.map((tab) => {
          const isActive = selectedSubcategory === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setSelectedSubcategory(tab.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white shadow-lg shadow-red-950/60 border border-red-400/40'
                  : 'bg-[#181414] text-gray-300 hover:text-white hover:bg-[#201818] border border-[#991B1B]/30'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Allergen & Storage Advisory Notice Banner */}
      <div className="bg-[#141414] border border-[#991B1B]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">
              Allergen & Storage Advisory Notice
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
              All seafood products require allergen checking on delivery (Contains Fish / Crustacean Shellfish). Storage type is clearly marked as <strong className="text-emerald-400 font-semibold">Fresh Chilled</strong> (refrigerate below 4°C), <strong className="text-sky-400 font-semibold">Frozen</strong> (keep frozen at -18°C), or <strong className="text-purple-400 font-semibold">Refrigerated</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs text-gray-400 bg-[#1C1414] px-3 py-1.5 rounded-lg border border-[#991B1B]/30">
          <Snowflake className="w-4 h-4 text-sky-400" />
          <span>Cold-Chain Express Sydney</span>
        </div>
      </div>

      {/* Main Filter Bar & Controls */}
      <div className="bg-[#181414] border border-[#991B1B]/40 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fish fillets, king prawns, salmon portions..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#991B1B]/40 rounded-xl text-xs sm:text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-red-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#141414] text-xs font-bold text-white border border-[#991B1B]/40 rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500"
              >
                <option value="popularity">Popularity</option>
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2.5 bg-[#141414] text-xs font-bold text-white border border-[#991B1B]/40 rounded-xl flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-400" />
              <span>Filters ({activeFilterCount})</span>
            </button>
          </div>
        </div>

        {/* Desktop Filter Dropdowns Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-[#991B1B]/30 ${mobileFilterOpen ? 'block' : 'hidden lg:grid'}`}>
          {/* 1. Seafood Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">
              Seafood Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#141414] text-xs font-medium text-white border border-[#991B1B]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              {SEAFOOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Product Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">
              Product Type
            </label>
            <select
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="w-full bg-[#141414] text-xs font-medium text-white border border-[#991B1B]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              {PRODUCT_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Cooking Method */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">
              Cooking Method
            </label>
            <select
              value={selectedCookingMethod}
              onChange={(e) => setSelectedCookingMethod(e.target.value)}
              className="w-full bg-[#141414] text-xs font-medium text-white border border-[#991B1B]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              {COOKING_METHODS.map((cm) => (
                <option key={cm} value={cm}>
                  {cm}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Pack Type */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">
              Pack Type
            </label>
            <select
              value={selectedPackType}
              onChange={(e) => setSelectedPackType(e.target.value)}
              className="w-full bg-[#141414] text-xs font-medium text-white border border-[#991B1B]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              {PACK_TYPES.map((pk) => (
                <option key={pk} value={pk}>
                  {pk}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Storage */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block">
              Storage Status
            </label>
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="w-full bg-[#141414] text-xs font-medium text-white border border-[#991B1B]/40 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
            >
              {STORAGE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t border-[#991B1B]/30 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Filters:
            </span>

            {selectedSubcategory !== 'all' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Category: {selectedSubcategory}
                <button type="button" onClick={() => setSelectedSubcategory('all')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedType !== 'All Types' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Type: {selectedType}
                <button type="button" onClick={() => setSelectedType('All Types')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedProductType !== 'All Formats' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Format: {selectedProductType}
                <button type="button" onClick={() => setSelectedProductType('All Formats')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedCookingMethod !== 'All Cooking Methods' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Cooking: {selectedCookingMethod}
                <button type="button" onClick={() => setSelectedCookingMethod('All Cooking Methods')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedPackType !== 'All Pack Types' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Pack: {selectedPackType}
                <button type="button" onClick={() => setSelectedPackType('All Pack Types')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            {selectedStorage !== 'All Storage' && (
              <span className="bg-[#141414] border border-red-500/40 text-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                Storage: {selectedStorage}
                <button type="button" onClick={() => setSelectedStorage('All Storage')}>
                  <X className="w-3 h-3 hover:text-white" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-red-400 hover:text-red-300 font-bold ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
          Showing <strong className="text-white">{filteredProducts.length}</strong> of {seafoodProducts.length} seafood products
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#181414] border border-[#991B1B]/40 rounded-2xl p-12 text-center space-y-4">
          <Fish className="w-12 h-12 text-red-400 mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white font-serif">
            No matching seafood products found
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Try clearing filters or search for barramundi, snapper, flathead, king prawns, or salmon.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white rounded-xl text-xs font-bold hover:brightness-110"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
