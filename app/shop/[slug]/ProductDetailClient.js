'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProductSchema } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import AgeGate from '@/components/AgeGate';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.length === 1 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [ageVerified, setAgeVerified] = useState(false);
  const isCannabis = product.storeSection === 'cannabis';

  const productSchema = getProductSchema(product);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified') === 'true';
    setAgeVerified(isVerified);
  }, []);

  const handleAdd = () => {
    if (!selectedSize && product.sizes?.length > 1) {
      alert('Please select a size');
      return;
    }

    try {
      audioEngine.playClick();
    } catch (error) {}

    addToCart({ ...product, selectedSize, quantity });
  };

  return (
    <div className={styles.wrapper}>
      <AgeGate isActive={isCannabis && !ageVerified} onVerify={() => setAgeVerified(true)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.mainImage}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: isCannabis ? 'cover' : 'contain' }} priority />
          </div>
          {product.hoverImage && (
            <div className={styles.secondaryImage}>
              <Image src={product.hoverImage} alt={`${product.name} Alternate`} fill style={{ objectFit: isCannabis ? 'cover' : 'contain' }} />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <span className={styles.category}>{product.category}</span>
          <h1 className="brand-font">{product.name}</h1>
          <div className={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <span key={index} className={index < product.rating ? styles.starFilled : styles.starEmpty}>
                ★
              </span>
            ))}
            <span className={styles.reviewCount}>(Reviews Coming Soon)</span>
          </div>

          <p className={styles.price}>${product.price}</p>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          {product.comboNote && <p className={styles.comboNote}>{product.comboNote}</p>}

          <div className={styles.fulfillmentNote}>
            {isCannabis
              ? '21+ only. Cannabis reservations are for Bakersfield pickup only and require valid ID at fulfillment.'
              : 'Apparel and accessories can ship nationwide with Stripe card checkout, or be arranged for Bakersfield pickup.'}
          </div>

          <div className={styles.form}>
            {product.sizes?.length > 0 && (
              <div className={styles.sizeSelection}>
                <label>Select Size</label>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => {
                        setSelectedSize(size);

                        try {
                          audioEngine.playClick();
                        } catch (error) {}
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.quantitySection}>
              <label>Quantity</label>
              <div className={styles.quantityControls}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button className={styles.addBtn} onClick={handleAdd}>
              {product.category === 'Combos' ? 'Build the Combo' : product.pickupOnly ? 'Reserve Item' : 'Add to Cart'}
            </button>
          </div>

          {product.details?.length > 0 && (
            <div className={styles.productDetails}>
              <label>Product Details</label>
              <ul>
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.shippingIndicator}>
            <span>{isCannabis ? '✓ 21+ ID required at pickup' : '✓ Nationwide apparel shipping available'}</span>
            <span>{isCannabis ? '✓ Bakersfield pickup only' : '✓ Stripe card checkout for shipping orders'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
