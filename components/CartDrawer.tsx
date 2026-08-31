'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/cart';
import { SITE, SHOP, CONTACT } from '@/config/site';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, MessageSquare, Tag } from 'lucide-react';
import { SmartImage } from '@/components/SmartImage';
import Link from 'next/link';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    cryptoDiscountAmount,
    totalCount,
    isMinOrderMet,
    clearCart,
  } = useCart();

  const [paymentOption, setPaymentOption] = useState<'payid' | 'bank' | 'crypto'>('payid');

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    const itemsList = cart
      .map((i) => `• ${i.name} (${i.quantity}x) = $${(i.price * i.quantity).toFixed(2)} AUD`)
      .join('\n');

    const msg = `Hello ${SITE.name} Sydney!\nI would like to place an order:\n\n${itemsList}\n\nSubtotal: $${subtotal.toFixed(2)} AUD\nPayment Method Selected: ${paymentOption.toUpperCase()}\n\nPlease send PayID / Bank / Crypto invoice & confirm my Sydney delivery slot. Thank you!`;

    const url = `https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F7] text-[#1A1111] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#0D0D0D] text-white flex items-center justify-between border-b border-[#991B1B]/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-extrabold tracking-tight font-serif text-white">Your Cart ({totalCount})</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Min Order Alert Banner */}
          <div className={`p-3 text-xs sm:text-sm font-medium flex items-center space-x-2 ${isMinOrderMet ? 'bg-red-950/20 text-red-900 border-b border-red-200' : 'bg-red-900/10 text-red-900 border-b border-red-200'}`}>
            <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              {isMinOrderMet
                ? '✓ Min order threshold met! Free Sydney refrigerated express delivery included.'
                : `Add $${(SHOP.minOrder - subtotal).toFixed(2)} AUD more to meet the $${SHOP.minOrder} AUD minimum delivery threshold.`}
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
                <p className="text-gray-600 font-medium text-base">Your cart is currently empty.</p>
                <Link
                  href="/shop/"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-6 py-2.5 rounded-lg text-sm font-black hover:brightness-110 transition-all border border-red-400/40 shadow-sm"
                >
                  Browse Fresh Beef & Cuts
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.slug}
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex space-x-3 items-center"
                >
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                    {item.category === 'pet-food' && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        🐾 Pet Food Only (Not for Human Consumption)
                      </span>
                    )}
                    {item.category === 'seafood' && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded border border-sky-300">
                        🐟 Seafood (Allergen: Fish/Crustacea)
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">${item.price.toFixed(2)} AUD / unit</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="w-6 h-6 rounded bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="w-6 h-6 rounded bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 font-bold"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-red-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200 space-y-3">
              {/* Totals */}
              <div className="space-y-1.5 text-sm pt-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalCount} items):</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)} AUD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Sydney Express Refrigerated Delivery:</span>
                  <span className="font-bold text-red-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-red-700">
                    ${subtotal.toFixed(2)} AUD
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout button */}
              <div className="pt-2">
                <Link
                  href="/checkout/"
                  onClick={() => setIsCartOpen(false)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                    isMinOrderMet
                      ? 'bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:brightness-110 text-white shadow-red-950/40 cursor-pointer'
                      : 'bg-gray-200 text-gray-500 pointer-events-none'
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </Link>
                {!isMinOrderMet && (
                  <p className="text-center text-xs text-red-600 font-bold mt-2">
                    Add ${(SHOP.minOrder - subtotal).toFixed(2)} AUD more to proceed to checkout.
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <span>Direct Sydney Delivery</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-red-600 hover:underline font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
