import { TrendingUp, Award, Users } from 'lucide-react';
import styles from './ValueProp.module.css';

const VALUES = [
  {
    title: 'All On Da Muscle',
    description: 'Bakersfield-born and bred with zero outside investors. Home Grown Money is built on pure hustle and unwavering self-belief. APTTMH.',
    icon: <TrendingUp className={styles.iconElement} />
  },
  {
    title: 'Culture & Community',
    description: 'The brand is rooted in Bakersfield culture, direct customer relationships, and a storefront experience that feels personal.',
    icon: <Award className={styles.iconElement} />
  },
  {
    title: 'Nationwide & Local',
    description: 'Premium apparel ships nationwide. The 21+ local menu stays limited to Bakersfield pickup and delivery.',
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
