'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/config/site';
import { useCart } from '@/lib/cart';
import { SmartImage } from '@/components/SmartImage';
import { Plus, Check, Snowflake, ShieldAlert } from 'lucide-react';
import { useCustomStoreImages } from '@/lib/useCustomImages';

function getProductHref(product: Product): string {
  const cat = (product.main_category || product.category || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase().replace(/\s+/g, '-');
  if (cat === 'wholesale') {
    return `/wholesale/bulk-meat-orders/${sub}/${product.slug}/`;
  }
  if (cat === 'seafood') {
    return `/seafood/${sub}/${product.slug}/`;
  }
  if (cat === 'pet-food') {
    return `/pet-food/${sub}/${product.slug}/`;
  }
  return `/shop/${cat}/${product.slug}/`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((i) => i.slug === product.slug);
  const customProductImages = useCustomStoreImages('tmc_gdrive_product_images');

  const customProductImage = customProductImages[product.slug] || customProductImages[product.product_id] || null;
  const activeImage = customProductImage || product.main_image || product.image;

  const formatPriceUnit = () => {
    if (!product.price_type) return 'per item';
    switch (product.price_type) {
      case 'per_kg':
        return 'per kg';
      case 'per_pack':
        return 'per pack';
      case 'per_box':
        return 'per box';
      case 'per_item':
        return 'per item';
      case 'fixed_pack_price':
        return 'fixed pack price';
      case 'fixed_box_price':
        return 'fixed box price';
      case 'from_price':
        return 'from price';
      case 'variable_weight':
        return 'approx. weight';
      default:
        return product.price_type.replace(/_/g, ' ');
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
      image: activeImage,
    });
  };

  const displayPrice = product.price !== null && product.price !== undefined
    ? `$${product.price.toFixed(2)}`
    : 'Inquire';

  const isSeafood = (product.main_category || product.category) === 'seafood';
  const isPetFood = (product.main_category || product.category) === 'pet-food' || product.pet_food_only;
  const href = getProductHref(product);

  const storageType = product.storage_type || (isPetFood ? 'Frozen' : 'Fresh Chilled');
  const packSize = product.pack_size || product.weight || 'Standard Pack';
  const stockStatus = product.stock_status || 'In Stock';

  return (
    <div className="group bg-[#1C1414] rounded-2xl border border-[#991B1B]/40 hover:border-red-500 overflow-hidden shadow-xl hover:shadow-red-950/40 transition-all duration-300 flex flex-col h-full">
      {/* Product Image Frame */}
      <Link href={href} className="block relative aspect-[4/3] bg-white overflow-hidden p-2">
        <SmartImage
          src={activeImage}
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

        {/* Storage Type Pill */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow z-10 border flex items-center gap-1 ${
            storageType === 'Frozen'
              ? 'bg-sky-950/90 text-sky-200 border-sky-500/50'
              : storageType === 'Refrigerated'
              ? 'bg-purple-950/90 text-purple-200 border-purple-500/50'
              : storageType === 'To be confirmed'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
          }`}
        >
          {storageType === 'Frozen' && <Snowflake className="w-3 h-3 text-sky-300" />}
          {storageType}
        </span>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-red-400 tracking-wider mb-1">
            <span>{product.subcategory || product.main_category || product.category}</span>
            <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {stockStatus}
            </span>
          </div>

          <Link href={href} className="block">
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-red-300 transition-colors line-clamp-2">
              {product.product_name || product.name}
            </h3>
          </Link>

          {/* Pack Size & Storage info row */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-300">
            <span className="bg-[#141414] px-2 py-0.5 rounded border border-[#991B1B]/30 font-medium">
              Pack size: <strong className="text-white">{packSize}</strong>
            </span>
            <span className="bg-[#141414] px-2 py-0.5 rounded border border-[#991B1B]/30 font-medium text-gray-300">
              Storage: <span className="text-gray-200">{storageType}</span>
            </span>
          </div>

          {/* Allergen note for seafood */}
          {isSeafood && (
            <p className="text-[11px] text-amber-300/90 mt-2 flex items-center gap-1 leading-tight">
              <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Allergen: Contains Fish/Crustacea</span>
            </p>
          )}

          {/* Pet Food Only Warning for Pet Products */}
          {isPetFood && (
            <div className="mt-2 p-2 bg-amber-950/40 border border-amber-500/50 rounded-lg flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Pet Food Only — Not for Human Consumption</span>
            </div>
          )}

          <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
            {product.short_description || product.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-[#991B1B]/30 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium uppercase tracking-wider">
              {formatPriceUnit()}
            </span>
            <span className="text-lg font-black text-white">
              {displayPrice} <span className="text-xs text-gray-400 font-normal">AUD</span>
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
