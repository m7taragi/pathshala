import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GravityGrid from '../features/dashboard/GravityGrid';
import api from '../services/api';

export default function DataCrunchPage() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const officeId = searchParams.get('officeId');
  
  const [data, setData] = useState(null);
  const [forms, setForms] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedForm, setSelectedForm] = useState(formId || '');
  const [selectedOffice, setSelectedOffice] = useState(officeId || '');

  useEffect(() => {
    const fetchSelectors = async () => {
      try {
        const [formsRes, officeRes] = await Promise.all([
          api.get('/forms'),
          api.get('/offices')
        ]);
        setForms(formsRes.data.data);
        setOffices(officeRes.data.data);
        
        if (!selectedForm && formsRes.data.data.length > 0) setSelectedForm(formsRes.data.data[0]._id);
        if (!selectedOffice && officeRes.data.data.length > 0) setSelectedOffice(officeRes.data.data[0]._id);
      } catch (err) {
        setError('Failed to load selectors');
      }
    };
    fetchSelectors();
  }, []);

  useEffect(() => {
    if (selectedForm && selectedOffice) {
      const fetchAggregation = async () => {
        setLoading(true);
        try {
          const { data } = await api.get(`/submissions/aggregate/${selectedForm}/${selectedOffice}`);
          setData(data.data);
        } catch (err) {
          setError('Failed to aggregate data');
        } finally {
          setLoading(false);
        }
      };
      fetchAggregation();
    }
  }, [selectedForm, selectedOffice]);

  return (
    <div className="data-crunch-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Data Crunch & Drill-Down</h1>
        <p className="page-subtitle">Automatic gravity roll-up from District to Head Office.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
          <label className="form-label">Select Form Template</label>
          <select className="form-input" value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
            {forms.map(f => <option key={f._id} value={f._id}>{f.title} (v{f.version})</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
          <label className="form-label">Parent Office (Context)</label>
          <select className="form-input" value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
            {offices.map(o => <option key={o._id} value={o._id}>{o.name} ({o.tier})</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Crunching numbers...</div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <GravityGrid data={data} />
      )}
    </div>
  );
}
