import { useState, useEffect } from 'react';
import { holdApi } from '../api/endpoints';

export const MyApplications = () => {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHolds();
  }, []);

  const fetchHolds = async () => {
    try {
      setLoading(true);
      const response = await holdApi.getStudentHolds();
      const holdsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setHolds(holdsData);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (holdId) => {
    if (window.confirm('Are you sure you want to cancel this application?')) {
      try {
        await holdApi.cancel(holdId);
        setHolds(holds.filter(h => h.id !== holdId));
      } catch (err) {
        alert(err.message || 'Failed to cancel application');
      }
    }
  };

  const handleConfirm = async (holdId) => {
    try {
      await holdApi.confirm(holdId);
      fetchHolds();
    } catch (err) {
      alert(err.message || 'Failed to confirm application');
    }
  };

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading applications...</p>
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

  if (!holds || holds.length === 0) {
    return (
      <div style={styles.centerContainer}>
        <p style={styles.emptyText}>No applications yet</p>
      </div>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>My Applications</h2>
        <div style={styles.listContainer}>
          {holds.map((hold) => (
            <HoldCard 
              key={hold.id} 
              hold={hold}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const HoldCard = ({ hold, onCancel, onConfirm }) => {
  const statusConfig = {
    'Held': { color: '#f59e0b', bg: '#fef3c7', text: 'Pending' },
    'Confirmed': { color: '#10b981', bg: '#d1fae5', text: 'Confirmed' },
    'Expired': { color: '#6b7280', bg: '#f3f4f6', text: 'Expired' },
    'Cancelled': { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled' },
  };

  const config = statusConfig[hold.status] || statusConfig['Held'];
  const canConfirm = hold.status === 'Held';
  const canCancel = ['Held', 'Confirmed'].includes(hold.status);
  const isExpired = hold.status === 'Expired' || hold.status === 'Cancelled';

  const createdAt = new Date(hold.createdAt);
  const expiresAt = new Date(hold.expiresAt);
  const now = new Date();
  const timeRemaining = expiresAt - now;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <h3 style={styles.holdId}>Application {hold.id.substring(0, 8)}</h3>
          <p style={styles.classId}>Class ID: {hold.classId}</p>
        </div>
        <span style={{
          ...styles.statusBadge,
          backgroundColor: config.bg,
          color: config.color,
        }}>
          {config.text}
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Created</span>
            <span style={styles.infoValue}>
              {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Expires</span>
            <span style={styles.infoValue}>
              {expiresAt.toLocaleDateString()} {expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {canConfirm && hoursRemaining > 0 && (
          <div style={styles.timeRemaining}>
            <span style={styles.timeLabel}>
              Time Remaining: <strong>{hoursRemaining}h</strong>
            </span>
          </div>
        )}
      </div>

      {(canConfirm || canCancel) && !isExpired && (
        <div style={styles.cardFooter}>
          {canConfirm && (
            <button
              onClick={() => onConfirm(hold.id)}
              style={styles.confirmBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--success)'}
            >
              Payment
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(hold.id)}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      )}
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
  listContainer: {
    display: 'grid',
    gap: '16px',
  },
  card: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    padding: '20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  holdId: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-h)',
    margin: 0,
  },
  classId: {
    fontSize: '13px',
    color: 'var(--text)',
    margin: 0,
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  cardBody: {
    padding: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '12px',
    color: 'var(--text)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '14px',
    color: 'var(--text-h)',
    fontWeight: '500',
  },
  timeRemaining: {
    padding: '12px 16px',
    backgroundColor: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '8px',
  },
  timeLabel: {
    fontSize: '14px',
    color: '#92400e',
  },
  cardFooter: {
    padding: '16px 20px',
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '12px',
  },
  confirmBtn: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 16px',
    backgroundColor: 'var(--success)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cancelBtn: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: 'var(--error)',
    border: `1px solid var(--error)`,
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
