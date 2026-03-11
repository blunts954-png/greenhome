import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Home | Home Grown Money - Premium Streetwear & Lifestyle",
  description: "Official Home Grown Money store. Money grows where we plant it. Explore our latest drops, rooted in culture and high-end hustle.",
  keywords: "Home Grown Money, HGM, streetwear, lifestyle brand, fashion drop, money grows where we plant it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

