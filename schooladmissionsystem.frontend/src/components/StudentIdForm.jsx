import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export const StudentIdForm = ({ onSubmit }) => {
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const { setStudentId: setStoredId } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    if (studentId.length !== 17) {
      setError('Student ID must be 17 digits');
      return;
    }

    if (!/^\d+$/.test(studentId)) {
      setError('Student ID must contain only numbers');
      return;
    }

    setError('');
    setStoredId(studentId);
    onSubmit?.(studentId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Enter Your Student ID</h2>
        <p style={styles.description}>
          Your 17-digit birth registration number to access applications
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setError('');
              }}
              placeholder="Enter your 17-digit ID"
              style={styles.input}
              maxLength="17"
            />
            {error && <span style={styles.error}>{error}</span>}
          </div>

          <button 
            type="submit"
            style={styles.submitBtn}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Continue
          </button>
        </form>

        <p style={styles.helpText}>
          Your Student ID is your 17-digit birth registration number
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '20px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: 'var(--text)',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  input: {
    fontSize: '16px',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    fontFamily: 'var(--sans)',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  error: {
    fontSize: '13px',
    color: 'var(--error)',
  },
  submitBtn: {
    fontSize: '16px',
    fontWeight: '500',
    padding: '12px 16px',
    backgroundColor: 'var(--accent)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  helpText: {
    fontSize: '13px',
    color: 'var(--text)',
    textAlign: 'center',
    marginTop: '16px',
  },
};
