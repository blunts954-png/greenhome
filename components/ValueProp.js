import { TrendingUp, Award, Users } from 'lucide-react';
import styles from './ValueProp.module.css';

const VALUES = [
  {
    title: 'Authenticity First',
    description: 'We don\'t follow trends, we plant seeds. Every piece is rooted in real street culture and authentic hustle.',
    icon: <TrendingUp className={styles.iconElement} />
  },
  {
    title: 'Quality Guaranteed',
    description: 'Superior fabrics, precision stitching, and premium finishes. We build for the long game.',
    icon: <Award className={styles.iconElement} />
  },
  {
    title: 'Community Driven',
    description: 'Home Grown Money is more than a brand—it\'s a movement for those who cultivate their own future.',
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
