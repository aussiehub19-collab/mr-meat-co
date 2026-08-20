import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata = {
  title: '404 - Cut Not Found | The Meat Cart',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-red-100 text-[#7A1C1C] rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase text-[#7A1C1C] tracking-widest">
          404 Error
        </span>
        <h1 className="text-3xl font-black font-serif text-gray-900">
          This Cut Is Off The Board
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          The page or butcher cut you were looking for could not be found. Explore our primary fresh meat categories below.
        </p>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/shop/"
          className="inline-flex items-center space-x-2 bg-[#7A1C1C] hover:bg-[#5C1515] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Meats</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-xs font-bold border border-gray-300"
        >
          <span>Homepage</span>
        </Link>
      </div>
    </div>
  );
}
