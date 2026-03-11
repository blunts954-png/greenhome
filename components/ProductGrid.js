import Image from 'next/image';
import styles from './ProductGrid.module.css';

const PRODUCTS = [
  { id: 1, name: 'Rooted Hoodie', price: '$85', image: '/images/lifestyle-1.png' },
  { id: 2, name: 'HGM Classic Tee', price: '$45', image: '/images/hero-bg.png' }, // Placeholder for now
  { id: 3, name: 'Plant it Cap', price: '$35', image: '/images/lifestyle-2.png' },
];

export default function ProductGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className="brand-font">The Latest Drop</h2>
        <p>Premium streetwear for those who know the value of growth.</p>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map(product => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.details}>
              <h3>{product.name}</h3>
              <p className={styles.price}>{product.price}</p>
              <button className={styles.addBtn}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
