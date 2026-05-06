import { useState } from 'react';
import api from '../services/api';

export default function AdminImportPage() {
  const [officeFile, setOfficeFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleImport = async (type) => {
    const file = type === 'offices' ? officeFile : userFile;
    if (!file) return alert('Please select a file first');

    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post(`/admin/import/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(data.message);
      if (data.errors?.length > 0) {
        console.warn('Import completed with some errors:', data.errors);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type) => {
    const a = document.createElement('a');
    a.href = `/templates/${type}_template.csv`;
    a.download = `${type}_template.csv`;
    a.click();
  };


  return (
    <div className="admin-import-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Bulk Import Center</h1>
        <p className="page-subtitle">Initialize your organization and user base via CSV.</p>
      </div>

      {message && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{message}</div>}
      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="import-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Office Import */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Import Offices</h2>
            <button className="btn btn-ghost" onClick={() => downloadTemplate('offices')} style={{ fontSize: '0.8rem' }}>📥 Template</button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Format: <code>name, tier, parentName</code>. Ensure parents are created before or listed before their children.
          </p>
          <div className="form-group">
            <input type="file" accept=".csv" onChange={(e) => setOfficeFile(e.target.files[0])} />
          </div>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1.5rem', width: '100%' }} 
            onClick={() => handleImport('offices')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload & Process Offices'}
          </button>
        </div>

        {/* User Import */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Import Users</h2>
            <button className="btn btn-ghost" onClick={() => downloadTemplate('users')} style={{ fontSize: '0.8rem' }}>📥 Template</button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Format: <code>email, password, role, empCode, designation, mobile, primaryOfficeName</code>
          </p>
          <div className="form-group">
            <input type="file" accept=".csv" onChange={(e) => setUserFile(e.target.files[0])} />
          </div>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: '1.5rem', width: '100%' }} 
            onClick={() => handleImport('users')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Upload & Process Users'}
          </button>
        </div>
      </div>
    </div>
  );
}
