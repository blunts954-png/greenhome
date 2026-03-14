import styles from './Contact.module.css';

export const metadata = {
  title: "Connect | Home Grown Money",
  description: "Get in touch with the Home Grown Money team. Inquiries, collaborations, and community connections.",
};

export default function ContactPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className="brand-font text-gradient">Connect with Home Grown Money</h1>
          <p className={styles.subtitle}>Money Grows Where We Plant It.</p>
        </div>
      </section>

      <section className={styles.contactForm}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" placeholder="YOUR NAME" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="YOUR EMAIL" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea placeholder="WHAT&apos;S ON YOUR MIND?" className={styles.textarea}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
