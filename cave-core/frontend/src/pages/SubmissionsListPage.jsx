import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function SubmissionsListPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get('/submissions');
        setSubmissions(data.data);
      } catch (err) {
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return <div className="loading-state">Loading Reports...</div>;

  return (
    <div className="submissions-list-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Reports & Submissions</h1>
        <p className="page-subtitle">View and track all submitted data reports.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Office</th>
              <th style={{ padding: '1rem' }}>Form</th>
              <th style={{ padding: '1rem' }}>Version</th>
              <th style={{ padding: '1rem' }}>Submitted By</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No reports submitted yet.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600' }}>{sub.officeId?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.officeId?.tier}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{sub.formTemplateId?.title || 'Unknown Form'}</td>
                  <td style={{ padding: '1rem' }}>v{sub.formVersion}</td>
                  <td style={{ padding: '1rem' }}>{sub.submittedBy?.email}</td>
                  <td style={{ padding: '1rem' }}>{new Date(sub.submissionDate).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View Data
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedSubmission && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content glass-panel" style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Submission Data</h2>
              <button className="btn-icon" onClick={() => setSelectedSubmission(null)}>✕</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>OFFICE</div>
              <div style={{ fontWeight: '600' }}>{selectedSubmission.officeId?.name} ({selectedSubmission.officeId?.tier})</div>
            </div>

            <div className="data-display" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(selectedSubmission.data || {}).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>{key}</div>
                  <div style={{ color: 'var(--text-primary)' }}>{value?.toString() || 'N/A'}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  width: '90%',
  maxWidth: '500px',
  padding: '2rem'
};
