'use client';

import React, { useState } from 'react';
import { SITE, CONTACT, FORMS } from '@/config/site';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const key = FORMS.web3formsKey;

    // Fallback if key not set
    if (!key || key.startsWith('YOUR-') || key === 'pending') {
      window.location.href = '/thank-you-contact/';
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
        window.location.href = '/thank-you-contact/';
      } else {
        window.location.href = '/thank-you-contact/';
      }
    } catch (err) {
      window.location.href = '/thank-you-contact/';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4 border-b border-[#991B1B]/40 pb-6 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase text-red-400 tracking-widest">
          Sydney Master Butcher Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-serif">
          Contact Our Workshop
        </h1>
        <p className="text-gray-300 text-sm leading-relaxed">
          Questions about custom primal cuts, delivery routes, or PayID payment verification? Contact our Alexandria butcher workshop team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Box */}
        <div className="lg:col-span-5 bg-[#141414] p-8 rounded-3xl border border-[#991B1B]/40 space-y-8 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-white">Get In Touch</h3>
            <p className="text-xs text-gray-400">
              We respond to all inquiries within 1 business hour during butcher operating hours.
            </p>
          </div>

          <div className="space-y-6 text-xs text-gray-200">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white">Workshop Address:</strong>
                <span>{CONTACT.address}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white">Phone Support:</strong>
                <span>{CONTACT.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white">Email:</strong>
                <span>{CONTACT.email}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-red-400">WhatsApp Direct:</strong>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-bold text-red-300"
                >
                  {CONTACT.whatsapp} (Fastest response)
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white">Butcher Hours:</strong>
                <span>Monday – Saturday: 6:00 AM – 5:00 PM AEST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#141414] p-8 sm:p-10 rounded-3xl border border-[#991B1B]/40 shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-serif text-white">
            Send Us a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="access_key" value={FORMS.web3formsKey} />
            <input type="hidden" name="subject" value="Contact Form Inquiry - Mr Meat & Co" />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Liam Smith"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#991B1B]/40 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="liam@example.com.au"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#991B1B]/40 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+61 400 000 000"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#991B1B]/40 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                How Can We Help You? *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Details regarding beef mince orders, custom steak cuts, delivery times, or PayID..."
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#991B1B]/40 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition-all flex items-center justify-center space-x-2 border border-red-500/30"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
