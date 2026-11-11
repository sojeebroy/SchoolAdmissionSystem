export const HeroSection = ({ onGetStarted }) => {
  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>
            Secure Your School Seat Today
          </h1>
          <p style={styles.subtitle}>
            Apply for admission, manage your applications, and get instant confirmation. Simple, fast, and secure.
          </p>
          <button 
            onClick={onGetStarted}
            style={styles.primaryBtn}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  hero: {
    padding: '80px 20px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  content: {
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text)',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  primaryBtn: {
    fontSize: '16px',
    fontWeight: '500',
    padding: '12px 32px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
