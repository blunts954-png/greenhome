'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PRODUCTS, getProductSchema } from '@/lib/products';
import { useCart } from '@/lib/cart-context';
import audioEngine from '@/lib/AudioEngine';
import AgeGate from '@/components/AgeGate';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ slug }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified') === 'true';
    setAgeVerified(isVerified);
  }, []);

  useEffect(() => {
    const found = PRODUCTS.find(p => p.slug === slug);
    if (found) {
      setProduct(found);
    }
  }, [slug]);

  if (!product) return <div className={styles.loading}>Loading Product...</div>;

  const productSchema = getProductSchema(product);

  const handleAdd = () => {
    if (!selectedSize && product.sizes?.length > 1) {
      alert('Please select a size');
      return;
    }
    try { audioEngine.playClick(); } catch(e){}
    addToCart({ ...product, selectedSize, quantity });
  };

  return (
    <div className={styles.wrapper}>
      <AgeGate 
        isActive={product?.storeSection === 'Cannabis' && !ageVerified} 
        onVerify={() => setAgeVerified(true)} 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className={styles.container}>
        <div className={styles.media}>
          <div className={styles.mainImage}>
             <Image 
               src={product.image} 
               alt={product.name} 
               fill
               style={{ objectFit: 'cover' }}
               priority
             />
          </div>
          {product.hoverImage && (
            <div className={styles.secondaryImage}>
                 <Image 
                   src={product.hoverImage} 
                   alt={`${product.name} Alternate`} 
                   fill
                   style={{ objectFit: 'cover' }}
                 />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <span className={styles.category}>{product.category}</span>
          <h1 className="brand-font">{product.name}</h1>
          <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < product.rating ? styles.starFilled : styles.starEmpty}>★</span>
              ))}
              <span className={styles.reviewCount}>(Reviews Coming Soon)</span>
          </div>
          
          <p className={styles.price}>${product.price}</p>
          
          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          <div className={styles.form}>
            {product.sizes?.length > 0 && (
              <div className={styles.sizeSelection}>
                <label>Select Size</label>
                <div className={styles.sizeGrid}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => {
                          setSelectedSize(size);
                          try { audioEngine.playClick(); } catch(e){}
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
              Add to Cart
            </button>
          </div>

          {product.details?.length > 0 && (
            <div className={styles.productDetails}>
              <label>Product Details</label>
              <ul>
                {product.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={styles.shippingIndicator}>
             <span>✓ Free Valley Shipping over $150</span>
             <span>✓ Discrete Packaging</span>
          </div>
        </div>
      </div>
    </div>
  );
}
