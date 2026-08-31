import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Thank You for Contacting Us',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black font-serif text-gray-900">
          Message Received!
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Thank you for contacting Mr Meat & Co Sydney. Our master butcher team will review your inquiry and reply within 1 business hour.
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/shop/"
          className="inline-flex items-center space-x-2 bg-[#7A1C1C] hover:bg-[#5C1515] text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          <span>Return to Meat Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
