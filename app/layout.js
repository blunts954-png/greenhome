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
  title: "Home Grown Money | Bakersfield & Riverside Cannabis Delivery & Apparel",
  description: "Bakersfield & Riverside's premier cannabis delivery and reserve menu. Shop local weed or branded apparel with nationwide shipping and Bakersfield pickup.",
  keywords: [
    "Bakersfield cannabis delivery",
    "Riverside cannabis delivery",
    "Home Grown Money",
    "HGM apparel",
    "local weed delivery Bakersfield",
    "21+ cannabis menu",
    "HGM hoodies and hats"
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Home Grown Money | Bakersfield & Riverside Cannabis Delivery & Apparel",
    description: "Bakersfield & Riverside cannabis reservations for local delivery, plus branded apparel with nationwide shipping and Stripe checkout.",
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
    description: "Bakersfield & Riverside cannabis reservations and branded apparel.",
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
              "description": "Bakersfield and Riverside cannabis company providing local delivery and reserve menus, plus premium apparel.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bakersfield",
                "addressRegion": "CA",
                "postalCode": "93301",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 35.3733,
                "longitude": -119.0187
              },
              "areaServed": [
                { "@type": "City", "name": "Bakersfield" },
                { "@type": "City", "name": "Riverside" },
                { "@type": "State", "name": "California" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Local Menu Highlights",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cannabis Delivery" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Apparel Shipping" } }
                ]
              },
              "potentialAction": {
                "@type": "OrderAction",
                "target": `${SITE_URL}/shop`,
                "deliveryMethod": ["http://purl.org/goodrelations/v1#DeliveryModeDirectDelivery", "http://purl.org/goodrelations/v1#PickupInStore"]
              },
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
