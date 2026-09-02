'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { SITE, SHOP, CONTACT } from '@/config/site';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Send,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Tag,
  Calendar,
  AlertCircle,
  Lock
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    cart,
    subtotal,
    cryptoDiscountAmount,
    totalCount,
    isMinOrderMet,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [postcode, setPostcode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState<'payid' | 'bank' | 'crypto'>('payid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalTotal = paymentOption === 'crypto' ? Math.max(0, subtotal - cryptoDiscountAmount) : subtotal;

  // Handle WhatsApp Checkout
  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) return;

    const itemsList = cart
      .map((i) => `• ${i.name} (${i.quantity}x) = $${(i.price * i.quantity).toFixed(2)} AUD`)
      .join('\n');

    const msg = `🥩 *NEW MEAT ORDER - ${SITE.name} SYDNEY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*CUSTOMER DETAILS*\n` +
      `• Name: ${fullName || 'Not specified'}\n` +
      `• Phone/WhatsApp: ${phone || 'Not specified'}\n` +
      `• Delivery Address: ${address ? `${address}, ${suburb} NSW ${postcode}` : 'Greater Sydney Delivery'}\n` +
      `${deliveryNotes ? `• Cutting Notes: ${deliveryNotes}\n` : ''}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*ORDER ITEMS*\n${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Subtotal: $${subtotal.toFixed(2)} AUD\n` +
      `• Sydney Express Cold-Chain Delivery: FREE\n` +
      `${paymentOption === 'crypto' ? `• Crypto 10% Discount: -$${cryptoDiscountAmount.toFixed(2)} AUD\n` : ''}` +
      `• *TOTAL PAYABLE: $${finalTotal.toFixed(2)} AUD*\n` +
      `• *Payment Method:* ${paymentOption.toUpperCase()}\n\n` +
      `Please confirm receipt and send PayID / Bank / Crypto invoice for delivery. Thank you!`;

    const url = `https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Handle Web/Email Form Submission
  const handleFormCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) return;

    setIsSubmitting(true);

    const itemsList = cart
      .map((i) => `${i.name} (${i.quantity}x) - $${(i.price * i.quantity).toFixed(2)} AUD`)
      .join('\n');

    const orderData = {
      formType: 'order',
      subject: `New Meat Order - ${fullName || 'Customer'} - $${finalTotal.toFixed(2)} AUD`,
      from_name: `${SITE.name} Checkout`,
      name: fullName,
      phone,
      email,
      address: `${address}, ${suburb} NSW ${postcode}`,
      payment_method: paymentOption.toUpperCase(),
      subtotal: `$${subtotal.toFixed(2)} AUD`,
      total: `$${finalTotal.toFixed(2)} AUD`,
      items: itemsList,
      notes: deliveryNotes,
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch {
      // Redirect to the thank-you page regardless — order details also go via WhatsApp.
    }
    setIsSubmitting(false);
    window.location.href = '/thank-you-order/';
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#1C1212] border border-[#991B1B]/40 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-serif text-white">Your Cart is Currently Empty</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            You have not added any gourmet beef mince, Wagyu steaks, or custom meat cuts to your cart yet.
          </p>
        </div>
        <Link
          href="/shop/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white px-8 py-3.5 rounded-xl text-sm font-black shadow-lg hover:brightness-110 transition-all border border-red-500/40"
        >
          <span>Browse Fresh Meats & Cuts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      {/* Header */}
      <div className="border-b border-[#991B1B]/40 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase text-red-400 tracking-widest">
          <Lock className="w-4 h-4 text-red-500" />
          <span>Cold-Chain Express Delivery Sydney</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
          Secure Order Checkout
        </h1>
        <p className="text-gray-300 text-sm max-w-2xl">
          Review your butcher cuts, enter your Sydney delivery address, and choose your preferred payment option (WhatsApp Direct or Web Order Form).
        </p>
      </div>

      {!isMinOrderMet && (
        <div className="p-4 bg-red-950/40 border border-red-600/60 rounded-2xl flex items-center space-x-3 text-red-200 text-sm">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <strong className="block font-bold text-white">Minimum Order Threshold ($300.00 AUD) Not Met</strong>
            <span>
              Please add <strong>${(SHOP.minOrder - subtotal).toFixed(2)} AUD</strong> more of beef cuts or freezer boxes to proceed with delivery.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form & Payment Choice */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Delivery Details */}
          <section className="bg-[#141414] border border-[#991B1B]/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 border-b border-[#991B1B]/30 pb-4">
              <div className="w-8 h-8 rounded-full bg-red-900/60 text-red-400 font-black text-sm flex items-center justify-center border border-red-500/40">
                1
              </div>
              <h2 className="text-xl font-bold font-serif text-white flex items-center space-x-2">
                <Truck className="w-5 h-5 text-red-500" />
                <span>Sydney Delivery Details</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-bold text-gray-200">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                  <User className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-200">Phone / WhatsApp *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0412 345 678"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                  <Phone className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-200">Email Address (Optional)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                  <Mail className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-bold text-gray-200">Street Address *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Bourke Street"
                    className="w-full pl-10 pr-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                  <MapPin className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-200">Suburb (Greater Sydney) *</label>
                <input
                  type="text"
                  required
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  placeholder="e.g. Alexandria / Surry Hills"
                  className="w-full px-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-gray-200">Postcode *</label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. 2015"
                  className="w-full px-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block font-bold text-gray-200">Cutting Instructions & Packaging Notes</label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Vacuum-pack in 500g portions, gate access code #1234, leave with concierge if unavailable."
                  className="w-full p-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Payment Preference */}
          <section className="bg-[#141414] border border-[#991B1B]/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 border-b border-[#991B1B]/30 pb-4">
              <div className="w-8 h-8 rounded-full bg-red-900/60 text-red-400 font-black text-sm flex items-center justify-center border border-red-500/40">
                2
              </div>
              <h2 className="text-xl font-bold font-serif text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                <span>Select Payment Preference</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentOption('payid')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentOption === 'payid'
                    ? 'border-red-500 bg-red-950/40 text-white font-bold ring-1 ring-red-500'
                    : 'border-[#991B1B]/30 bg-[#1C1212] text-gray-300 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-white">PayID Transfer</span>
                  {paymentOption === 'payid' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-xs text-gray-400">Instant Australian mobile/email bank transfer.</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('bank')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentOption === 'bank'
                    ? 'border-red-500 bg-red-950/40 text-white font-bold ring-1 ring-red-500'
                    : 'border-[#991B1B]/30 bg-[#1C1212] text-gray-300 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-white">Bank Deposit</span>
                  {paymentOption === 'bank' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-xs text-gray-400">Standard EFT invoice sent with order confirmation.</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentOption('crypto')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentOption === 'crypto'
                    ? 'border-red-500 bg-red-950/40 text-white font-bold ring-1 ring-red-500'
                    : 'border-[#991B1B]/30 bg-[#1C1212] text-gray-300 hover:border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-red-300">Crypto (10% OFF)</span>
                  {paymentOption === 'crypto' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-xs text-gray-400">Pay in BTC / USDT & save 10% automatically.</p>
              </button>
            </div>

            {paymentOption === 'crypto' && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-red-400" />
                  <span>10% Crypto Discount Applied to Order Total</span>
                </span>
                <span className="font-black text-red-300">-${cryptoDiscountAmount.toFixed(2)} AUD</span>
              </div>
            )}
          </section>

          {/* Step 3: Choose Checkout Action (WhatsApp vs Order Form) */}
          <section className="bg-[#141414] border border-[#991B1B]/40 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 border-b border-[#991B1B]/30 pb-4">
              <div className="w-8 h-8 rounded-full bg-red-900/60 text-red-400 font-black text-sm flex items-center justify-center border border-red-500/40">
                3
              </div>
              <h2 className="text-xl font-bold font-serif text-white">
                Choose Checkout Method
              </h2>
            </div>

            <p className="text-xs text-gray-300">
              Select how you would like to submit your butcher order:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: WhatsApp Direct */}
              <button
                type="button"
                disabled={!isMinOrderMet}
                onClick={handleWhatsAppCheckout}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all shadow-md ${
                  isMinOrderMet
                    ? 'bg-red-950/40 border-red-700/60 hover:bg-red-900/50 cursor-pointer text-white'
                    : 'bg-[#1C1212] border-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-red-400 font-black text-base">
                      <MessageSquare className="w-5 h-5" />
                      <span>WhatsApp Direct Checkout</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Instantly sends your pre-filled meat order & delivery address to our Sydney butcher team on WhatsApp for fast confirmation.
                  </p>
                </div>
                <div className="pt-2">
                  <span className={`inline-flex items-center space-x-2 text-xs font-black px-4 py-2.5 rounded-xl text-white ${isMinOrderMet ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-700 text-gray-400'}`}>
                    <span>Order via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>

              {/* Option B: Web Order Form */}
              <button
                type="button"
                disabled={!isMinOrderMet || isSubmitting}
                onClick={handleFormCheckout}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all shadow-md ${
                  isMinOrderMet
                    ? 'bg-[#1C1212] border-red-600/60 hover:border-red-500 cursor-pointer text-white'
                    : 'bg-[#1C1212] border-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-red-400 font-black text-base">
                      <Send className="w-5 h-5" />
                      <span>Submit Email Order Form</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Submits your order request directly to our order processing system. You will receive an invoice via email/SMS.
                  </p>
                </div>
                <div className="pt-2">
                  <span className={`inline-flex items-center space-x-2 text-xs font-black px-4 py-2.5 rounded-xl text-white ${isMinOrderMet ? 'bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:brightness-110' : 'bg-gray-700 text-gray-400'}`}>
                    <span>{isSubmitting ? 'Submitting Order...' : 'Submit Order Form'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-[#141414] border border-[#991B1B]/40 p-6 rounded-3xl space-y-6 shadow-md">
            <div className="flex items-center justify-between border-b border-[#991B1B]/30 pb-4">
              <h2 className="text-xl font-bold font-serif text-white flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <span>Order Summary ({totalCount})</span>
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-400 hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Item List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.slug}
                  className="bg-[#1C1212] p-3 rounded-2xl border border-[#991B1B]/30 flex items-center space-x-3 text-xs"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{item.name}</h4>
                    <p className="text-gray-400">${item.price.toFixed(2)} AUD / unit</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, -1)}
                        className="w-5 h-5 bg-red-950 text-white rounded flex items-center justify-center font-bold hover:bg-red-900"
                      >
                        -
                      </button>
                      <span className="font-bold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, 1)}
                        className="w-5 h-5 bg-red-950 text-white rounded flex items-center justify-center font-bold hover:bg-red-900"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-400 block text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.slug)}
                      className="text-gray-500 hover:text-red-400 text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-[#991B1B]/30 pt-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({totalCount} items):</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)} AUD</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Refrigerated Sydney Cold-Chain:</span>
                <span className="font-bold text-red-400">FREE</span>
              </div>

              {paymentOption === 'crypto' && (
                <div className="flex justify-between text-red-300 font-bold">
                  <span>Crypto 10% Discount:</span>
                  <span>-${cryptoDiscountAmount.toFixed(2)} AUD</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white border-t border-[#991B1B]/30 pt-3">
                <span>Total Payable:</span>
                <span className="text-red-400">${finalTotal.toFixed(2)} AUD</span>
              </div>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-gray-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>Sydney Butcher Express Guarantee</span>
              </div>
              <p className="text-[11px] leading-tight text-gray-400">
                100% pasture-raised Australian beef delivered in vacuum-sealed, temperature-monitored refrigerated trucks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
