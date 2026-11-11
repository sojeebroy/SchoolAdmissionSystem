import { useState, useEffect } from 'react';
import { classApi } from '../api/endpoints';

export const AdminPanel = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    totalSeats: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.getAll();
      const classesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.section || !formData.totalSeats) {
      alert('All fields are required');
      return;
    }

    try {
      if (editingId) {
        await classApi.update(editingId, {
          name: formData.name,
          section: formData.section,
          totalSeats: parseInt(formData.totalSeats),
        });
        alert('Class updated successfully!');
      } else {
        await classApi.create({
          name: formData.name,
          section: formData.section,
          totalSeats: parseInt(formData.totalSeats),
        });
        alert('Class created successfully!');
      }
      resetForm();
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save class');
    }
  };

  const handleEdit = (classItem) => {
    setEditingId(classItem.id);
    setFormData({
      name: classItem.name,
      section: classItem.section,
      totalSeats: classItem.totalSeats.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? This cannot be undone.')) {
      return;
    }

    try {
      await classApi.delete(classId);
      alert('Class deleted successfully!');
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete class');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: '',
      section: '',
      totalSeats: '',
    });
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Admin Panel - Manage Classes</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...styles.primaryBtn,
              backgroundColor: showForm ? '#ef4444' : 'var(--success)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = showForm ? '#dc2626' : '#059669';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = showForm ? '#ef4444' : 'var(--success)';
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add New Class'}
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>
              {editingId ? 'Edit Class' : 'Create New Class'}
            </h3>

            <div style={styles.formGroup}>
              <label style={styles.label}>Class Name *</label>
              <input
                type="text"
                placeholder="e.g., Class 6-A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Section *</label>
              <input
                type="text"
                placeholder="e.g., A, B, C"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Total Seats *</label>
              <input
                type="number"
                placeholder="e.g., 30"
                min="1"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formActions}>
              <button
                type="submit"
                style={styles.submitBtn}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--accent)')}
              >
                {editingId ? '💾 Update Class' : '✓ Create Class'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={styles.classesSection}>
          <h3 style={styles.subtitle}>All Classes ({classes.length})</h3>

          {loading ? (
            <div style={styles.centerContainer}>
              <div style={styles.spinner}></div>
              <p>Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div style={styles.centerContainer}>
              <p style={styles.emptyText}>No classes yet. Create your first class!</p>
            </div>
          ) : (
            <div style={styles.classesGrid}>
              {classes.map((classItem) => (
                <div key={classItem.id} style={styles.classCard}>
                  <div style={styles.cardHeader}>
                    <h4 style={styles.className}>{classItem.name}</h4>
                    <span style={styles.sectionBadge}>Section {classItem.section}</span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Total Seats:</span>
                      <span style={styles.statValue}>{classItem.totalSeats}</span>
                    </div>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Confirmed:</span>
                      <span style={styles.statValue}>{classItem.confirmedSeats}</span>
                    </div>
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Available:</span>
                      <span style={{
                        ...styles.statValue,
                        color: classItem.availableSeats > 0 ? 'var(--success)' : 'var(--error)',
                      }}>
                        {classItem.availableSeats}
                      </span>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <button
                      onClick={() => handleEdit(classItem)}
                      style={styles.editBtn}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#0891b2')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#06b6d4')}
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(classItem.id)}
                      style={styles.deleteBtn}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: '40px 20px',
    backgroundColor: 'var(--bg)',
    minHeight: '80vh',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--text-h)',
    margin: 0,
  },
  primaryBtn: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  errorBox: {
    padding: '16px',
    marginBottom: '24px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  form: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: 'var(--shadow)',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '24px',
    marginTop: 0,
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text)',
    marginBottom: '8px',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    backgroundColor: 'var(--bg)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  submitBtn: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cancelBtn: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  classesSection: {
    marginTop: '40px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '20px',
  },
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '40vh',
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
  emptyText: {
    fontSize: '16px',
    color: 'var(--text)',
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  classCard: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    padding: '16px',
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
  sectionBadge: {
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: 'var(--accent-bg)',
    color: 'var(--accent)',
    padding: '4px 12px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  cardBody: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  statLabel: {
    color: 'var(--text)',
    fontWeight: '500',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-h)',
  },
  cardFooter: {
    padding: '12px 16px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#06b6d4',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
