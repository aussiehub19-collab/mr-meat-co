'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SITE, CATEGORIES } from '@/config/site';
import { useCart } from '@/lib/cart';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { MeatLogo } from '@/components/MeatLogo';
import { Search, ShoppingBag, Menu, X, ChevronDown, FileText } from 'lucide-react';

export function Nav() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#140D0D]/95 text-white backdrop-blur-md border-b border-[#991B1B]/40 shadow-xl">
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#DC2626] via-[#B91C1C] to-[#450A0A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-950/80 group-hover:scale-105 transition-all border border-red-500/40 p-1.5">
              <MeatLogo className="w-full h-full text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider uppercase text-white block font-serif">
                {SITE.name}
              </span>
              <span className="text-[10px] uppercase font-extrabold text-[#EF4444] tracking-widest block">
                Craft Butcher Direct to Door
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7">
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/shop/"
                className="flex items-center space-x-1 font-bold text-sm text-gray-200 hover:text-red-400 py-2 transition-colors"
              >
                <span>Shop Meats</span>
                <ChevronDown className="w-4 h-4 text-red-500" />
              </Link>

              {/* Shop Mega Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-[#1C1212] rounded-2xl shadow-2xl border border-[#991B1B]/50 p-4 space-y-2 z-50 animate-in fade-in duration-150">
                  <div className="text-xs font-black uppercase text-red-400 tracking-wider mb-2 px-2">
                    Butcher Categories ({CATEGORIES.length})
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-red-900">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}/`}
                        onClick={() => setShopDropdownOpen(false)}
                        className="block p-2 rounded-xl hover:bg-[#281818] transition-colors group"
                      >
                        <div className="font-bold text-xs text-white group-hover:text-red-400">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-gray-400 line-clamp-1">
                          {cat.subcategories.join(', ')}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-red-900/30 flex items-center justify-end text-xs">
                    <Link
                      href="/shop/"
                      onClick={() => setShopDropdownOpen(false)}
                      className="font-bold text-red-400 hover:underline"
                    >
                      All Meats →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about/" className="font-bold text-sm text-gray-200 hover:text-red-400 transition-colors">
              About
            </Link>
            <Link href="/wholesale/" className="font-bold text-sm text-gray-200 hover:text-red-400 transition-colors">
              Wholesale
            </Link>
            <Link href="/faq/" className="font-bold text-sm text-gray-200 hover:text-red-400 transition-colors">
              FAQ
            </Link>
            <Link href="/contact/" className="font-bold text-sm text-gray-200 hover:text-red-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search bar & Cart */}
          <div className="flex items-center space-x-4">
            {/* Search Input (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                placeholder="Search scotch fillet, mince..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-3 py-2 bg-[#1C1212] border border-[#991B1B]/40 text-white rounded-full text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <Search className="w-4 h-4 text-red-500 absolute left-3 pointer-events-none" />
            </form>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white font-black rounded-xl hover:brightness-110 transition-all shadow-md shadow-red-950/60 flex items-center space-x-2 border border-red-400/30"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs font-black">Meat Cart</span>
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-red-700 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-red-600 shadow-md">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-200 hover:text-red-400"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1C1212] border-b border-[#991B1B]/40 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200 text-white">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search beef mince, lamb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[#281818] border border-[#991B1B]/50 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-red-500 absolute left-3 top-3 pointer-events-none" />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-bold text-gray-200">
            <div className="py-2 font-black text-xs uppercase text-red-400 tracking-wider">
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}/`}
                onClick={() => setMobileMenuOpen(false)}
                className="pl-3 py-2 border-l-2 border-red-600 text-white hover:bg-[#281818] rounded-r-lg"
              >
                {cat.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-red-900/30 flex flex-col space-y-2">
              <Link href="/about/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-red-400">
                About Us
              </Link>
              <Link href="/wholesale/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-red-400">
                Wholesale
              </Link>
              <Link href="/faq/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-red-400">
                FAQ
              </Link>
              <Link href="/contact/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-red-400">
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
