import { useState, useEffect } from 'react';
import { classApi } from '../api/endpoints';

export const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await classApi.getAll();
        setClasses(response.data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerContainer}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div style={styles.centerContainer}>
        <p style={styles.emptyText}>No classes available</p>
      </div>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>Available Classes</h2>
        <div style={styles.grid}>
          {classes.map((cls) => (
            <ClassCard key={cls.id} classItem={cls} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ClassCard = ({ classItem }) => {
  const availablePercentage = (classItem.availableSeats / classItem.totalSeats) * 100;
  const isAvailable = classItem.availableSeats > 0;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.className}>{classItem.name}</h3>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: isAvailable ? 'var(--accent-bg)' : '#fee2e2',
          color: isAvailable ? 'var(--accent)' : 'var(--error)',
        }}>
          {isAvailable ? 'Available' : 'Full'}
        </span>
      </div>

      <div style={styles.cardBody}>
        <p style={styles.section_}>Section: <strong>{classItem.section}</strong></p>

        <div style={styles.seatsInfo}>
          <div style={styles.seatStat}>
            <span style={styles.statLabel}>Total Seats</span>
            <span style={styles.statValue}>{classItem.totalSeats}</span>
          </div>
          <div style={styles.seatStat}>
            <span style={styles.statLabel}>Available</span>
            <span style={{...styles.statValue, color: isAvailable ? 'var(--success)' : 'var(--error)'}}>
              {classItem.availableSeats}
            </span>
          </div>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${availablePercentage}%`,
              }}
            />
          </div>
          <p style={styles.progressText}>{Math.round(availablePercentage)}% available</p>
        </div>
      </div>

      <button 
        style={{
          ...styles.applyBtn,
          opacity: isAvailable ? 1 : 0.5,
          cursor: isAvailable ? 'pointer' : 'not-allowed',
        }}
        disabled={!isAvailable}
        onMouseEnter={(e) => {
          if (isAvailable) e.target.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          if (isAvailable) e.target.style.backgroundColor = 'var(--accent)';
        }}
      >
        {isAvailable ? 'Apply Now' : 'Class Full'}
      </button>
    </div>
  );
};

const styles = {
  section: {
    padding: '40px 20px',
    backgroundColor: 'var(--bg)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '32px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    padding: '20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '12px',
  },
  className: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-h)',
    margin: 0,
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
  },
  section_: {
    fontSize: '14px',
    color: 'var(--text)',
    marginBottom: '16px',
  },
  seatsInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  seatStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text)',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-h)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressBar: {
    height: '6px',
    backgroundColor: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--success)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: 'var(--text)',
  },
  applyBtn: {
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    margin: '20px',
    marginTop: '0',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '60vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '16px',
    color: 'var(--text)',
  },
  errorText: {
    fontSize: '16px',
    color: 'var(--error)',
  },
  emptyText: {
    fontSize: '16px',
    color: 'var(--text)',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
