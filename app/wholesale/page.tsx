'use client';

import React, { useState } from 'react';
import { SITE, FORMS } from '@/config/site';
import { Building2, Package, Truck, Percent, Send } from 'lucide-react';

export default function WholesalePage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const key = FORMS.web3formsKey;

    if (!key || key.startsWith('YOUR-') || key === 'pending') {
      window.location.href = '/thank-you-wholesale/';
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      const data = await response.json();
      if (response.status === 200 && data.success) {
        window.location.href = '/thank-you-wholesale/';
      } else {
        window.location.href = '/thank-you-wholesale/';
      }
    } catch (err) {
      window.location.href = '/thank-you-wholesale/';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Sydney Commercial & B2B Supply
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
          Wholesale Butchery & Bulk Supply
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Premium 100% Australian grass-fed beef mince, sub-primal cuts, and portioned meats for Sydney restaurants, burger establishments, hotels, and food service partners.
        </p>
      </div>

      {/* Wholesale Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
          <Package className="w-8 h-8 text-red-500" />
          <h3 className="font-bold text-white font-serif text-lg">Custom Grind Specifications</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Tailored fat ratios (80/20, 85/15, 75/25) ground fresh daily for smash burgers, meatball production, and bistro service.
          </p>
        </div>

        <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
          <Truck className="w-8 h-8 text-red-500" />
          <h3 className="font-bold text-white font-serif text-lg">Dedicated Cold-Chain Logistics</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Temperature-monitored refrigerated van delivery scheduled 6 days a week across Sydney Metro and Greater Western Sydney.
          </p>
        </div>

        <div className="p-6 bg-[#141414] rounded-2xl border border-[#991B1B]/40 space-y-3">
          <Percent className="w-8 h-8 text-red-500" />
          <h3 className="font-bold text-white font-serif text-lg">Tiered Volume Pricing</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Tiered discounts starting at 50kg+ weekly commitments. Additional 10% instant discount for PayID & Crypto settlement.
          </p>
        </div>
      </div>

      {/* Wholesale Form */}
      <div className="bg-[#141414] p-8 sm:p-12 rounded-3xl border border-[#991B1B]/40 shadow-xl max-w-3xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-bold font-serif text-white">
            Submit B2B Wholesale Inquiry
          </h3>
          <p className="text-xs text-gray-400">
            Our commercial sales director will reach out with wholesale pricing sheets within 2 business hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
          <input type="hidden" name="subject" value="Wholesale Inquiry - The Meat Cart" />
          <input type="hidden" name="from_name" value={SITE.name} />
          <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Business / Restaurant Name *
              </label>
              <input
                type="text"
                name="business_name"
                required
                placeholder="e.g. Surry Hills Bistro"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                ABN / ACN Number
              </label>
              <input
                type="text"
                name="abn"
                placeholder="12 345 678 910"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Chef Marco"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Work Email *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="marco@bistro.com.au"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Estimated Weekly Volume (kg) & Product Requirements *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="e.g. Looking for 100kg/week of 80/20 grass-fed beef mince and 30kg of beef ribeye steaks..."
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] hover:from-red-600 hover:to-red-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 border border-red-500/30"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Inquiry...' : 'Submit Wholesale Application'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
