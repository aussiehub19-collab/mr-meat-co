"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Pill-shaped click-to-copy tag. The whole pill is the click target.
 * Usage: <CopyField label="Order Ref" value="MMC-ABC123" mono />
 */
export function CopyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#991B1B]/40 bg-[#1C1212] hover:border-red-500/60 transition-colors text-xs"
    >
      <span className="text-gray-400 font-bold">{label}:</span>
      <span className={`text-white font-semibold ${mono ? "font-mono" : ""}`}>{value}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-gray-400" />
      )}
      <span className="sr-only">{copied ? "Copied" : "Copy to clipboard"}</span>
    </button>
  );
}
