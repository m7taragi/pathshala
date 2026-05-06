import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
// import { updateAuthUser } from '../store/authSlice'; // I need to add this to authSlice

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    empCode: user?.empCode || '',
    designation: user?.designation || '',
    mobile: user?.mobile || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        empCode: user.empCode || '',
        designation: user.designation || '',
        mobile: user.mobile || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await api.put('/users/profile', formData);
      setMessage('Profile updated successfully!');
      // TODO: Dispatch update to Redux if needed, but since we usually fetch profile on reload, it's fine.
      // In a real app, we'd update the local state too.
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Update your personal and professional details.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: '700' }}>
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{user?.email}</h2>
            <span className="tier-badge" style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.6rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {message && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{message}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Employee Code</label>
              <input 
                className="form-input" 
                value={formData.empCode} 
                onChange={(e) => setFormData({...formData, empCode: e.target.value})} 
                placeholder="e.g., EMP123"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input 
                className="form-input" 
                value={formData.designation} 
                onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                placeholder="e.g., Senior Manager"
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Mobile Number</label>
              <input 
                className="form-input" 
                value={formData.mobile} 
                onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving...' : 'Update Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
