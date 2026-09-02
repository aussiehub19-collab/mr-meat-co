'use client';

import React, { useState } from 'react';
import { SITE, CONTACT } from '@/config/site';
import { PhoneCall, Send, Mail, MapPin, Truck, CheckCircle2 } from 'lucide-react';

interface BulkOrderContactProps {
  productContext?: string;
  defaultCategory?: string;
}

export function BulkOrderContactSection({ productContext, defaultCategory }: BulkOrderContactProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, formType: 'bulk' }),
      });
    } catch {
      // Redirect to the thank-you page regardless.
    }
    window.location.href = '/thank-you-wholesale/';
  };

  return (
    <section className="bg-gradient-to-br from-[#1C1414] via-[#241717] to-[#141414] rounded-3xl border border-amber-500/40 p-6 sm:p-10 shadow-2xl space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-[#991B1B]/40 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Custom Bulk Inquiries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
            Need More Than This? Contact Us for a Custom Bulk-Order Price
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            Looking for multi-carcase orders, commercial volumes exceeding listed pack sizes, recurring restaurant orders, or community group supplies? Contact our butcher team for a custom quote.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={`tel:${CONTACT.phone}`}
            className="px-5 py-3 bg-[#120E0E] hover:bg-[#1E1E1E] text-white font-bold text-xs sm:text-sm rounded-xl border border-[#991B1B]/40 flex items-center justify-center gap-2 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="px-5 py-3 bg-[#120E0E] hover:bg-[#1E1E1E] text-white font-bold text-xs sm:text-sm rounded-xl border border-[#991B1B]/40 flex items-center justify-center gap-2 transition-all"
          >
            <Mail className="w-4 h-4 text-red-400" />
            <span>{CONTACT.email}</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Key Bulk Highlights */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white font-serif">
            How Custom Bulk Orders Work:
          </h3>
          <ul className="space-y-3 text-xs text-gray-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Direct Market Pricing:</strong> Tiered wholesale rates for orders above listed carton and animal share sizes.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Butchery Cutting Instructions:</strong> Specify preferred steak thicknesses, bone-in vs boneless cuts, and vacuum packing options upon order confirmation.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Refrigerated Logistics:</strong> Sydney metro cold-chain delivery or pre-arranged warehouse dispatch.
              </span>
            </li>
          </ul>

          <div className="p-4 bg-[#120E0E] rounded-xl border border-[#991B1B]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Cold-Chain Delivery & Lead Times</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Animal shares and bulk multi-box orders are cut fresh to order. Typical lead time is 3 to 7 business days from order confirmation to refrigerated delivery across Sydney.
            </p>
          </div>
        </div>

        {/* Quick Bulk Inquiry Form */}
        <div className="lg:col-span-7 bg-[#120E0E] p-6 sm:p-8 rounded-2xl border border-[#991B1B]/40 shadow-inner">
          <h3 className="text-lg font-bold text-white font-serif mb-1">
            Request a Custom Bulk Quote
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Fill in your volume requirements below and our team will respond within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="hidden"
              name="subject"
              value={`Bulk Order Inquiry${productContext ? ` - ${productContext}` : ''}`}
            />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. David Miller"
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#991B1B]/40 text-white rounded-xl text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="david@example.com.au"
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#991B1B]/40 text-white rounded-xl text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="0400 000 000"
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#991B1B]/40 text-white rounded-xl text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Suburb / Delivery Postcode *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Parramatta, 2150"
                  className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#991B1B]/40 text-white rounded-xl text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                Requested Products & Estimated Quantity (kg or units) *
              </label>
              <textarea
                name="message"
                required
                rows={3}
                defaultValue={
                  productContext
                    ? `I am interested in ordering larger quantities of: ${productContext}. Estimated volume needed:`
                    : ''
                }
                placeholder="e.g. Need 150kg bulk beef mince and 50kg lamb chops for an upcoming event..."
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#991B1B]/40 text-white rounded-xl text-xs focus:outline-none focus:border-amber-500 placeholder-gray-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 border border-amber-400/40"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending Request...' : 'Submit Bulk Order Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
