'use client';

import styles from './SocialFeed.module.css';
import Image from 'next/image';
import { Instagram, Play } from 'lucide-react';

const POSTS = [
  { id: 1, type: 'image', likes: '1.2k', image: '/images/culture/culture-1.png', caption: 'Drop 04: The Roots Collection in Pink.' },
  { id: 2, type: 'image', likes: '840', image: '/images/culture/culture-2.png', caption: 'Core Black for the Foundation. Money grows where we plant it.' },
  { id: 3, type: 'image', likes: '2.5k', image: '/images/culture/culture-3.png', caption: 'Sunset in the 661. Origin stories matter.' },
  { id: 4, type: 'image', likes: '1.1k', image: '/images/culture/culture-4.png', caption: 'Visionary whites. HGM in the wild.' }
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
            <p>Direct from the 661. Join the movement on TikTok & Instagram.</p>
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
                        <span className={styles.likes}>★ {post.likes} LIKES</span>
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
