import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ValueProp from "@/components/ValueProp";
import SocialFeed from '@/components/SocialFeed';
import Link from 'next/link';
import styles from './page.module.css';
import { Target, Users, TrendingUp, Download } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProp />

      {/* Results / Stats Section */}
      <section className={`${styles.statsSection} reveal`}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <Target size={40} color="#478527" />
              <h3>100%</h3>
              <p>BAKERSFIELD BORN & CULTIVATED</p>
            </div>
            <div className={styles.statCard}>
              <Users size={40} color="#d4af37" />
              <h3>5,000+</h3>
              <p>COMMUNITY MEMBERS SEEDED</p>
            </div>
            <div className={styles.statCard}>
              <TrendingUp size={40} color="#478527" />
              <h3>PRIME</h3>
              <p>LOCAL FLOWER, FITS, AND REAL INVENTORY</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className={`${styles.brandStory} reveal`}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <h2 className="brand-font text-gradient">Cultivated in the Valley</h2>
            <p>
              Home Grown Money was built in Bakersfield as a cannabis business first, with apparel added as an extension of the brand. 
              The local menu stays rooted in the city, the clothing carries the same identity nationwide, and both sides of the business are meant to feel direct, clean, and real.
            </p>
            <Link href="/about" className={styles.storyBtn}>Read Our Story</Link>
          </div>
        </div>
      </section>

      <div className="reveal">
        <ProductGrid />
      </div>

      {/* Lead Magnet Section */}
      <section className={`${styles.leadMagnet} reveal`}>
        <div className={styles.container}>
          <div className={styles.leadContent}>
            <h2 className="brand-font">Claim Your Growth Blueprint</h2>
            <p>Ready to level up? Secure our exclusive guide on cultivation and community building.</p>
            <div className={styles.magnetActions}>
              <input type="email" placeholder="YOUR EMAIL ADDRESS" className={styles.magnetInput} />
              <button className={styles.magnetBtn}>
                GET IT NOW <Download size={18} />
              </button>
            </div>
            <p className={styles.magnetFootnote}>*100% Authentic. Zero Overhyped BS.</p>
          </div>
        </div>
      </section>

      <SocialFeed />

      <section className={`${styles.ctaBanner} reveal`}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className="brand-font">APPAREL + LOCAL MENU</h2>
            <p>Every photographed tee, hat, and combo is live for shipping or Bakersfield pickup. The local cannabis menu is separated, age-gated, and reserved for 21+ Bakersfield pickup only.</p>
            <div className={styles.ctaValues}>
              <div className={styles.vItem}><span>TEE</span> <strong>$20</strong></div>
              <div className={styles.vItem}><span>HAT</span> <strong>$15</strong></div>
              <Link href="/shop/hgm-combo-deal" className={styles.vItem}><span>COMBOS</span> <strong>$30</strong></Link>
            </div>
            <Link href="/shop?store=cannabis" className={styles.ctaShopBtn}>VIEW THE LOCAL MENU</Link>
          </div>
        </div>
      </section>
    </>
  );
}
