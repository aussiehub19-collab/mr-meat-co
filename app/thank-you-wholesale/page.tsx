import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Wholesale Inquiry Received',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouWholesalePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black font-serif text-white">
          Wholesale Enquiry Received
        </h1>
        <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
          Thanks for your wholesale enquiry with Mr Meat &amp; Co. Our team will review your requirements and reply by email with pricing and next steps within 1 business day.
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
