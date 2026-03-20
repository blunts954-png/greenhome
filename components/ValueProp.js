import { TrendingUp, Award, Users } from 'lucide-react';
import styles from './ValueProp.module.css';

const VALUES = [
  {
    title: 'Independent Label',
    description: 'Built from the ground up with real drops, original visuals, and merch that carries the brand forward.',
    icon: <TrendingUp className={styles.iconElement} />
  },
  {
    title: 'Certified Quality',
    description: '100% premium materials. Every SKU is tested for color-fastness, fit, and heritage-grade feel.',
    icon: <Award className={styles.iconElement} />
  },
  {
    title: 'Nationwide Shipping',
    description: 'Merch ships across the US, and shipping card payments run through secure Stripe checkout.',
    icon: <Users className={styles.iconElement} />
  }
];

export default function ValueProp() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {VALUES.map((val, i) => (
          <div key={i} className={`${styles.item} reveal`}>
            <div className={styles.iconWrapper}>
              {val.icon}
            </div>
            <h3 className="brand-font">{val.title}</h3>
            <p>{val.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
