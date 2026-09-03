import type { Metadata } from 'next';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: { absolute: 'Search — Mr Meat & Co' },
  description: 'Search the Mr Meat & Co catalogue of butcher cuts, meat boxes and cooking guides.',
  alternates: { canonical: `https://${SITE.domain}/search/` },
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
