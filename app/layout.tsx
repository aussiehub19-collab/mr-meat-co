import type { Metadata } from 'next';
import './globals.css';
import { SITE } from '@/config/site';
import { CartProvider } from '@/lib/cart';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ChatHub } from '@/components/ChatHub';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  metadataBase: new URL(`https://${SITE.domain}`),
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    title: SITE.name,
    description: SITE.tagline,
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.tagline,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/apple-icon',
  },
  other: {
    'og:updated_time': new Date().toISOString(),
    'google-site-verification': SITE.gscVerification,
    'indexnow-key': SITE.indexNowKey,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/js/webmcp.js" defer />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0D0D0D] text-[#F3F3F3] antialiased selection:bg-red-800 selection:text-white" suppressHydrationWarning>
        <CartProvider>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ChatHub />
        </CartProvider>
      </body>
    </html>
  );
}
