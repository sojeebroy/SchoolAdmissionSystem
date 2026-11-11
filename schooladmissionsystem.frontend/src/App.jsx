import { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StudentIdForm } from './components/StudentIdForm';
import { ClassList } from './components/ClassList';
import { MyApplications } from './components/MyApplications';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  const { studentId } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('hero');

  const handleGetStarted = () => {
    setCurrentPage('classes');
  };

  return (
    <div style={styles.app}>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      {!studentId ? (
        <StudentIdForm onSubmit={() => setCurrentPage('classes')} />
      ) : (
        <>
          {currentPage === 'hero' && (
            <HeroSection onGetStarted={handleGetStarted} />
          )}
          {currentPage === 'classes' && (
            <ClassList />
          )}
          {currentPage === 'applications' && (
            <MyApplications />
          )}
          {currentPage === 'admin' && (
            <AdminPanel />
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
  },
};

export default App;
