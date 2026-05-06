import { useState, useEffect } from 'react';
import OfficeTree from '../features/hierarchy/OfficeTree';
import api from '../services/api';

export default function OfficesPage() {
  const [offices, setOffices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form States
  const [newOffice, setNewOffice] = useState({ name: '', tier: 'District', parent: '' });
  const [editingOffice, setEditingOffice] = useState(null);

  const fetchData = async () => {
    try {
      const officeRes = await api.get('/offices');
      setOffices(officeRes.data.data);
      
      // Fetch users separately so it doesn't block the whole page if it fails (e.g. for non-admins)
      try {
        const userRes = await api.get('/users');
        setUsers(userRes.data.data);
      } catch (uErr) {
        console.warn('Could not fetch users for vacancy dropdown:', uErr.message);
      }
    } catch (err) {
      setError('Failed to load office hierarchy');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOffice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/offices', newOffice);
      setShowAddModal(false);
      setNewOffice({ name: '', tier: 'District', parent: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add office');
    }
  };

  const handleUpdateOffice = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/offices/${editingOffice._id}`, editingOffice);
      setShowEditModal(false);
      setEditingOffice(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update office');
    }
  };

  const handleAddVacancy = () => {
    const next = { ...editingOffice };
    next.vacancies = [...(next.vacancies || []), { title: 'New Post', assignedUser: null, isPrimary: false }];
    setEditingOffice(next);
  };

  const handleUpdateVacancy = (idx, field, value) => {
    const next = { ...editingOffice };
    next.vacancies[idx][field] = value;
    setEditingOffice(next);
  };

  const handleRemoveVacancy = (idx) => {
    const next = { ...editingOffice };
    next.vacancies = next.vacancies.filter((_, i) => i !== idx);
    setEditingOffice(next);
  };

  if (loading) return <div className="loading-state">Loading Hierarchy...</div>;

  return (
    <div className="offices-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Organization Hierarchy</h1>
          <p className="page-subtitle">Manage Head, Regional, Zonal, and District nodes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>Add Office Node</button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="hierarchy-container glass-panel" style={{ padding: '2rem' }}>
        <OfficeTree offices={offices} onEdit={(node) => { setEditingOffice(node); setShowEditModal(true); }} />
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content glass-panel" style={modalContentStyle}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Office Node</h2>
            <form onSubmit={handleAddOffice}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Office Name</label>
                <input className="form-input" value={newOffice.name} onChange={(e) => setNewOffice({...newOffice, name: e.target.value})} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tier</label>
                <select className="form-input" value={newOffice.tier} onChange={(e) => setNewOffice({...newOffice, tier: e.target.value})}>
                  <option value="Head">Head</option>
                  <option value="Regional">Regional</option>
                  <option value="Zonal">Zonal</option>
                  <option value="District">District</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Parent Office</label>
                <select className="form-input" value={newOffice.parent} onChange={(e) => setNewOffice({...newOffice, parent: e.target.value})}>
                  <option value="">No Parent (Root)</option>
                  {offices.map(o => <option key={o._id} value={o._id}>{o.name} ({o.tier})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingOffice && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content glass-panel" style={{ ...modalContentStyle, maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Edit {editingOffice.name}</h2>
            <form onSubmit={handleUpdateOffice}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Office Name</label>
                <input className="form-input" value={editingOffice.name} onChange={(e) => setEditingOffice({...editingOffice, name: e.target.value})} required />
              </div>
              
              <div className="vacancies-section" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>Vacancies / Manpower</h3>
                  <button type="button" className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={handleAddVacancy}>+ Add Post</button>
                </div>
                
                <div className="vacancies-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editingOffice.vacancies?.map((v, i) => (
                    <div key={i} className="vacancy-item glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <input 
                          className="form-input" 
                          placeholder="Post Title" 
                          value={v.title} 
                          onChange={(e) => handleUpdateVacancy(i, 'title', e.target.value)} 
                          style={{ flex: 2 }}
                        />
                        <select 
                          className="form-input" 
                          value={v.assignedUser?._id || v.assignedUser || ''} 
                          onChange={(e) => handleUpdateVacancy(i, 'assignedUser', e.target.value)}
                          style={{ flex: 3 }}
                        >
                          <option value="">Vacant (Unassigned)</option>
                          {users.map(u => <option key={u._id} value={u._id}>{u.email} ({u.role})</option>)}
                        </select>
                        <button type="button" className="btn-icon btn-danger" onClick={() => handleRemoveVacancy(i)}>🗑</button>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <input 
                          type="checkbox" 
                          checked={v.isPrimary} 
                          onChange={(e) => handleUpdateVacancy(i, 'isPrimary', e.target.checked)} 
                        />
                        Primary Base (Office is the user's main station)
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
              </div>
            </form>
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
  width: '95%',
  maxWidth: '400px',
  padding: '2rem',
  maxHeight: '90vh',
  overflowY: 'auto'
};
