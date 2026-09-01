'use client';

import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '@/config/site';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, X, RotateCcw, ChevronDown, Check, SlidersHorizontal, Flame } from 'lucide-react';

interface ShopFilterClientProps {
  initialCategory?: string;
}

// Wholesale / bulk-share products live in their own /wholesale/ section and must
// never appear in the retail shop (different pricing model + checkout).
const RETAIL_PRODUCTS = PRODUCTS.filter(
  (p) => (p.main_category || p.category || '').toLowerCase() !== 'wholesale' && !p.is_wholesale
);

export function ShopFilterClient({ initialCategory = 'all' }: ShopFilterClientProps) {
  const [prevInitialCategory, setPrevInitialCategory] = useState<string>(initialCategory);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedCutStyle, setSelectedCutStyle] = useState<string>('all');
  const [selectedProvenance, setSelectedProvenance] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  if (prevInitialCategory !== initialCategory) {
    setPrevInitialCategory(initialCategory);
    setSelectedCategory(initialCategory);
  }

  // Reset subcategory when main category changes
  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedSubcategory('all');
  };

  // Get current active category object
  const currentCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return CATEGORIES.find((c) => c.slug === selectedCategory) || null;
  }, [selectedCategory]);

  // Compute available subcategories for the selected category or overall
  const availableSubcategories = useMemo(() => {
    if (currentCategoryObj) {
      return currentCategoryObj.subcategories;
    }
    // Aggregate unique subcategories across all products
    const subs = new Set<string>();
    RETAIL_PRODUCTS.forEach((p) => {
      if (p.subcategory) subs.add(p.subcategory);
    });
    return Array.from(subs);
  }, [currentCategoryObj]);

  // Filter products based on all filter parameters
  const filteredProducts = useMemo(() => {
    return RETAIL_PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Subcategory Filter
      if (selectedSubcategory !== 'all') {
        const subLower = selectedSubcategory.toLowerCase();
        const primaryMatch = product.subcategory && product.subcategory.toLowerCase() === subLower;
        const secondaryMatch = Array.isArray(product.secondary_subcategories) && product.secondary_subcategories.some((s) => s.toLowerCase() === subLower);
        if (!primaryMatch && !secondaryMatch) {
          return false;
        }
      }

      // 3. Cut & Cooking Style Filter
      if (selectedCutStyle !== 'all') {
        const text = `${product.name} ${product.subcategory} ${product.category} ${product.description} ${product.shortDescription}`.toLowerCase();
        if (selectedCutStyle === 'steaks' && !text.includes('steak') && !text.includes('cutlet') && !text.includes('ribeye') && !text.includes('porterhouse') && !text.includes('rump') && !text.includes('fillet')) {
          return false;
        }
        if (selectedCutStyle === 'mince' && !text.includes('mince') && !text.includes('diced') && !text.includes('stir-fry') && !text.includes('ground')) {
          return false;
        }
        if (selectedCutStyle === 'slowcook' && !text.includes('slow') && !text.includes('roast') && !text.includes('brisket') && !text.includes('osso buco') && !text.includes('shank') && !text.includes('chuck')) {
          return false;
        }
        if (selectedCutStyle === 'bbq' && !text.includes('bbq') && !text.includes('rib') && !text.includes('skewer') && !text.includes('burger') && !text.includes('patties') && !text.includes('sausage') && !text.includes('grill')) {
          return false;
        }
        if (selectedCutStyle === 'ready' && !text.includes('schnitzel') && !text.includes('crumbed') && !text.includes('marinated') && !text.includes('kebab') && !text.includes('ready to cook')) {
          return false;
        }
        if (selectedCutStyle === 'cured' && !text.includes('bacon') && !text.includes('ham') && !text.includes('salami') && !text.includes('jerky') && !text.includes('smoked') && !text.includes('cured')) {
          return false;
        }
        if (selectedCutStyle === 'boxes' && product.category !== 'meat-boxes' && !text.includes('box') && !text.includes('pack') && !text.includes('bundle')) {
          return false;
        }
        if (selectedCutStyle === 'pet' && product.category !== 'pet-food' && !text.includes('pet') && !text.includes('marrow') && !text.includes('barf')) {
          return false;
        }
      }

      // 4. Craft Provenance & Attribute Filter
      if (selectedProvenance !== 'all') {
        const text = `${product.name} ${product.badge || ''} ${product.description} ${product.shortDescription}`.toLowerCase();
        if (selectedProvenance === 'grass-fed' && !text.includes('grass-fed') && !text.includes('pasture-raised') && !text.includes('grass fed') && !text.includes('pasture raised')) {
          return false;
        }
        if (selectedProvenance === 'free-range' && !text.includes('free-range') && !text.includes('free range')) {
          return false;
        }
        if (selectedProvenance === 'wagyu' && !text.includes('wagyu') && !text.includes('dry-aged') && !text.includes('premium cut') && !text.includes('tenderloin')) {
          return false;
        }
        if (selectedProvenance === 'gluten-free' && !text.includes('gluten-free') && !text.includes('preservative-free') && !text.includes('100% natural') && !text.includes('zero preservative')) {
          return false;
        }
        if (selectedProvenance === 'high-protein' && !text.includes('high protein') && !text.includes('lean') && !text.includes('prep') && !text.includes('kangaroo') && !text.includes('fitness')) {
          return false;
        }
      }

      // 5. Price Range Filter
      if (selectedPriceRange !== 'all') {
        const pPrice = product.price ?? 0;
        if (product.price === null) return false;
        if (selectedPriceRange === 'under-30' && pPrice >= 30) return false;
        if (selectedPriceRange === '30-60' && (pPrice < 30 || pPrice > 60)) return false;
        if (selectedPriceRange === 'over-60' && pPrice <= 60) return false;
      }

      // 6. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const fullText = `${product.name} ${product.category} ${product.subcategory || ''} ${product.description} ${product.shortDescription}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, selectedSubcategory, selectedCutStyle, selectedProvenance, selectedPriceRange, searchQuery, sortBy]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSubcategory !== 'all') count++;
    if (selectedCutStyle !== 'all') count++;
    if (selectedProvenance !== 'all') count++;
    if (selectedPriceRange !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedSubcategory, selectedCutStyle, selectedProvenance, selectedPriceRange, searchQuery]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedCutStyle('all');
    setSelectedProvenance('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: RETAIL_PRODUCTS.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.slug] = RETAIL_PRODUCTS.filter((p) => p.category === cat.slug).length;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. TOP MOBILE & DESKTOP CATEGORY NAV (HORIZONTALLY SCROLLABLE) */}
      <div className="bg-[#1C1414] p-3 sm:p-4 rounded-2xl border border-[#991B1B]/40 shadow-xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Butcher Categories ({CATEGORIES.length})
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-300">
            {filteredProducts.length} Items Available
          </span>
        </div>

        <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-red-900/40 flex-nowrap">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`shrink-0 flex-shrink-0 min-w-max px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all shadow-sm flex items-center space-x-2 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white border border-red-400/50 shadow-md shadow-red-950/50'
                : 'bg-[#281818] hover:bg-[#382020] text-gray-200 border border-[#991B1B]/40'
            }`}
          >
            <span>All Meats</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold font-mono shrink-0 ${
              selectedCategory === 'all' ? 'bg-white text-red-900' : 'bg-[#120D0D] text-red-400 border border-red-900/40'
            }`}>
              {categoryCounts.all}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`shrink-0 flex-shrink-0 min-w-max px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white border border-red-400/50 shadow-md shadow-red-950/50'
                    : 'bg-[#281818] hover:bg-[#382020] text-gray-200 border border-[#991B1B]/40'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold font-mono shrink-0 ${
                  isActive ? 'bg-white text-red-900' : 'bg-[#120D0D] text-red-400 border border-red-900/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SEARCH BAR & CONTROLS ROW */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#1C1414] p-4 rounded-2xl border border-[#991B1B]/40">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Scotch Fillet, Beef Mince, Lamb Cutlets, Schnitzel..."
            className="w-full pl-11 pr-10 py-3 bg-[#120D0D] border border-[#991B1B]/40 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all"
          />
          <Search className="w-4 h-4 text-red-500 absolute left-4 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center space-x-3">
          {/* Sort Selector */}
          <div className="relative flex-1 md:flex-initial min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-bold py-3 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-red-500"
            >
              <option value="featured">Sort: Butcher Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <ChevronDown className="w-4 h-4 text-red-500 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center space-x-2 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white font-black px-4 py-3 rounded-xl text-xs shadow-md border border-red-400/30"
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
            <span>Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* 3. ACTIVE FILTER CHIPS BAR */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-[#281818] p-3 rounded-xl border border-[#991B1B]/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 mr-1">
            Active Filters:
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
              <button type="button" onClick={() => setSelectedCategory('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSubcategory !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Sub: {selectedSubcategory}</span>
              <button type="button" onClick={() => setSelectedSubcategory('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCutStyle !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Cut: {selectedCutStyle}</span>
              <button type="button" onClick={() => setSelectedCutStyle('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedProvenance !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Claim: {selectedProvenance}</span>
              <button type="button" onClick={() => setSelectedProvenance('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPriceRange !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Price: {selectedPriceRange}</span>
              <button type="button" onClick={() => setSelectedPriceRange('all')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery.trim() && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs font-semibold rounded-lg">
              <span>Keyword: &quot;{searchQuery}&quot;</span>
              <button type="button" onClick={() => setSearchQuery('')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="ml-auto flex items-center space-x-1 text-[11px] text-red-400 hover:underline font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* 4. MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTER PANEL */}
        <aside className="hidden lg:block space-y-6 bg-[#1C1414] p-5 rounded-2xl border border-[#991B1B]/40 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#991B1B]/30">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-red-500" />
              <h2 className="font-bold text-white text-sm font-serif">Refine Meat Cuts</h2>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-red-400 hover:underline font-bold"
              >
                Clear ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Filter Group 1: Subcategories */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              {currentCategoryObj ? `${currentCategoryObj.name} Subcategories` : 'Popular Subcategories'}
            </label>
            <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedSubcategory === 'all'
                    ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                    : 'text-gray-300 hover:bg-[#281818]'
                }`}
              >
                <span>All Subcategories</span>
                {selectedSubcategory === 'all' && <Check className="w-3 h-3 text-red-400" />}
              </button>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedSubcategory.toLowerCase() === sub.toLowerCase()
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{sub}</span>
                  {selectedSubcategory.toLowerCase() === sub.toLowerCase() && (
                    <Check className="w-3 h-3 text-red-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 2: Cut & Cooking Style */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Cut & Cooking Style
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Cuts & Styles' },
                { id: 'steaks', label: '🥩 Steaks & Cutlets' },
                { id: 'mince', label: '🍳 Mince, Diced & Stir-Fry' },
                { id: 'slowcook', label: '🍲 Slow Cook & Roasts' },
                { id: 'bbq', label: '🔥 BBQ, Ribs & Skewers' },
                { id: 'ready', label: '🥖 Crumbed & Ready-to-Cook' },
                { id: 'cured', label: '🥓 Smoked Bacon & Deli' },
                { id: 'boxes', label: '📦 Meat Boxes & Bundles' },
                { id: 'pet', label: '🐶 BARF Raw Pet Food' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedCutStyle(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCutStyle === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedCutStyle === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 3: Provenance & Attributes */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Craft Provenance & Attributes
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Attributes' },
                { id: 'grass-fed', label: '🌿 100% Grass-Fed / Pasture-Raised' },
                { id: 'free-range', label: '🐔 Free-Range Poultry' },
                { id: 'wagyu', label: '🌟 Wagyu & Premium MB5+' },
                { id: 'gluten-free', label: '🌾 Gluten-Free / Preservative-Free' },
                { id: 'high-protein', label: '💪 High Protein / Meal Prep' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProvenance(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedProvenance === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedProvenance === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Group 4: Price Bucket */}
          <div className="space-y-2 pt-3 border-t border-[#991B1B]/30">
            <label className="text-xs font-extrabold uppercase tracking-wider text-red-400 block">
              Price Range (AUD)
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-30', label: 'Under $30 (Everyday Cuts)' },
                { id: '30-60', label: '$30 – $60 (Roasts & Steaks)' },
                { id: 'over-60', label: '$60+ (Meat Boxes & Wagyu)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPriceRange(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedPriceRange === item.id
                      ? 'bg-red-950/60 text-red-200 border border-red-600/50'
                      : 'text-gray-300 hover:bg-[#281818]'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedPriceRange === item.id && <Check className="w-3 h-3 text-red-400" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID CONTAINER */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#1C1414] p-10 text-center rounded-2xl border border-[#991B1B]/40 space-y-4">
              <div className="w-12 h-12 bg-[#281818] border border-[#991B1B]/40 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-serif">No Meat Cuts Match Your Filter Criteria</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                Try resetting or relaxing your category, subcategory, or price filters to view our full selection of 100% Australian grass-fed beef and fresh meats.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md border border-red-400/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE SLIDE-OVER FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#1C1414] border-l border-[#991B1B]/40 h-full overflow-y-auto p-6 flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#991B1B]/30">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-red-500" />
                  <h3 className="font-black text-white text-base font-serif">Meat Filters</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Subcategories */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Subcategory</label>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                      selectedSubcategory === 'all'
                        ? 'bg-[#B91C1C] text-white font-bold'
                        : 'bg-[#281818] text-gray-200'
                    }`}
                  >
                    All Subcategories
                  </button>
                  {availableSubcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                        selectedSubcategory.toLowerCase() === sub.toLowerCase()
                          ? 'bg-[#B91C1C] text-white font-bold'
                          : 'bg-[#281818] text-gray-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Cut & Style */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Cut & Style</label>
                <select
                  value={selectedCutStyle}
                  onChange={(e) => setSelectedCutStyle(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Cuts & Styles</option>
                  <option value="steaks">🥩 Steaks & Cutlets</option>
                  <option value="mince">🍳 Mince, Diced & Stir-Fry</option>
                  <option value="slowcook">🍲 Slow Cook & Roasts</option>
                  <option value="bbq">🔥 BBQ, Ribs & Skewers</option>
                  <option value="ready">🥖 Crumbed & Ready-to-Cook</option>
                  <option value="cured">🥓 Smoked Bacon & Deli</option>
                  <option value="boxes">📦 Meat Boxes & Bundles</option>
                  <option value="pet">🐶 BARF Raw Pet Food</option>
                </select>
              </div>

              {/* Mobile Provenance */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Craft Attributes</label>
                <select
                  value={selectedProvenance}
                  onChange={(e) => setSelectedProvenance(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Attributes</option>
                  <option value="grass-fed">🌿 100% Grass-Fed / Pasture-Raised</option>
                  <option value="free-range">🐔 Free-Range Poultry</option>
                  <option value="wagyu">🌟 Wagyu & Premium MB5+</option>
                  <option value="gluten-free">🌾 Gluten-Free / Preservative-Free</option>
                  <option value="high-protein">💪 High Protein / Meal Prep</option>
                </select>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-red-400 block">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-[#120D0D] border border-[#991B1B]/40 text-white text-xs p-3 rounded-xl"
                >
                  <option value="all">All Prices</option>
                  <option value="under-30">Under $30</option>
                  <option value="30-60">$30 – $60</option>
                  <option value="over-60">$60+</option>
                </select>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className="pt-4 border-t border-[#991B1B]/30 flex gap-2">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 bg-[#281818] text-white py-3 rounded-xl text-xs font-bold border border-[#991B1B]/30"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[2] bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white py-3 rounded-xl text-xs font-black shadow-md border border-red-400/30"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
