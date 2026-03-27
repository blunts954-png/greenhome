'use client';

import styles from './SocialFeed.module.css';
import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';

const POSTS = [
  { id: 1, type: 'image', label: 'LOOKBOOK', image: '/images/culture/culture-1.png', caption: 'Drop-ready colorways and brand staples.' },
  { id: 2, type: 'image', label: 'FOUNDATION', image: '/images/culture/culture-2.png', caption: 'Core black pieces built around the Money Tree identity.' },
  { id: 3, type: 'image', label: 'BAKERSFIELD', image: '/images/culture/culture-3.png', caption: 'Rooted in the 661 with local-first energy.' },
  { id: 4, type: 'image', label: 'HGM', image: '/images/culture/culture-4.png', caption: 'Streetwear and local menu culture in one brand world.' }
];

export default function SocialFeed() {
  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.container}>
        <div className={styles.header}>
            <div className={styles.brandTitle}>
               <Instagram size={24} className={styles.instaIcon} />
               <h2 className="brand-font">THE CULTURE</h2>
            </div>
            <p>Direct from the 661. Follow the brand across Instagram and the live storefront.</p>
        </div>
        <div className={styles.feed}>
          {POSTS.map(post => (
            <div key={post.id} className={styles.post}>
              <div className={styles.mediaWrapper}>
                  <Image 
                    src={post.image} 
                    alt={post.caption} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className={styles.postImg}
                  />
                  <div className={styles.overlay}>
                    <div className={styles.overlayMeta}>
                        <span className={styles.likes}>{post.label}</span>
                        <p>{post.caption}</p>
                    </div>
                  </div>
                  {post.type === 'video' && (
                    <div className={styles.playIcon}><Play size={30} fill="white" /></div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
