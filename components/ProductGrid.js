'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import styles from './ProductGrid.module.css';

const PRODUCTS = [
  { 
    id: 1, 
    name: 'Rooted Hoodie', 
    price: 85, 
    image: '/images/lifestyle-1.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 2, 
    name: 'HGM Classic Tee', 
    price: 45, 
    image: '/images/hgm-tee.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 3, 
    name: 'Plant it Cap', 
    price: 35, 
    image: '/images/lifestyle-2.png',
    sizes: ['One Size']
  },
  { 
    id: 4, 
    name: 'HGM Heavyweight Sweats', 
    price: 75, 
    image: '/images/hgm-sweatpants.png',
    sizes: ['S', 'M', 'L', 'XL']
  },
  { 
    id: 5, 
    name: 'Rooted Beanie', 
    price: 30, 
    image: '/images/hgm-beanie.png',
    sizes: ['One Size']
  },
];

export default function ProductGrid() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product) => {
    const size = selectedSizes[product.id] || (product.sizes.length === 1 ? product.sizes[0] : null);
    if (!size && product.sizes.length > 1) {
      alert('Please select a size first');
      return;
    }
    addToCart({ ...product, selectedSize: size });
  };

  return (
    <section className={styles.section} id="shop">
      <div className={styles.header}>
        <h2 className="brand-font">The Latest Drop</h2>
        <div className={styles.socialProof}>
          <span className={styles.stars}>★★★★★</span>
          <span>Join 500+ satisfied hustlers</span>
        </div>
        <p>Premium streetwear for those who know the value of growth.</p>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map(product => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className={styles.productImg}
                />
              </div>
              <div className={styles.overlay}>
                <div className={styles.sizeSelector}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSizes[product.id] === size ? styles.activeSize : ''}`}
                      onClick={() => handleSizeSelect(product.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <h3>{product.name}</h3>
              <p className={styles.price}>${product.price}</p>
              <button 
                className={styles.addBtn}
                onClick={() => handleAdd(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
