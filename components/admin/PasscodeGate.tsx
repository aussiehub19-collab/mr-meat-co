"use client";

import React, { useState } from "react";
import { Lock, LogOut } from "lucide-react";
import { SITE } from "@/config/site";
import { useAdminPasscode } from "@/lib/useAdminPasscode";

/**
 * Wraps every /admin/* page. Renders a passcode entry until unlocked, then
 * the page content. The verified passcode is kept in module scope via the
 * hook's return value — pass it down to fetch calls with the
 * X-Admin-Passcode header.
 */
export function PasscodeGate({
  children,
}: {
  children: (passcode: string) => React.ReactNode;
}) {
  const { passcode, verified, checking, error, verify, logout } = useAdminPasscode();
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500/40 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!verified || !passcode) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            await verify(input);
            setSubmitting(false);
          }}
          className="w-full max-w-sm bg-[#141414] border border-[#991B1B]/40 rounded-3xl p-8 space-y-5 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-lg font-black font-serif text-white">{SITE.name} Admin</h1>
            <p className="text-xs text-gray-400">Enter the admin passcode to continue.</p>
          </div>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passcode"
            className="w-full px-4 py-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm text-center tracking-widest placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !input}
            className="w-full py-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
          >
            {submitting ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end px-4 sm:px-6 lg:px-8 pt-4">
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-red-400"
        >
          <LogOut className="w-3.5 h-3.5" />
          Lock admin
        </button>
      </div>
      {children(passcode)}
    </div>
  );
}
