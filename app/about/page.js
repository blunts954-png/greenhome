import Image from 'next/image';
import styles from './About.module.css';

export const metadata = {
  title: "Our Story | Home Grown Money",
  description: "The origin of Home Grown Money. Founded in Bakersfield, rooted in persistence, and built for the hustle.",
};

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient">The Roots</h1>
          <p className={styles.subtitle}>Money Grows Where We Plant It.</p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.text}>
              <h2 className="brand-font">Bakersfield Born</h2>
              <p>
                Home Grown Money didn&apos;t start in a boardroom. It started on the streets of Bakersfield, 
                where the heat is as relentless as the hustle. We saw a gap between high-end fashion 
                and the culture we lived every day.
              </p>
              <p>
                The name reflects a simple truth: growth only happens through cultivation. 
                Whether it&apos;s wealth, knowledge, or influence, you have to plant the seed 
                and nurture it yourself. Nobody is handing out harvests for free.
              </p>
              <h2 className="brand-font">The Movement</h2>
              <p>
                Every stitch, every fabric choice, and every drop is a testament to persistent growth. 
                We don&apos;t manufacture hype—we manufacture heritage. HGM is for those who came from 
                nothing and are building everything.
              </p>
            </div>
            <div className={styles.imageBox}>
               <div className={styles.placeholderImage}>
                  <span>[FOUNDER IMAGE]</span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
