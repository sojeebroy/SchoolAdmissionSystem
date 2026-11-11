import { useAuthStore } from "../stores/authStore";

export const Header = ({ currentPage, onNavigate }) => {
  const { studentId, clearStudentId } = useAuthStore();

  const handleLogout = () => {
    clearStudentId();
    onNavigate?.('hero');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>School Admission</h1>
          <div style={styles.headerRight}>
            {studentId && (
              <>
                <nav style={styles.nav}>
                  <button
                    onClick={() => onNavigate?.('classes')}
                    style={{
                      ...styles.navBtn,
                      backgroundColor: currentPage === 'classes' ? 'var(--accent)' : 'transparent',
                      color: currentPage === 'classes' ? '#ffffff' : 'var(--text)',
                    }}
                  >
                    Available Classes
                  </button>
                  <button
                    onClick={() => onNavigate?.('applications')}
                    style={{
                      ...styles.navBtn,
                      backgroundColor: currentPage === 'applications' ? 'var(--accent)' : 'transparent',
                      color: currentPage === 'applications' ? '#ffffff' : 'var(--text)',
                    }}
                  >
                    My Applications
                  </button>
                  <button
                    onClick={() => onNavigate?.('admin')}
                    style={{
                      ...styles.navBtn,
                      ...styles.adminBtn,
                      backgroundColor: currentPage === 'admin' ? '#7c3aed' : 'transparent',
                      color: currentPage === 'admin' ? '#ffffff' : 'var(--text)',
                    }}
                  >
                    ⚙ Admin
                  </button>
                </nav>
                <span style={styles.studentId}>{studentId}</span>
                <button 
                  onClick={handleLogout}
                  style={styles.logoutBtn}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: 'var(--bg)',
    borderBottom: '1px solid var(--border)',
    padding: '16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-h)',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  navBtn: {
    fontSize: '14px',
    padding: '8px 16px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
  },
  adminBtn: {
    borderColor: '#7c3aed',
  },
  studentId: {
    fontSize: '14px',
    color: 'var(--text)',
    backgroundColor: 'var(--accent-bg)',
    padding: '6px 12px',
    borderRadius: '6px',
  },
  logoutBtn: {
    fontSize: '14px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'var(--accent)',
    border: `1px solid var(--border)`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
