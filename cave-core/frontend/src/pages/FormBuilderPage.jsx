import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilder from '../features/formBuilder/FormBuilder';
import api from '../services/api';

export default function FormBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTemplate = async () => {
        try {
          const { data } = await api.get(`/forms/${id}`);
          setTemplate(data.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch template');
        } finally {
          setLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [id]);

  const handleSave = async (formData) => {
    try {
      if (id) {
        await api.put(`/forms/${id}`, formData);
      } else {
        await api.post('/forms', formData);
      }
      navigate('/forms');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save template');
    }
  };

  if (loading) return <div className="loading-state">Loading Builder...</div>;

  return (
    <div className="form-builder-page">
      <div className="page-header">
        <h1 className="page-title">{id ? 'Edit Form' : 'Create New Form'}</h1>
        <p className="page-subtitle">Configure structure, tiers, and roles.</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <FormBuilder initialData={template} onSave={handleSave} />
    </div>
  );
}
