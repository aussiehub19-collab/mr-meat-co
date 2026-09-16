"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";

/**
 * Pre-filled wa.me link the admin clicks to open WhatsApp with the message
 * ready to send, plus a "copy message" fallback for desktop/manual paste.
 */
export function WhatsAppSendPanel({
  link,
  messageText,
}: {
  link: string;
  messageText: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="p-4 bg-[#0d2818] border border-green-700/40 rounded-2xl space-y-3">
      <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wider">
        <MessageSquare className="w-4 h-4" />
        Send via WhatsApp instead
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Open WhatsApp with message
        </a>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(messageText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              /* ignore */
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1C1212] border border-green-700/40 hover:border-green-500 text-green-300 text-xs font-bold rounded-xl transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy message"}
        </button>
      </div>
      <pre className="text-[11px] text-green-200/70 whitespace-pre-wrap font-mono bg-black/20 rounded-xl p-3 max-h-40 overflow-y-auto">
        {messageText}
      </pre>
    </div>
  );
}
