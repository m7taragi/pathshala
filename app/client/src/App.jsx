import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme } from './store/themeSlice';
import AuthPage from './pages/AuthPage';

// Placeholder for Dashboard
const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome, {userInfo?.name}!</h1>
      <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>You are logged in.</p>
      <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        {/* Dynamic Backgrounds */}
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>

        {/* Theme Toggle Button positioned at top right */}
        <button 
          onClick={() => dispatch(toggleTheme())}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--glass-shadow)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
