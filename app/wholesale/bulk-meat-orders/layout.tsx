import React from 'react';
import type { Metadata } from 'next';
import { SITE, PAGE_SEO } from '@/config/site';

const seo = PAGE_SEO['/wholesale/bulk-meat-orders/'];

export const metadata: Metadata = seo
  ? {
      title: { absolute: seo.title },
      description: seo.description,
      alternates: { canonical: `https://${SITE.domain}/wholesale/bulk-meat-orders/` },
      other: { 'og:updated_time': new Date().toISOString() },
    }
  : {};

export default function BulkMeatOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
