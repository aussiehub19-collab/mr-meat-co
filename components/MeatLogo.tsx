import React from 'react';

interface MeatLogoProps {
  className?: string;
  size?: number;
}

export function MeatLogo({ className = "w-7 h-7", size }: MeatLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Outer Shield / Octagon Badge Base */}
      <polygon
        points="32,2 52,10 62,30 52,52 32,62 12,52 2,30 12,10"
        fill="url(#butcherBadgeBg)"
        stroke="#DC2626"
        strokeWidth="2"
      />
      <polygon
        points="32,5 49,12 58,30 49,49 32,58 15,49 6,30 15,12"
        fill="none"
        stroke="#EF4444"
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* CROSSED CLEAVER 1 (Top-Left to Bottom-Right) */}
      <g transform="rotate(35 32 32)">
        {/* Handle */}
        <rect x="29" y="38" width="6" height="18" rx="2" fill="#292524" stroke="#78716C" strokeWidth="0.8" />
        <circle cx="32" cy="43" r="1" fill="#E2E8F0" />
        <circle cx="32" cy="51" r="1" fill="#E2E8F0" />
        {/* Blade */}
        <path
          d="M24 10H38C39.5 10 40.5 11 40.5 12.5V34C40.5 36 39 37.5 37 37.5H24V10Z"
          fill="url(#cleaverMetal)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        {/* Beveled Edge */}
        <path d="M24 10V37.5H27.5V10H24Z" fill="#F8FAFC" />
        {/* Hanging Hole */}
        <circle cx="35.5" cy="15" r="2" fill="#1C1917" />
      </g>

      {/* CROSSED CLEAVER 2 (Top-Right to Bottom-Left) */}
      <g transform="rotate(-35 32 32)">
        {/* Handle */}
        <rect x="29" y="38" width="6" height="18" rx="2" fill="#292524" stroke="#78716C" strokeWidth="0.8" />
        <circle cx="32" cy="43" r="1" fill="#E2E8F0" />
        <circle cx="32" cy="51" r="1" fill="#E2E8F0" />
        {/* Blade */}
        <path
          d="M24 10H38C39.5 10 40.5 11 40.5 12.5V34C40.5 36 39 37.5 37 37.5H24V10Z"
          fill="url(#cleaverMetal)"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        {/* Beveled Edge */}
        <path d="M24 10V37.5H27.5V10H24Z" fill="#F8FAFC" />
        {/* Hanging Hole */}
        <circle cx="35.5" cy="15" r="2" fill="#1C1917" />
      </g>

      {/* CENTERPIECE: Iconic Steer / Bull Head Silhouette */}
      {/* Horns */}
      <path
        d="M12 20C18 20 22 26 25 30C28 27 30 25 32 25C34 25 36 27 39 30C42 26 46 20 52 20C48 27 43 32 39 33C37 39 35 46 32 49C29 46 27 39 25 33C21 32 16 27 12 20Z"
        fill="#1C1917"
        stroke="#F8FAFC"
        strokeWidth="1.2"
      />

      {/* Bull Head Face Crest */}
      <path
        d="M23 31C23 31 28 33 32 33C36 33 41 31 41 31C40 37 37 45 32 47C27 45 24 37 23 31Z"
        fill="#991B1B"
        stroke="#DC2626"
        strokeWidth="1.5"
      />

      {/* Horn Highlights (White/Silver Horns) */}
      <path
        d="M12 20C17 21 21 25 24 29"
        stroke="#F8FAFC"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M52 20C47 21 43 25 40 29"
        stroke="#F8FAFC"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Nose Ring */}
      <circle cx="32" cy="45" r="3" fill="none" stroke="#FACC15" strokeWidth="1.5" />

      {/* Star Accents */}
      <polygon points="32,11 33.2,14.5 36.5,14.5 33.8,16.5 34.8,20 32,17.8 29.2,20 30.2,16.5 27.5,14.5 30.8,14.5" fill="#FACC15" />

      {/* Gradients */}
      <defs>
        <linearGradient id="butcherBadgeBg" x1="2" y1="2" x2="62" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#450A0A" />
          <stop offset="0.5" stopColor="#7F1D1D" />
          <stop offset="1" stopColor="#09090B" />
        </linearGradient>

        <linearGradient id="cleaverMetal" x1="24" y1="10" x2="40.5" y2="37.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

