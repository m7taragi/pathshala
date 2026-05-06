import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DynamicForm from '../features/submissions/DynamicForm';
import api from '../services/api';

export default function SubmissionPage() {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState(null);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState('');

  useEffect(() => {
    if (!formId) {
      setError('No form ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [formRes, officeRes] = await Promise.all([
          api.get(`/forms/${formId}`),
          api.get('/offices')
        ]);
        
        setTemplate(formRes.data.data);
        // Only show offices that match the form's target tiers
        const validOffices = officeRes.data.data.filter(o => 
          formRes.data.data.targetTiers.includes(o.tier)
        );
        setOffices(validOffices);
        
        if (validOffices.length > 0) setSelectedOffice(validOffices[0]._id);
      } catch (err) {
        setError('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  const handleSubmit = async (formData) => {
    try {
      await api.post('/submissions', {
        formTemplateId: formId,
        officeId: selectedOffice,
        data: formData
      });
      navigate('/submissions');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit data');
    }
  };

  if (loading) return <div className="loading-state">Loading Form...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="submission-page">
      <div className="page-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-title">{template.title}</h1>
        <p className="page-subtitle">Submission for version {template.version}</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="form-group" style={{ maxWidth: '400px' }}>
          <label className="form-label">Submitting Office</label>
          <select 
            className="form-input" 
            value={selectedOffice} 
            onChange={(e) => setSelectedOffice(e.target.value)}
          >
            {offices.map(o => (
              <option key={o._id} value={o._id}>{o.name} ({o.tier})</option>
            ))}
          </select>
        </div>
      </div>

      <DynamicForm structure={template.structure} onSubmit={handleSubmit} />
    </div>
  );
}
