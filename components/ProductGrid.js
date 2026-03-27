'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS } from '@/lib/products';
import AgeGate from './AgeGate';
import styles from './ProductGrid.module.css';

const STORES = ['Apparel', 'Cannabis'];
const STORE_CATEGORIES = {
  Apparel: ['All', 'Tees', 'Hats', 'Beanies', 'Combos', 'Accessories'],
  Cannabis: ['All', 'Flower', 'Concentrates', 'Edibles', 'Disposables', 'Pre-Rolls']
};

function getStoreFromSearchParams(searchParams) {
  const store = searchParams.get('store');
  if (store && STORES.map(s => s.toLowerCase()).includes(store.toLowerCase())) {
    return STORES.find(s => s.toLowerCase() === store.toLowerCase());
  }
  return 'Apparel';
}

function GridContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  const [activeStore, setActiveStore] = useState(getStoreFromSearchParams(searchParams));
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    setActiveStore(getStoreFromSearchParams(searchParams));
    setActiveFilter('All');
  }, [searchParams]);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified') === 'true';
    setAgeVerified(isVerified);
  }, []);

  useEffect(() => {
    async function loadInventory() {
      if (process.env.NEXT_PUBLIC_ENABLE_MANAGEMENT_TERMINAL !== 'true') return;
      
      try {
        const response = await fetch('/api/coaiadmin/inventory');
        if (response.ok) {
          const data = await response.json();
          setInventoryStatus(data.status || []);
        }
      } catch (err) {
        console.error('Failed to load inventory status:', err);
      }
    }
    loadInventory();
  }, []);

  const handleStoreChange = (store) => {
    setActiveStore(store);
    setActiveFilter('All');
    const params = new URLSearchParams(window.location.search);
    params.set('store', store.toLowerCase());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSizeSelect = (event, productId, size) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    
    const size = selectedSizes[product.id];
    if (product.sizes?.length > 1 && !size) {
      alert('Please select a size first.');
      return;
    }

    addToCart({ ...product, selectedSize: size });
  };

  const filteredProducts = PRODUCTS.filter((product) => {
    const storeMatch = product.storeSection === activeStore.toLowerCase();
    const categoryMatch = activeFilter === 'All' || product.category === activeFilter;
    return storeMatch && categoryMatch;
  });

  return (
    <section className={styles.section} id="shop">
      <AgeGate 
        isActive={activeStore === 'Cannabis' && !ageVerified} 
        onVerify={() => {
          setAgeVerified(true);
          localStorage.setItem('age-verified', 'true');
        }} 
      />

      <div className={styles.container}>
        <div className={styles.storePicker}>
          {STORES.map((store) => (
            <button
              key={store}
              className={`${styles.storeBtn} ${activeStore === store ? styles.activeStore : ''}`}
              onClick={() => handleStoreChange(store)}
            >
              {store === 'Apparel' ? 'Apparel & Accessories' : 'Bakersfield Local Menu'}
            </button>
          ))}
        </div>

        <div className={styles.categoryHead}>
          <Image src="/logo-mark.png" alt="HGM Logo" width={44} height={68} className={styles.catLogo} />
          <h2 className="brand-font reveal">
            {activeStore === 'Apparel' ? 'Apparel & Accessories' : 'Bakersfield Local Menu'}
          </h2>
          {activeStore === 'Cannabis' && (
            <div className={`${styles.callToAction} brand-font reveal`}>
              CALL US NOW: (661) 501-1881
            </div>
          )}
        </div>

        <div className={`${styles.socialProof} reveal`}>
          <span className={styles.stars}>LOCAL</span>
          <span>
            {activeStore === 'Apparel'
              ? 'Apparel ships nationwide or can be arranged for Bakersfield pickup/delivery.'
              : '21+ Kern County residents only. ID required at fulfillment.'}
          </span>
        </div>

        <div className={`${styles.filters} reveal`}>
          {STORE_CATEGORIES[activeStore].map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.filterBtn} ${activeFilter === category ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            const isOutOfStock = inventoryStatus.find(s => s.slug === product.slug)?.is_out_of_stock;
            
            return (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className={`${styles.productCard} ${isOutOfStock ? styles.outOfStock : ''} reveal`}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: activeStore === 'Cannabis' ? 'cover' : 'contain' }}
                    className={styles.pImg}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage}
                      alt={product.name}
                      fill
                      style={{ objectFit: activeStore === 'Cannabis' ? 'cover' : 'contain' }}
                      className={styles.hoverImg}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {isOutOfStock && (
                    <div className={styles.outOfStockBadge}>OUT OF STOCK</div>
                  )}
                </div>
                <div className={styles.details}>
                  <div className={styles.meta}>
                    <span className={styles.category}>{product.category}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <p className={styles.price}>
                    {product.price === null ? 'CALL FOR DONATION' : `$${product.price}`}
                  </p>
                  <p className={styles.fulfillment}>
                    {product.pickupOnly ? '21+ • BAKERSFIELD PICKUP/DELIVERY' : 'Shipping, pickup, or delivery'}
                  </p>
                  <button
                    type="button"
                    className={styles.addBtn}
                    disabled={isOutOfStock}
                    onClick={(event) => {
                      if (isOutOfStock) {
                        event.preventDefault();
                        return;
                      }
                      if (product.price === null) {
                        event.preventDefault();
                        window.location.href = 'tel:6615011881';
                      } else {
                        handleAdd(event, product);
                      }
                    }}
                  >
                    {isOutOfStock ? 'TEMPORARILY OFFLINE' : product.price === null ? 'CALL TO RESERVE' : 'Add to Cart'}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className={styles.empty}>
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductGrid() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading Storefront...</div>}>
      <GridContent />
    </Suspense>
  );
}
