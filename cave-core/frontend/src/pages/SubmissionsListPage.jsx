import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function SubmissionsListPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>View Data</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
