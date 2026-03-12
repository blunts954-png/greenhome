import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import RootClientWrapper from "@/components/RootClientWrapper";

export const metadata = {
  title: "Home | Home Grown Money - Premium Streetwear - Bakersfield Born",
  description: "Official Home Grown Money store. Money grows where we plant it. Explore our latest drops, rooted in culture and high-end hustle.",
  keywords: "Home Grown Money, HGM, streetwear, lifestyle brand, fashion drop, money grows where we plant it",
  openGraph: {
    title: "Home Grown Money - Premium Streetwear & Lifestyle",
    description: "Money grows where we plant it. Explore our latest drops, rooted in culture and high-end hustle.",
    url: 'https://homegrown12.netlify.app',
    siteName: 'Home Grown Money',
    images: [
      {
        url: '/images/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Home Grown Money Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Grown Money',
    description: 'Money grows where we plant it.',
    images: ['/images/hero-bg.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <CartProvider>
          <RootClientWrapper>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </RootClientWrapper>
        </CartProvider>
      </body>
    </html>
  );
}

