import type { Metadata } from 'next';
import { SITE, abs, metaDesc } from '@/config/site';
import { JsonLd } from '@/components/JsonLd';
import { WholesaleClient } from './WholesaleClient';

export const metadata: Metadata = {
  title: 'Wholesale & Bulk Meat | Restaurant & Trade Supply',
  description: metaDesc(
    'Wholesale and bulk meat from an Australian craft butcher — bulk cartons, quarter/half/whole animal shares, custom cut sheets and standing restaurant supply. NSW cold-chain, national frozen freight.'
  ),
  alternates: { canonical: `https://${SITE.domain}/wholesale/` },
  openGraph: {
    title: 'Wholesale & Bulk Meat Supply — Mr Meat & Co',
    description:
      'Bulk cartons, carcass shares, custom cut sheets and standing restaurant supply. NSW cold-chain, national frozen freight.',
    url: `https://${SITE.domain}/wholesale/`,
    images: [{ url: abs(SITE.ogImage) }],
  },
};

const wholesaleSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Wholesale & Bulk Meat Supply',
  url: `https://${SITE.domain}/wholesale/`,
  isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
  about: {
    '@type': 'Service',
    name: 'Wholesale & bulk meat supply',
    serviceType: 'Butcher wholesale and restaurant supply',
    provider: { '@type': 'Organization', name: SITE.name, url: `https://${SITE.domain}/` },
    areaServed: ['New South Wales', 'Australia'],
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Wholesale', item: `https://${SITE.domain}/wholesale/` },
    ],
  },
};

export default function WholesalePage() {
  return (
    <>
      <JsonLd data={wholesaleSchema} />
      <WholesaleClient />
    </>
  );
}
