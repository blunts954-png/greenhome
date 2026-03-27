'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import { PRODUCTS } from '@/lib/products';
import AgeGate from './AgeGate';
import styles from './ProductGrid.module.css';

const STORES = ['Apparel', 'Cannabis'];
const STORE_CATEGORIES = {
  Apparel: ['All', 'Tees', 'Hats', 'Beanies', 'Combos', 'Accessories'],
  Cannabis: ['All', 'Flower', 'Concentrates', 'Edibles', 'Disposables']
};

function getStoreFromSearchParams(searchParams) {
  return searchParams.get('store')?.toLowerCase() === 'cannabis' ? 'Cannabis' : 'Apparel';
}

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

  useEffect(() => {
    const syncStoreFromUrl = () => {
      const nextStore = getStoreFromSearchParams(new URLSearchParams(window.location.search));
      setActiveStore(nextStore);
      setActiveFilter('All');
    };

    syncStoreFromUrl();
    window.addEventListener('popstate', syncStoreFromUrl);

    return () => {
      window.removeEventListener('popstate', syncStoreFromUrl);
    };
  }, []);

  const filteredProducts = PRODUCTS.filter((product) => {
    const storeMatch = product.storeSection.toLowerCase() === activeStore.toLowerCase();
    const categoryMatch = activeFilter === 'All' || product.category === activeFilter;
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return storeMatch && categoryMatch && searchMatch;
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

  const handleStoreChange = (store) => {
    setActiveStore(store);
    setActiveFilter('All');

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (store === 'Cannabis') {
        params.set('store', 'cannabis');
      } else {
        params.delete('store');
      }

      const nextUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', nextUrl);
    }

    try {
      audioEngine.playClick();
    } catch (error) {}
  };

  return (
    <section className={styles.section} id="shop">
      <AgeGate isActive={activeStore === 'Cannabis' && !ageVerified} onVerify={() => setAgeVerified(true)} />
      <div className={styles.header}>
        <div className={`${styles.storeToggle} reveal`}>
          {STORES.map((store) => (
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
          <Image src="/logo-mark.png" alt="HGM Logo" width={44} height={68} className={styles.catLogo} />
          <h2 className="brand-font reveal">
            {activeStore === 'Apparel' ? 'Apparel & Accessories' : 'Bakersfield Delivery Menu'}
          </h2>
          {activeStore === 'Cannabis' && (
            <div className={`${styles.callToAction} brand-font reveal`}>
              CALL US NOW: (661) 501-1881
            </div>
          )}
        </div>

        <div className={`${styles.socialProof} reveal`}>
          <span className={styles.stars}>★★★★★</span>
          <span>
            {activeStore === 'Apparel'
              ? 'Apparel ships nationwide or can be arranged for Bakersfield pickup/delivery.'
              : '21+ only. Cannabis reservations are for Bakersfield pickup or local delivery.'}
          </span>
        </div>

        <div className={`${styles.storeNotice} reveal`}>
          {activeStore === 'Apparel'
            ? 'Tees, hats, beanies, and combo fits are live now with shipping, pickup, and local delivery options.'
            : 'Flower, concentrates, edibles, disposables, and smoking accessories are separated here for local 21+ pickup and delivery.'}
        </div>

        <div className={`${styles.searchBar} reveal`}>
          <input
            type="text"
            placeholder={activeStore === 'Apparel' ? 'Search apparel...' : 'Search local menu...'}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={`${styles.filterTabs} reveal`}>
          {STORE_CATEGORIES[activeStore].map((category) => (
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
              <div className={`${styles.imageWrapper} ${product.hoverImage ? styles.withHover : ''}`}>
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
              <p className={styles.price}>
                {product.price === null ? 'CALL FOR DONATION' : `$${product.price}`}
              </p>
              <p className={styles.fulfillment}>
                {product.pickupOnly ? '21+ ONLY • IN-STORE PICKUP ONLY' : 'Shipping, pickup, or delivery'}
              </p>
              <button
                type="button"
                className={styles.addBtn}
                onClick={(event) => {
                  if (product.price === null) {
                    event.preventDefault();
                    window.location.href = 'tel:6615011881';
                  } else {
                    handleAdd(event, product);
                  }
                }}
              >
                {product.category === 'Combos'
                  ? 'Build the Combo'
                  : product.price === null
                    ? 'CALL TO RESERVE'
                    : 'Add to Cart'}
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
