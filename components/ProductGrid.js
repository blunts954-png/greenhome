'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import { PRODUCTS } from '@/lib/products';
import AgeGate from './AgeGate';
import styles from './ProductGrid.module.css';

const STORES = ['Apparel', 'Cannabis'];
const STORE_CATEGORIES = {
  'Apparel': ['All', 'Tees', 'Hats', 'Combos'],
  'Cannabis': ['All', 'Flower', 'Concentrates', 'Disposables', 'Edibles', 'Accessories']
};

export default function ProductGrid() {
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart || (() => {});
  
  const [activeStore, setActiveStore] = useState('Apparel');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified') === 'true';
    setAgeVerified(isVerified);
  }, []);

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
      <AgeGate isActive={activeStore === 'Cannabis' && !ageVerified} onVerify={() => setAgeVerified(true)} />
      <div className={styles.header}>
        <div className={`${styles.storeToggle} reveal`}>
          {STORES.map(store => (
            <button 
              key={store}
              type="button"
              className={`${styles.storeBtn} ${activeStore === store ? styles.activeStore : ''}`}
              onClick={() => handleStoreChange(store)}
            >
              {store}
            </button>
          ))}
        </div>

        <div className={styles.categoryHead}>
          <Image src="/logo_v3.jpg" alt="HGM Logo" width={60} height={60} className={styles.catLogo} />
          <h2 className="brand-font reveal">
            {activeStore === 'Apparel' ? 'Streetwear & Apparel' : 'Local Cannabis Menu'}
          </h2>
        </div>
        
        <div className={`${styles.socialProof} reveal`}>
          <span className={styles.stars}>★★★★★</span>
          <span>
            {activeStore === 'Apparel'
              ? 'Reserve online. Apparel ships nationwide or can be picked up in Bakersfield.'
              : '21+ only. Cannabis is for Bakersfield pickup or local delivery only.'}
          </span>
        </div>

        <div className={`${styles.storeNotice} reveal`}>
          {activeStore === 'Apparel'
            ? 'All currently photographed apparel and accessories in this drop are listed below.'
            : 'Local cannabis items can be reserved online, but they are not available for domestic shipping.'}
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
              type="button"
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
                  style={{ objectFit: product.storeSection === 'apparel' ? 'contain' : 'cover' }}
                  className={styles.productImg}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {product.hoverImage && (
                   <Image 
                     src={product.hoverImage} 
                     alt={`${product.name} Alternate`} 
                     fill 
                     style={{ objectFit: product.storeSection === 'apparel' ? 'contain' : 'cover' }}
                     className={styles.hoverImg}
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                   />
                )}
              </div>
              {product.sizes?.length > 0 && (
                <div className={styles.overlay}>
                  <div className={styles.sizeSelector}>
                    {product.sizes?.map(size => (
                      <button 
                        key={size}
                        type="button"
                        className={`${styles.sizeBtn} ${selectedSizes[product.id] === size ? styles.activeSize : ''}`}
                        onClick={(e) => handleSizeSelect(e, product.id, size)}
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
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < product.rating ? styles.starFilled : styles.starEmpty}>★</span>
                  ))}
                </span>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.description}>{product.description}</p>
              <p className={styles.price}>${product.price}</p>
              <p className={styles.fulfillment}>{product.pickupOnly ? 'Local only' : 'Ships or pickup'}</p>
              <button 
                type="button"
                className={styles.addBtn}
                onClick={(e) => handleAdd(e, product)}
              >
                {product.category === 'Combos' ? 'Secure the Combo' : product.pickupOnly ? 'Reserve Item' : 'Add to Cart'}
              </button>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No products match that search.</h3>
          <p>Try a different keyword or switch store sections.</p>
        </div>
      )}
    </section>
  );
}
