'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import { PRODUCTS } from '@/lib/products';
import styles from './ProductGrid.module.css';

const STORES = ['Apparel', 'Cannabis'];
const STORE_CATEGORIES = {
  'Apparel': ['All', 'Tees', 'Hats', 'Combos'],
  'Cannabis': ['All', 'Flower', 'Concentrates', 'Disposables', 'Edibles', 'Others']
};

export default function ProductGrid() {
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart || (() => {});
  
  const [activeStore, setActiveStore] = useState('Apparel');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});

  const filteredProducts = PRODUCTS.filter(p => {
    const storeMatch = p.storeSection.toLowerCase() === activeStore.toLowerCase();
    const categoryMatch = activeFilter === 'All' || p.category === activeFilter;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return storeMatch && categoryMatch && searchMatch;
  });

  const handleSizeSelect = (e, productId, size) => {
    e.preventDefault();
    e.stopPropagation();
    try { audioEngine.playClick(); } catch(e){}
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const size = selectedSizes[product.id] || (product.sizes?.length === 1 ? product.sizes[0] : null);
    if (!size && product.sizes?.length > 1) {
      alert('Please select a size first');
      return;
    }
    try { audioEngine.playClick(); } catch(e){}
    addToCart({ ...product, selectedSize: size });
  };

  const handleStoreChange = (store) => {
    setActiveStore(store);
    setActiveFilter('All');
    try { audioEngine.playClick(); } catch(e){}
  };

  return (
    <section className={styles.section} id="shop">
      <div className={styles.header}>
        <div className={`${styles.storeToggle} reveal`}>
          {STORES.map(store => (
            <button 
              key={store}
              className={`${styles.storeBtn} ${activeStore === store ? styles.activeStore : ''}`}
              onClick={() => handleStoreChange(store)}
            >
              {store}
            </button>
          ))}
        </div>

        <h2 className="brand-font reveal">
          {activeStore === 'Apparel' ? 'Streetwear & Apparel' : 'Premium Cannabis'}
        </h2>
        
        <div className={`${styles.socialProof} reveal`}>
          <span className={styles.stars}>★★★★★</span>
          <span>Pay In-Store. Pickup in Bakersfield.</span>
        </div>

        <div className={`${styles.searchBar} reveal`}>
          <input 
            type="text" 
            placeholder="Search Products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={`${styles.filterTabs} reveal`}>
          {STORE_CATEGORIES[activeStore].map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.activeFilter : ''}`}
              onClick={() => {
                setActiveFilter(cat);
                try { audioEngine.playClick(); } catch(e){}
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map(product => (
          <Link key={product.id} href={`/shop/${product.slug}`} className={`${styles.card} reveal`}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className={styles.productImg}
                />
                {product.hoverImage && (
                   <Image 
                     src={product.hoverImage} 
                     alt={`${product.name} Alternate`} 
                     fill 
                     style={{ objectFit: 'cover' }}
                     className={styles.hoverImg}
                   />
                )}
              </div>
              <div className={styles.overlay}>
                <div className={styles.sizeSelector}>
                  {product.sizes?.map(size => (
                    <button 
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSizes[product.id] === size ? styles.activeSize : ''}`}
                      onClick={(e) => handleSizeSelect(e, product.id, size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.meta}>
                <span className={styles.category}>{product.category}</span>
                <span className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < product.rating ? styles.starFilled : styles.starEmpty}>★</span>
                  ))}
                </span>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.price}>${product.price}</p>
              <button 
                className={styles.addBtn}
                onClick={(e) => handleAdd(e, product)}
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
