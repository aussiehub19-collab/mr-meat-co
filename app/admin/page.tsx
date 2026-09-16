'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, MessagesSquare, RefreshCw, ArrowRight } from 'lucide-react';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredOrder } from '@/lib/orderStore';
import type { StoredEnquiry } from '@/lib/enquiryStore';

function Dashboard({ passcode }: { passcode: string }) {
  const [orders, setOrders] = useState<StoredOrder[] | null>(null);
  const [enquiries, setEnquiries] = useState<StoredEnquiry[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [oRes, eRes] = await Promise.all([
        fetch('/api/admin/orders/', { headers: { 'X-Admin-Passcode': passcode } }),
        fetch('/api/admin/enquiries/', { headers: { 'X-Admin-Passcode': passcode } }),
      ]);
      const oData = await oRes.json();
      const eData = await eRes.json();
      if (!oRes.ok) throw new Error(oData.error || 'Failed to load orders.');
      if (!eRes.ok) throw new Error(eData.error || 'Failed to load enquiries.');
      setOrders(oData.orders);
      setEnquiries(eData.enquiries);
      setConfigured(oData.configured && eData.configured);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [passcode]);

  useEffect(() => {
    load();
  }, [load]);

  const pendingOrders = (orders || []).filter((o) => o.status !== 'payment-sent').length;
  const newEnquiries = (enquiries || []).filter((e) => e.status === 'new').length;

  return (
    <div className="px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black font-serif text-white">Dashboard</h1>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-red-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {!configured && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-xs text-amber-200">
          Storage isn&apos;t configured yet — add <code>UPSTASH_REDIS_REST_URL</code> and{' '}
          <code>UPSTASH_REDIS_REST_TOKEN</code> as Vercel env vars. Orders and enquiries are still emailed in the meantime.
        </div>
      )}
      {error && <div className="p-4 bg-red-950/40 border border-red-600/50 rounded-2xl text-xs text-red-200">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/orders/"
          className="group p-6 bg-[#141414] border border-[#991B1B]/40 rounded-2xl hover:border-red-500/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-900/40 text-red-300">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="font-black font-serif text-white text-lg">Orders</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{orders === null ? '—' : orders.length}</span>
            <span className="text-xs text-gray-400">
              {pendingOrders > 0 ? `${pendingOrders} pending payment` : 'all handled'}
            </span>
          </div>
        </Link>

        <Link
          href="/admin/enquiries/"
          className="group p-6 bg-[#141414] border border-[#991B1B]/40 rounded-2xl hover:border-red-500/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-900/40 text-red-300">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <span className="font-black font-serif text-white text-lg">Enquiries</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">{enquiries === null ? '—' : enquiries.length}</span>
            <span className="text-xs text-gray-400">
              {newEnquiries > 0 ? `${newEnquiries} new` : 'all handled'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return <PasscodeGate>{(passcode) => <Dashboard passcode={passcode} />}</PasscodeGate>;
}
