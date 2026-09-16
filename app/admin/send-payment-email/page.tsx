'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2 } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import { WhatsAppSendPanel } from '@/components/admin/WhatsAppSendPanel';
import { instructionsParts, paymentTermsLines } from '@/lib/order';
import { waPaymentDetailsLink, waPaymentDetailsMessage } from '@/lib/whatsapp';
import type { StoredOrder } from '@/lib/orderStore';

const OPENING = "Thanks for your order! Here's how to complete payment:";
const CLOSING = "Once payment is confirmed we'll schedule your cold-chain delivery.";

function Composer({ passcode }: { passcode: string }) {
  const params = useSearchParams();
  const orderId = params.get('id');

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [mode, setMode] = useState<'template' | 'paste'>('template');
  const [detail, setDetail] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, { headers: { 'X-Admin-Passcode': passcode } })
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order);
          setCustomerEmail(d.order.customerEmail || '');
          setAmountDue(String(d.order.amountDue || ''));
        }
      })
      .catch(() => {});
  }, [orderId, passcode]);

  const instructions = instructionsParts(OPENING, detail, CLOSING);

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/send-payment-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Passcode': passcode },
        body: JSON.stringify({
          orderNumber: orderId || 'N/A',
          customerEmail,
          amountDue: Number(amountDue) || 0,
          instructions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed.');
      setSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black font-serif text-white">Send Payment Details</h1>
        {order && <p className="text-gray-400 text-xs mt-1">Order {order.orderNumber} — {order.customerName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1">Customer Email</label>
          <input
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1">Amount Due (AUD)</label>
          <input
            value={amountDue}
            onChange={(e) => setAmountDue(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {(['template', 'paste'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
              mode === m ? 'bg-red-800 text-white' : 'bg-[#1C1212] text-gray-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-300 mb-1">
          {mode === 'template' ? 'Payment details (bank / PayID / crypto address, etc.)' : 'Paste the payment details block'}
        </label>
        <textarea
          rows={6}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="e.g. PayID: orders@mrmeatandco.com.au&#10;Reference: your order number"
          className="w-full p-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm font-mono"
        />
      </div>

      {/* Live preview */}
      <div className="p-4 bg-[#141414] border border-[#991B1B]/40 rounded-2xl space-y-2 text-xs text-gray-300">
        <div className="font-bold text-white text-sm">Email preview</div>
        <p>{OPENING}</p>
        <p className="whitespace-pre-wrap font-mono text-gray-200">{detail || '(payment details go here)'}</p>
        <p>{CLOSING}</p>
        <ul className="list-disc pl-4 space-y-1 pt-2 border-t border-[#991B1B]/20">
          {paymentTermsLines().map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      {error && <div className="p-3 bg-red-950/40 border border-red-600/50 rounded-xl text-xs text-red-200">{error}</div>}
      {sent && (
        <div className="p-3 bg-green-950/40 border border-green-600/50 rounded-xl text-xs text-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Payment details sent.
        </div>
      )}

      <button
        type="button"
        onClick={send}
        disabled={sending || !customerEmail || !detail}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl"
      >
        <Send className="w-4 h-4" />
        {sending ? 'Sending…' : 'Send Email'}
      </button>

      {order?.customerPhone && (
        <WhatsAppSendPanel
          link={waPaymentDetailsLink(order.customerPhone, {
            orderNumber: order.orderNumber,
            amountDue: Number(amountDue) || 0,
            instructions,
          })}
          messageText={waPaymentDetailsMessage({
            orderNumber: order.orderNumber,
            amountDue: Number(amountDue) || 0,
            instructions,
          }).join('\n')}
        />
      )}
    </div>
  );
}

export default function SendPaymentEmailPage() {
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
