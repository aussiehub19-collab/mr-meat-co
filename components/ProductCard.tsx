'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/config/site';
import { useCart } from '@/lib/cart';
import { SmartImage } from '@/components/SmartImage';
import { Plus, Check } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((i) => i.slug === product.slug);

  const formatPriceType = () => {
    if (!product.price_type) return 'AUD';
    switch (product.price_type) {
      case 'per_kg':
        return '/ kg';
      case 'per_pack':
        return '/ pack';
      case 'per_item':
        return '/ item';
      case 'fixed_box_price':
        return 'Box Price';
      case 'from_price':
        return 'From';
      case 'variable_weight':
        return 'Approx Wt.';
      default:
        return 'AUD';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      slug: product.slug,
      name: product.product_name || product.name,
      price: product.price || 0,
      category: product.main_category || product.category,
      image: product.main_image || product.image,
    });
  };

  const displayPrice = product.price !== null && product.price !== undefined
    ? `$${product.price.toFixed(2)}`
    : 'Inquire';

  return (
    <div className="group bg-[#1C1414] rounded-2xl border border-[#991B1B]/40 hover:border-red-500 overflow-hidden shadow-xl hover:shadow-red-950/40 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Frame */}
      <Link href={`/shop/${product.main_category || product.category}/${product.slug}/`} className="block relative aspect-[4/3] bg-white overflow-hidden p-2">
        <SmartImage
          src={product.main_image || product.image}
          alt={product.product_name || product.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md z-10 border border-red-400/40">
            {product.badge}
          </span>
        )}

        {/* Stock Status Pill */}
        {product.stock_status && product.stock_status !== 'In Stock' && (
          <span className="absolute top-3 right-3 bg-red-950/90 text-red-200 border border-red-500/50 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow z-10">
            {product.stock_status}
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-red-400 tracking-wider mb-1">
            <span>{product.subcategory || product.main_category || product.category}</span>
            {product.weight && <span className="text-gray-300 font-normal">{product.weight}</span>}
          </div>
          <Link href={`/shop/${product.main_category || product.category}/${product.slug}/`} className="block">
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-300 transition-colors line-clamp-2">
              {product.product_name || product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed">
            {product.short_description || product.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-[#991B1B]/30 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase tracking-wider">
              Price {formatPriceType()}
            </span>
            <span className="text-lg font-black text-white">
              {displayPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3.5 py-2.5 rounded-xl font-black text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
              inCart
                ? 'bg-red-900 hover:bg-red-800 text-white border border-red-500/40'
                : 'bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white hover:brightness-110 border border-red-400/30 shadow-md shadow-red-950/50'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added (+1)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
