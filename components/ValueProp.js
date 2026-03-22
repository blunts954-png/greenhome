import { TrendingUp, Award, Users } from 'lucide-react';
import styles from './ValueProp.module.css';

const VALUES = [
  {
    title: 'Bakersfield Rooted',
    description: 'Built from the ground up in Bakersfield with a local cannabis menu and branded apparel that both represent the business the right way.',
    icon: <TrendingUp className={styles.iconElement} />
  },
  {
    title: 'Flower + Fits',
    description: 'The local menu stays separated and age-gated, while tees, hats, and combos stay photographed, organized, and easy to reserve.',
    icon: <Award className={styles.iconElement} />
  },
  {
    title: 'Clear Fulfillment',
    description: 'Apparel ships nationwide through Stripe checkout. Cannabis reservations stay 21+ and local to Bakersfield pickup.',
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
