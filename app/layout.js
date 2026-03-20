import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { OrdersProvider } from "@/lib/orders-context";
import RootClientWrapper from "@/components/RootClientWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

const SITE_URL = "https://homegrownmoney.com";

export const metadata = {
  title: "Home Grown Money | Official Merch Store",
  description: "Shop official Home Grown Money merch with nationwide shipping and secure Stripe checkout for shipping orders.",
  keywords: [
    "Home Grown Money",
    "Home Grown Money merch",
    "record label merch",
    "HGM tees",
    "HGM hats",
    "streetwear merch"
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Home Grown Money | Official Merch Store",
    description: "Official Home Grown Money merch with nationwide shipping and secure Stripe checkout for shipping orders.",
    url: SITE_URL,
    siteName: "Home Grown Money",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1200,
        height: 1200,
        alt: "Home Grown Money",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Grown Money",
    description: "Official Home Grown Money merch with nationwide shipping.",
    images: ["/images/hero-bg.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Bakersfield" />
        <meta name="geo.position" content="35.3733;-119.0187" />
        <meta name="ICBM" content="35.3733, -119.0187" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Home Grown Money",
              "image": `${SITE_URL}/images/hero-bg.png`,
              "url": SITE_URL,
              "description": "Official Home Grown Money merch storefront with nationwide shipping and secure Stripe checkout for shipping orders.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bakersfield",
                "addressRegion": "CA",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 35.3733,
                "longitude": -119.0187
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Bakersfield"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Kern County"
                }
              ],
              "sameAs": [
                "https://instagram.com/homegrownmoney",
                "https://facebook.com/homegrownmoney"
              ]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <OrdersProvider>
          <CartProvider>
            <RootClientWrapper>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </RootClientWrapper>
          </CartProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}

