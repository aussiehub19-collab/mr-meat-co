'use client';

import React, { useState } from 'react';
import { Product, SHOP } from '@/config/site';
import { useCart } from '@/lib/cart';
import { Plus, Minus, ShoppingBag, Check, Bitcoin } from 'lucide-react';

export function ProductAddToCartForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(
      {
        slug: product.slug,
        name: product.product_name || product.name,
        price: product.price || 0,
        category: product.main_category || product.category,
        image: product.main_image || product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const hasPrice = product.price !== null && product.price !== undefined;
  const totalPrice = hasPrice
    ? `$${(product.price! * quantity).toFixed(2)} AUD`
    : 'Inquire for Market Price';
  const cryptoTotal = hasPrice
    ? product.price! * quantity * (1 - SHOP.cryptoDiscount / 100)
    : null;

  return (
    <div className="space-y-4 pt-4 border-t border-[#991B1B]/40">
      <div className="flex items-center space-x-4">
        <label className="text-xs font-bold text-gray-300 uppercase">Quantity Pack:</label>
        <div className="flex items-center space-x-2 border border-[#991B1B]/40 rounded-xl bg-[#0D0D0D] p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-lg bg-[#222] border border-[#991B1B]/40 text-white font-bold flex items-center justify-center hover:bg-[#333]"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-lg bg-[#222] border border-[#991B1B]/40 text-white font-bold flex items-center justify-center hover:bg-[#333]"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full py-4 px-6 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
          added
            ? 'bg-red-800 text-white border border-red-500/50'
            : 'bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white hover:shadow-red-950/60 border border-red-500/30'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5 text-red-200" />
            <span>Added {quantity}x to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 text-white" />
            <span>Add to Cart • {totalPrice}</span>
          </>
        )}
      </button>

      {cryptoTotal !== null && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-xs font-bold text-emerald-300">
          <Bitcoin className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            Pay with PayID or Crypto (BTC / USDT) and pay{' '}
            <span className="text-white">${cryptoTotal.toFixed(2)} AUD</span> — save {SHOP.cryptoDiscount}%
          </span>
        </div>
      )}
    </div>
  );
}
