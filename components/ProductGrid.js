'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import { PRODUCTS } from '@/lib/products';
import styles from './ProductGrid.module.css';

const CATEGORIES = ['All', 'Tees', 'Hats', 'Combos'];

export default function ProductGrid() {
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart || (() => {});

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const filteredProducts = PRODUCTS.filter((product) => {
    const categoryMatch = activeFilter === 'All' || product.category === activeFilter;
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const handleSizeSelect = (event, productId, size) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      audioEngine.playClick();
    } catch (error) {}

    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const size = selectedSizes[product.id] || (product.sizes?.length === 1 ? product.sizes[0] : null);

    if (!size && product.sizes?.length > 1) {
      alert('Please select a size first');
      return;
    }

    try {
      audioEngine.playClick();
    } catch (error) {}

    addToCart({ ...product, selectedSize: size });
  };

  return (
    <section className={styles.section} id="shop">
      <div className={styles.header}>
        <div className={styles.categoryHead}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={60} height={60} className={styles.catLogo} />
          <h2 className="brand-font reveal">Record Label Merch</h2>
        </div>

        <div className={`${styles.socialProof} reveal`}>
          <span className={styles.stars}>★★★★★</span>
          <span>Official Home Grown Money merch with nationwide shipping and secure Stripe checkout for shipping orders.</span>
        </div>

        <div className={`${styles.storeNotice} reveal`}>
          Every photographed tee, hat, and combo in this drop is live in the store and available for nationwide delivery.
        </div>

        <div className={`${styles.searchBar} reveal`}>
          <input
            type="text"
            placeholder="Search merch..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={`${styles.filterTabs} reveal`}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.filterBtn} ${activeFilter === category ? styles.activeFilter : ''}`}
              onClick={() => {
                setActiveFilter(category);

                try {
                  audioEngine.playClick();
                } catch (error) {}
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/shop/${product.slug}`} className={`${styles.card} reveal`}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className={styles.productImg}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {product.hoverImage && (
                  <Image
                    src={product.hoverImage}
                    alt={`${product.name} Alternate`}
                    fill
                    style={{ objectFit: 'contain' }}
                    className={styles.hoverImg}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
              {product.sizes?.length > 0 && (
                <div className={styles.overlay}>
                  <div className={styles.sizeSelector}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`${styles.sizeBtn} ${selectedSizes[product.id] === size ? styles.activeSize : ''}`}
                        onClick={(event) => handleSizeSelect(event, product.id, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.details}>
              <div className={styles.meta}>
                <span className={styles.category}>{product.category}</span>
                <span className={styles.rating}>
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={index < product.rating ? styles.starFilled : styles.starEmpty}>
                      ★
                    </span>
                  ))}
                </span>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.description}>{product.description}</p>
              {product.comboNote && <p className={styles.comboNote}>{product.comboNote}</p>}
              <p className={styles.price}>${product.price}</p>
              <p className={styles.fulfillment}>Ships nationwide</p>
              <button type="button" className={styles.addBtn} onClick={(event) => handleAdd(event, product)}>
                {product.category === 'Combos' ? 'Secure the Combo' : 'Add to Cart'}
              </button>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No products match that search.</h3>
          <p>Try a different keyword or category.</p>
        </div>
      )}
    </section>
  );
}
