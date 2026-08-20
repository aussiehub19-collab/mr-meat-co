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
  ShieldAlert,
  Snowflake,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface PetFoodCatalogueClientProps {
  initialSubcategory?: string;
}

const PROTEIN_TYPES = [
  'All Proteins',
  'Beef',
  'Chicken',
  'Kangaroo',
  'Turkey',
  'Mixed Protein',
];

const FORMAT_TYPES = [
  'All Formats',
  'Pet Mince',
  'Bones',
  'Frames',
  'Necks',
  'Feet',
  'Tails',
  'Liver',
  'Heart',
  'Kidney',
  'Mixed Offal',
  'Pet Pack',
];

const SUBCATEGORIES = [
  { slug: 'all', name: 'All Pet Food' },
  { slug: 'raw-mince', name: 'Raw Mince' },
  { slug: 'bones', name: 'Bones' },
  { slug: 'offal', name: 'Offal' },
  { slug: 'pet-packs', name: 'Pet Packs' },
];

export function PetFoodCatalogueClient({ initialSubcategory = 'all' }: PetFoodCatalogueClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedProtein, setSelectedProtein] = useState<string>('All Proteins');
  const [selectedFormat, setSelectedFormat] = useState<string>('All Formats');
  const [selectedStorage, setSelectedStorage] = useState<string>('All Storage');
  const [sortBy, setSortBy] = useState<'lowest' | 'highest' | 'popularity' | 'newest'>('popularity');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // All pet food products
  const petFoodProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => (p.main_category || p.category || '').toLowerCase() === 'pet-food' || p.pet_food_only
    );
  }, []);

  // Filtered & Sorted
  const filteredProducts = useMemo(() => {
    let list = petFoodProducts.filter((product) => {
      // 1. Subcategory filter
      if (selectedSubcategory !== 'all') {
        const subSlug = (product.subcategory || '')
          .toLowerCase()
          .replace(/ & /g, '-')
          .replace(/ \/ /g, '-')
          .replace(/ /g, '-');
        if (subSlug !== selectedSubcategory) {
          return false;
        }
      }

      // 2. Animal Protein
      if (selectedProtein !== 'All Proteins') {
        const protein = product.animal_protein || '';
        if (protein.toLowerCase() !== selectedProtein.toLowerCase()) {
          const name = (product.product_name || product.name).toLowerCase();
          if (!name.includes(selectedProtein.toLowerCase())) {
            return false;
          }
        }
      }

      // 3. Format type
      if (selectedFormat !== 'All Formats') {
        const format = (product.cut_type || product.cutType || product.product_type || (product.product_format || []).join(' ') || '').toLowerCase();
        const target = selectedFormat.toLowerCase();
        const name = (product.product_name || product.name).toLowerCase();
        if (!format.includes(target) && !name.includes(target)) {
          return false;
        }
      }

      // 4. Storage type
      if (selectedStorage !== 'All Storage') {
        const storage = (product.storage_type || 'Frozen').toLowerCase();
        if (storage !== selectedStorage.toLowerCase()) {
          return false;
        }
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (product.product_name || product.name).toLowerCase();
        const desc = (product.short_description || product.shortDescription || '').toLowerCase();
        const fullDesc = (product.full_description || product.description || '').toLowerCase();
        const sub = (product.subcategory || '').toLowerCase();
        const tags = (product.tags || []).join(' ').toLowerCase();

        const match =
          name.includes(q) ||
          desc.includes(q) ||
          fullDesc.includes(q) ||
          sub.includes(q) ||
          tags.includes(q);

        if (!match) return false;
      }

      return true;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      if (sortBy === 'lowest') return priceA - priceB;
      if (sortBy === 'highest') return priceB - priceA;
      if (sortBy === 'newest') {
        return (b.product_id || '').localeCompare(a.product_id || '');
      }
      return 0;
    });

    return list;
  }, [
    petFoodProducts,
    selectedSubcategory,
    selectedProtein,
    selectedFormat,
    selectedStorage,
    sortBy,
    searchQuery,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubcategory !== 'all') count++;
    if (selectedProtein !== 'All Proteins') count++;
    if (selectedFormat !== 'All Formats') count++;
    if (selectedStorage !== 'All Storage') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedSubcategory, selectedProtein, selectedFormat, selectedStorage, searchQuery]);

  const handleResetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedProtein('All Proteins');
    setSelectedFormat('All Formats');
    setSelectedStorage('All Storage');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Mandatory Pet Food Warning Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/50 to-[#1C1414] border-2 border-amber-500/70 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400/40 text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Regulatory Notice
                </span>
                <span className="text-xs font-bold text-amber-300">Strictly For Pets Only</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Pet Food Only — Not for Human Consumption
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                All raw pet mince, bones, offal, and pet packs in this category are formulated and prepared strictly for animal diets. Keep frozen until use, thaw in refrigeration, and wash hands/surfaces thoroughly after handling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-200 bg-amber-950/80 px-3.5 py-2 rounded-xl border border-amber-500/40 shrink-0">
            <Snowflake className="w-4 h-4 text-sky-400" />
            <span>Standard Storage: Frozen</span>
          </div>
        </div>
      </div>

      {/* Subcategory Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-red-900/40 pb-4">
        {SUBCATEGORIES.map((sub) => {
          const isActive = selectedSubcategory === sub.slug;
          const count = sub.slug === 'all'
            ? petFoodProducts.length
            : petFoodProducts.filter((p) => {
                const sSlug = (p.subcategory || '')
                  .toLowerCase()
                  .replace(/ & /g, '-')
                  .replace(/ \/ /g, '-')
                  .replace(/ /g, '-');
                return sSlug === sub.slug;
              }).length;

          return (
            <button
              key={sub.slug}
              type="button"
              onClick={() => setSelectedSubcategory(sub.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white shadow-lg shadow-red-950/50 border border-red-400/40'
                  : 'bg-[#1A1A1A] hover:bg-[#251A1A] text-gray-300 border border-red-900/30'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-black/30 text-white' : 'bg-black/40 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 bg-[#141414] p-5 rounded-2xl border border-red-900/40 sticky top-24">
          <div className="flex items-center justify-between border-b border-red-900/30 pb-3">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>Pet Food Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Search Pet Food
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Beef Mince, Marrow, Offal..."
                className="w-full bg-[#1A1A1A] border border-red-900/30 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Animal Protein Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Animal Protein
            </label>
            <div className="space-y-1">
              {PROTEIN_TYPES.map((protein) => (
                <button
                  key={protein}
                  type="button"
                  onClick={() => setSelectedProtein(protein)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedProtein === protein
                      ? 'bg-red-900/40 text-red-300 font-bold border border-red-500/40'
                      : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  <span>{protein}</span>
                  {selectedProtein === protein && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Format Type Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Format / Cut
            </label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {FORMAT_TYPES.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedFormat === fmt
                      ? 'bg-red-900/40 text-red-300 font-bold border border-red-500/40'
                      : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  <span>{fmt}</span>
                  {selectedFormat === fmt && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Storage Method
            </label>
            <div className="space-y-1">
              {['All Storage', 'Frozen', 'Fresh Chilled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStorage(st)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedStorage === st
                      ? 'bg-sky-950/60 text-sky-200 font-bold border border-sky-500/40'
                      : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  <span>{st}</span>
                  {selectedStorage === st && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 rounded-2xl border border-red-900/40">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 bg-[#1A1A1A] hover:bg-red-900/30 text-white rounded-xl text-xs font-bold border border-red-900/40 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              <span className="text-xs text-gray-300 font-semibold">
                Showing <strong className="text-white font-black">{filteredProducts.length}</strong> of{' '}
                {petFoodProducts.length} Pet Food Products
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label className="text-gray-400 font-medium whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1A1A1A] text-white border border-red-900/40 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-red-500"
              >
                <option value="popularity">Popular / Featured</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="newest">Product SKU / Code</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-bold mr-1">Active filters:</span>
              {selectedSubcategory !== 'all' && (
                <span className="bg-[#1A1A1A] text-red-400 border border-red-900/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>Subcategory: {selectedSubcategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedProtein !== 'All Proteins' && (
                <span className="bg-[#1A1A1A] text-red-400 border border-red-900/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>Protein: {selectedProtein}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProtein('All Proteins')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedFormat !== 'All Formats' && (
                <span className="bg-[#1A1A1A] text-red-400 border border-red-900/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>Format: {selectedFormat}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('All Formats')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStorage !== 'All Storage' && (
                <span className="bg-[#1A1A1A] text-sky-400 border border-sky-900/40 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>Storage: {selectedStorage}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedStorage('All Storage')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-[#1A1A1A] text-gray-200 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-400 hover:underline font-bold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#141414] rounded-2xl border border-red-900/40 p-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No pet food products found</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                No items match your active filters. Try adjusting your search query or reset the filters to see all available pet products.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white rounded-xl text-xs font-bold hover:brightness-110"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-red-900/60 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-900/30 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-red-500" />
                <span>Pet Food Filters</span>
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg bg-[#1A1A1A] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Subcategory
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SUBCATEGORIES.map((sub) => (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setSelectedSubcategory(sub.slug)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                      selectedSubcategory === sub.slug
                        ? 'bg-red-700 text-white border border-red-400/40'
                        : 'bg-[#1A1A1A] text-gray-300 border border-zinc-800'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Animal Protein */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Animal Protein
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROTEIN_TYPES.map((protein) => (
                  <button
                    key={protein}
                    type="button"
                    onClick={() => setSelectedProtein(protein)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                      selectedProtein === protein
                        ? 'bg-red-700 text-white border border-red-400/40'
                        : 'bg-[#1A1A1A] text-gray-300 border border-zinc-800'
                    }`}
                  >
                    {protein}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Storage Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All Storage', 'Frozen', 'Fresh Chilled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStorage(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-center transition-colors ${
                      selectedStorage === st
                        ? 'bg-sky-700 text-white border border-sky-400/40'
                        : 'bg-[#1A1A1A] text-gray-300 border border-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-red-900/30 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-[#1A1A1A] text-gray-300 hover:text-white rounded-xl text-xs font-bold border border-zinc-800"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white rounded-xl text-xs font-bold hover:brightness-110"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
