'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2 } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import { WhatsAppSendPanel } from '@/components/admin/WhatsAppSendPanel';
import { buildEmailHtml } from '@/lib/emailTemplate';
import {
  instructionsParts,
  paymentMethodParts,
  paymentTermsHtml,
  paymentTermsLines,
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodOption,
} from '@/lib/order';
import { waPaymentConfirmationLink, waPaymentDetailsLink, waPaymentDetailsMessage, waMessageText } from '@/lib/whatsapp';
import { CONTACT, SITE } from '@/config/site';
import type { StoredOrder } from '@/lib/orderStore';

function Composer({ passcode }: { passcode: string }) {
  const params = useSearchParams();
  const orderId = params.get('id');

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>('Bank Transfer');

  // 'template' auto-fills the opening/closing lines from the payment method
  // (editable, but regenerates unless touched); 'paste' locks the opening
  // and closing sentences and only lets the admin fill in the payment
  // detail itself (account/PayID/wallet specifics), re-wrapped automatically.
  const [mode, setMode] = useState<'template' | 'paste'>('template');
  const [detail, setDetail] = useState('');
  const [touched, setTouched] = useState(false);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order);
          setCustomerEmail(d.order.customerEmail || '');
          setCustomerPhone(d.order.customerPhone || '');
          setAmountDue(String(d.order.amountDue || ''));
        }
      })
      .catch(() => {});
  }, [orderId, passcode]);

  const { opening, closing } = useMemo(
    () => paymentMethodParts(paymentMethod, amountDue, orderId || ''),
    [paymentMethod, amountDue, orderId]
  );

  // Template mode's editable text — regenerated whenever the method/amount
  // change, unless the admin has actually typed in it.
  const [templateText, setTemplateText] = useState('');
  useEffect(() => {
    if (mode === 'template' && !touched) {
      setTemplateText(instructionsParts(opening, detail, closing));
    }
  }, [mode, touched, opening, closing, detail]);

  const instructions = mode === 'template' ? templateText : instructionsParts(opening, detail, closing);
  const showOsko = paymentMethod === 'Bank Transfer' || paymentMethod === 'PayID';
  const whatsappLink = useMemo(() => waPaymentConfirmationLink(orderId || 'your order'), [orderId]);

  const termsLines = useMemo(
    () =>
      paymentTermsLines({
        orderNumber: orderId || '',
        contactEmail: CONTACT.email,
        whatsapp: CONTACT.whatsapp,
        whatsappLink,
        showOskoNote: showOsko,
      }),
    [orderId, whatsappLink, showOsko]
  );

  const previewHtml = useMemo(
    () =>
      buildEmailHtml({
        title: 'Payment details for your order',
        refBadge: orderId || undefined,
        intro: `Here's how to complete payment for order ${orderId || '[order number]'}.`,
        rows: [
          { label: 'Amount Due', value: `$${(Number(amountDue) || 0).toFixed(2)} AUD`, highlight: true },
          { label: 'Payment Method', value: paymentMethod },
          { label: 'How to Pay', heading: true },
          { label: '', html: instructions.replace(/\n/g, '<br>'), block: true },
        ],
        afterRows: paymentTermsHtml({
          orderNumber: orderId || '',
          contactEmail: CONTACT.email,
          whatsapp: CONTACT.whatsapp,
          whatsappLink,
          showOskoNote: showOsko,
        }),
        secondaryCta: { label: 'Contact Us', url: `mailto:${CONTACT.email}` },
        footer: `${SITE.name} — ${SITE.domain}`,
      }),
    [orderId, amountDue, paymentMethod, instructions, whatsappLink, showOsko]
  );

  const whatsappMessageLines = useMemo(
    () =>
      waPaymentDetailsMessage({
        orderNumber: orderId || '[order number]',
        amountDue: Number(amountDue) || 0,
        instructions,
        termsLines,
      }),
    [orderId, amountDue, instructions, termsLines]
  );
  const whatsappFullMessage = useMemo(() => waMessageText(whatsappMessageLines), [whatsappMessageLines]);

  const switchToTemplate = () => {
    setMode('template');
    setTouched(false);
  };
  const switchToPaste = () => {
    setMode('paste');
    setDetail('');
  };

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/send-payment-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Passcode': passcode },
        body: JSON.stringify({
          orderNumber: orderId || 'N/A',
          customerEmail,
          amountDue: Number(amountDue) || 0,
          paymentMethod,
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

  const formValid = Boolean(customerEmail && amountDue && instructions.trim());
  const whatsappValid = Boolean(customerPhone && amountDue && instructions.trim());

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black font-serif text-white">Send Payment Details</h1>
        {order && <p className="text-gray-400 text-xs mt-1">Order {order.orderNumber} — {order.customerName}</p>}
      </div>

      <div className="p-5 bg-[#141414] border border-[#991B1B]/40 rounded-2xl space-y-4">
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
              placeholder="145.00"
              className="w-full px-3 py-2.5 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentMethodOption);
              setTouched(false);
            }}
            className="w-full px-3 py-2.5 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
          >
            {PAYMENT_METHOD_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-gray-300">Instructions</label>
            <div className="flex bg-[#1C1212] border border-[#991B1B]/40 rounded-lg p-0.5 text-[10px] font-black uppercase">
              <button
                type="button"
                onClick={switchToTemplate}
                className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'template' ? 'bg-red-800 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Template
              </button>
              <button
                type="button"
                onClick={switchToPaste}
                className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'paste' ? 'bg-red-800 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Paste
              </button>
            </div>
          </div>

          {mode === 'paste' && (
            <p className="text-xs text-gray-500 italic mb-1.5 leading-relaxed">{opening}</p>
          )}
          <textarea
            rows={mode === 'paste' ? 4 : 7}
            value={mode === 'paste' ? detail : templateText}
            onChange={(e) => {
              if (mode === 'paste') {
                setDetail(e.target.value);
              } else {
                setTemplateText(e.target.value);
                setTouched(true);
              }
            }}
            placeholder={mode === 'paste' ? 'Paste just the payment detail — BSB/account, PayID handle, or wallet address + exact amount.' : undefined}
            className="w-full p-3 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm font-mono"
          />
          {mode === 'paste' && (
            <p className="text-xs text-gray-500 italic mt-1.5 leading-relaxed">{closing}</p>
          )}
          <p className="text-[10px] text-gray-500 mt-1.5">
            {mode === 'template'
              ? "Auto-filled from the payment method — edit freely, it won't reset unless you change the method."
              : 'Paste mode — only the payment detail above is yours to fill in. The opening/closing lines shown in grey wrap around it automatically.'}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Email Preview</h2>
        <div className="border border-[#991B1B]/40 rounded-2xl overflow-hidden">
          <iframe title="Email preview" srcDoc={previewHtml} className="w-full" style={{ height: 620, border: 0 }} />
        </div>
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
        disabled={sending || !formValid}
        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl"
      >
        <Send className="w-4 h-4" />
        {sending ? 'Sending…' : `Send to ${customerEmail || 'customer'}`}
      </button>

      <div>
        <label className="block text-xs font-bold text-gray-300 mb-1">Customer Phone (for WhatsApp)</label>
        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="0480 811 308"
          className="w-full px-3 py-2.5 bg-[#1C1212] border border-[#991B1B]/40 rounded-xl text-white text-sm"
        />
      </div>

      {whatsappValid && (
        <WhatsAppSendPanel
          link={waPaymentDetailsLink(customerPhone, {
            orderNumber: orderId || 'your order',
            amountDue: Number(amountDue) || 0,
            instructions,
            termsLines,
          })}
          messageText={whatsappFullMessage}
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
