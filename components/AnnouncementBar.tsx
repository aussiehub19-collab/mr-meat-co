'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Percent, PhoneCall } from 'lucide-react';

const announcements = [
  { icon: Truck, text: 'FREE Cold-Chain Refrigerated Delivery on All Sydney Orders ($300 Minimum Order)' },
  { icon: Percent, text: 'Instant 10% Discount when paying via PayID or Crypto (BTC / USDT)' },
  { icon: ShieldCheck, text: '100% Australian Pasture-Raised & Hormone-Free Beef Guaranteed' },
  { icon: PhoneCall, text: 'Same-Day Butcher Dispatch Available Across Greater Sydney' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = announcements[index].icon;

  return (
    <div className="bg-[#7F1D1D] text-[#FEF2F2] py-2 px-4 text-xs sm:text-sm font-semibold border-b border-[#991B1B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center justify-center space-x-2 w-full text-center transition-all duration-300">
          <CurrentIcon className="w-4 h-4 text-red-300 shrink-0" />
          <span className="tracking-wide font-bold">{announcements[index].text}</span>
        </div>
      </div>
    </div>
  );
}
