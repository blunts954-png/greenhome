'use client';

import styles from './SocialFeed.module.css';
import Image from 'next/image';

const POSTS = [
  { id: 1, type: 'video', likes: '1.2k', caption: 'Drop 04: The Roots Collection hit the streets.' },
  { id: 2, type: 'image', likes: '840', caption: 'Valley mornings. Cultivated in Bakersfield.' },
  { id: 3, type: 'video', likes: '2.5k', caption: 'Behind the threads: How we grow.' },
  { id: 4, type: 'image', likes: '1.1k', caption: 'HGM in the wild. Real hustle recognized.' }
];

export default function SocialFeed() {
  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.container}>
        <div className={styles.header}>
            <h2 className="brand-font">The Culture</h2>
            <p>Direct from the 661. Join the movement on TikTok & Instagram.</p>
        </div>
        <div className={styles.feed}>
          {POSTS.map(post => (
            <div key={post.id} className={styles.post}>
              <div className={styles.mediaPlaceholder}>
                  <div className={styles.overlay}>
                    <span>{post.likes} LIKES</span>
                    <p>{post.caption}</p>
                  </div>
                  <div className={styles.icon}>
                    {post.type === 'video' ? '▶' : 'IMAGE'}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
