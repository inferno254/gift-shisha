import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmokeBackground from '@/components/SmokeBackground';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gift-shisha.com'),
  title: 'Gift Shisha | Premium Shisha Delivery in Kenya',
  description: 'Gift Shisha — authentic hookahs, shisha flavours, charcoal and accessories delivered across Nairobi, Mombasa, Kisumu, Nakuru & Eldoret. M-Pesa checkout.',
  keywords: ['Gift Shisha', 'shisha delivery Kenya', 'hookah Nairobi', 'shisha flavours', 'M-Pesa', 'hookah pipes'],
  openGraph: {
    title: 'Gift Shisha - Premium Hookah & Shisha Delivery Kenya',
    description: 'Authentic hookahs, shisha flavours, charcoal and accessories. M-Pesa payments. Delivered fast across Kenya.',
    images: ['/gs5.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/gs5.jpg" />
        <link rel="apple-touch-icon" href="/gs5.jpg" />
        <Script
          id="favicon-switcher"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getTheme() {
                  var html = document.documentElement;
                  if (html.classList.contains('dark')) return 'dark';
                  var stored = localStorage.getItem('gift-shisha-theme');
                  if (stored === 'dark' || stored === 'light') return stored;
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                function setFavicon(theme) {
                  var href = '/gs5.jpg';
                  var link = document.querySelector("link[rel~='icon']");
                  if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                  }
                  link.href = href;
                }
                var theme = getTheme();
                setFavicon(theme);
                var observer = new MutationObserver(function() { setFavicon(getTheme()); });
                observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[var(--ink)] text-[var(--cream)]">
        <SmokeBackground />
        <Providers>
          <Header />
          <div className="flex-1 relative">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
