import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { OrdersProvider } from "@/lib/orders-context";
import RootClientWrapper from "@/components/RootClientWrapper";

export const metadata = {
  title: "Home Grown Money | Premium Apparel & Cannabis - Bakersfield, CA",
  description: "Bakersfield's premier source for Home Grown Money apparel and premium cannabis products. Order online for domestic shipping or local pickup. Money grows where we plant it.",
  keywords: "Home Grown Money, Bakersfield streetwear, cannabis delivery Bakersfield, HGM apparel, weed pickup Bakersfield, Home Grown Money T-shirts",
  metadataBase: new URL('https://homegrownmoney.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Home Grown Money - Bakersfield's Premium Lifestyle Brand",
    description: "Premium apparel and curated cannabis. Bakersfield born, cultivated globally. Order today for local delivery or pickup.",
    url: 'https://homegrownmoney.com',
    siteName: 'Home Grown Money',
    images: [
      {
        url: '/images/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Home Grown Money Bakersfield',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Grown Money Bakersfield',
    description: 'Money grows where we plant it. Premium apparel and cannabis.',
    images: ['/images/hero-bg.png'],
  },
  verification: {
    google: 'google-site-verification-placeholder',
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
              "@type": "LocalBusiness",
              "name": "Home Grown Money",
              "image": "https://homegrownmoney.com/images/hero-bg.png",
              "@id": "",
              "url": "https://homegrownmoney.com",
              "telephone": "661-555-0123",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Bakersfield, CA",
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
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "10:00",
                "closes": "22:00"
              },
              "sameAs": [
                "https://instagram.com/homegrownmoney",
                "https://twitter.com/homegrownmoney"
              ]
            })
          }}
        />
      </head>
      <body>
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

