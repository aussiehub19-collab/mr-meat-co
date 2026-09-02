import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import { CONTACT } from '@/config/site';

export const metadata = {
  title: 'Order Received',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouOrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black font-serif text-white">
          Order Received
        </h1>
        <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          Thanks — we&rsquo;ve received your order. Our Sydney butcher team will send you an
          order confirmation by email or WhatsApp shortly, with payment details and
          instructions to complete your order. Your refrigerated cold-chain delivery is
          scheduled once payment is confirmed.
        </p>
      </div>

      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-left space-y-2 text-xs text-red-900 max-w-md mx-auto">
        <strong className="block font-bold">💡 Crypto 10% Discount Reminder:</strong>
        <p>
          If paying with crypto (BTC / USDT), complete payment to <strong>{CONTACT.email}</strong> or
          via your WhatsApp chat — your 10% discount is automatically verified on receipt. PayID and
          bank transfer are also accepted at the standard total.
        </p>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <a
          href={`https://wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat via WhatsApp</span>
        </a>

        <Link
          href="/shop/"
          className="inline-flex items-center space-x-2 bg-[#7A1C1C] hover:bg-[#5C1515] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
