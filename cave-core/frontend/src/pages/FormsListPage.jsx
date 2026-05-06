import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function FormsListPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const { data } = await api.get('/forms');
        setForms(data.data);
      } catch (err) {
        setError('Failed to load forms');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return <div className="loading-state">Loading Forms...</div>;

  return (
    <div className="forms-list-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Forms Library</h1>
          <p className="page-subtitle">Manage and assign data collection templates.</p>
        </div>
        <Link to="/forms/new" className="btn btn-primary">Create New Form</Link>
      </div>

      <div className="forms-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {forms.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-muted)' }}>No forms created yet.</p>
          </div>
        ) : (
          forms.map(form => (
            <div key={form._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  v{form.version}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{form.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {form.targetTiers.map(tier => (
                  <span key={tier} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {tier}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/forms/edit/${form._id}`} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>Edit Structure</Link>
                <Link to={`/submissions/new?formId=${form._id}`} className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>Submit Data</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
