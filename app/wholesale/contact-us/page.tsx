'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE, CONTACT, FORMS } from '@/config/site';
import { WholesaleNav } from '@/components/WholesaleNav';
import { PhoneCall, Mail, MapPin, Truck, Send, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

export default function WholesaleContactPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/wholesale/" className="hover:text-white transition-colors">Wholesale</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-red-400 font-semibold">Custom Bulk Order Inquiries</span>
      </nav>

      {/* Wholesale Nav Hierarchy */}
      <WholesaleNav />

      {/* Header */}
      <div className="bg-[#141414] rounded-3xl border border-[#991B1B]/40 p-6 sm:p-10 shadow-2xl relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>Large Orders & Multi-Carcase Supply</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
          Custom Bulk Meat Order Inquiries
        </h1>

        <p className="text-sm text-gray-300 leading-relaxed">
          For quantities larger than the listed options on our store, customized portion cuts, recurring commercial deliveries, or special livestock animal share requests, reach out to our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#141414] p-6 rounded-2xl border border-[#991B1B]/40 space-y-4">
            <h3 className="font-bold text-white font-serif text-lg">Direct Butcher Contact</h3>
            <div className="space-y-3 text-xs text-gray-300">
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl hover:border-red-500 border border-transparent transition-all"
              >
                <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Phone</span>
                  <span className="font-bold text-white">{CONTACT.phone}</span>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl hover:border-red-500 border border-transparent transition-all"
              >
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Email</span>
                  <span className="font-bold text-white">{CONTACT.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl">
                <Truck className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Logistics</span>
                  <span className="font-bold text-white">Refrigerated Cold-Chain Van</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] p-6 rounded-2xl border border-[#991B1B]/40 space-y-3 text-xs text-gray-300">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Ordering Guidelines</h4>
            <p className="leading-relaxed">
              Standard turnaround time for custom bulk butcher specifications is 3 to 7 business days from order confirmation.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8 bg-[#141414] p-6 sm:p-10 rounded-3xl border border-[#991B1B]/40 shadow-xl space-y-6">
          <h2 className="text-xl font-bold font-serif text-white">
            Send Large Order Requirements
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
            <input type="hidden" name="subject" value="Large Bulk Order Inquiry - Mr Meat & Co" />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Business / Group Name (Optional)
                </label>
                <input
                  type="text"
                  name="business"
                  placeholder="e.g. Club / Community / Family"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@example.com.au"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="0400 000 000"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Estimated Total Volume (kg) *
                </label>
                <input
                  type="text"
                  name="volume"
                  required
                  placeholder="e.g. 50kg, 100kg+, 2 Whole Lambs"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Delivery Suburb / Postcode *
                </label>
                <input
                  type="text"
                  name="suburb"
                  required
                  placeholder="e.g. Castle Hill, 2154"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Detailed Product Requirements & Cutting Preferences *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Specify the meat cuts, animal shares, packaging requirements (bulk vs vac-packed in pairs), and target delivery date..."
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#991B1B]/40 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 placeholder-gray-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 border border-amber-500/30"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Inquiry...' : 'Submit Custom Bulk Order Request'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
