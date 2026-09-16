'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2 } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredEnquiry } from '@/lib/enquiryStore';

function Composer({ passcode }: { passcode: string }) {
  const params = useSearchParams();
  const enquiryId = params.get('id');

  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enquiryId) return;
    fetch(`/api/admin/enquiries/${encodeURIComponent(enquiryId)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then((r) => r.json())
      .then((d) => setEnquiry(d.enquiry || null))
      .catch(() => {});
  }, [enquiryId, passcode]);

  const send = async () => {
    if (!enquiryId) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/reply-enquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Passcode': passcode },
        body: JSON.stringify({ enquiryId, message }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Send failed.');
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl space-y-6">
      <h1 className="text-2xl font-black font-serif text-white">Reply to Enquiry</h1>

      {enquiry ? (
        <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl space-y-1 text-xs text-gray-300">
          <div className="text-white font-bold text-sm">
            {enquiry.name} <span className="text-gray-500 font-normal capitalize">· {enquiry.type} enquiry</span>
          </div>
          <div>{enquiry.email || enquiry.phone}</div>
          <p className="pt-2 whitespace-pre-wrap text-gray-200">{enquiry.message}</p>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">Loading enquiry…</div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-300 mb-1">Your reply</label>
        <textarea
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your reply…"
          className="w-full p-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
        />
      </div>

      {/* Live preview */}
      <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl space-y-2 text-xs text-gray-300">
        <div className="font-bold text-white text-sm">Email preview</div>
        <p>Hi {enquiry?.name || 'there'},</p>
        <p className="whitespace-pre-wrap">{message || '(your reply goes here)'}</p>
      </div>

      {error && <div className="p-3 bg-red-950/40 border border-red-600/50 rounded-xl text-xs text-red-200">{error}</div>}
      {sent && (
        <div className="p-3 bg-green-950/40 border border-green-600/50 rounded-xl text-xs text-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Reply sent.
        </div>
      )}

      <button
        type="button"
        onClick={send}
        disabled={sending || !message || !enquiry?.email}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl"
      >
        <Send className="w-4 h-4" />
        {sending ? 'Sending…' : 'Send Reply'}
      </button>
      {enquiry && !enquiry.email && (
        <p className="text-xs text-amber-300">This enquiry has no email address — reply by phone or WhatsApp instead.</p>
      )}
    </div>
  );
}

export default function ReplyEnquiryPage() {
  return (
    <PasscodeGate>
      {(passcode) => (
        <Suspense fallback={<div className="px-6 py-8 text-gray-400 text-sm">Loading…</div>}>
          <Composer passcode={passcode} />
        </Suspense>
      )}
    </PasscodeGate>
  );
}
