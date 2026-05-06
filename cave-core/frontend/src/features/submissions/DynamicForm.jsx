import { useState } from 'react';

export default function DynamicForm({ structure, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleInputChange = (questionId, value) => {
    setFormData({ ...formData, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {structure.map((heading, hIdx) => (
        <div key={hIdx} className="form-section glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--accent-primary)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{heading.headingTitle}</h2>
          
          {heading.subHeadings.map((sub, sIdx) => (
            <div key={sIdx} className="form-subsection" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-secondary)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--bg-tertiary)' }}>
                {sub.subHeadingTitle}
              </h3>

              <div className="questions-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {sub.questions.map((q, qIdx) => {
                  const qId = `${hIdx}-${sIdx}-${qIdx}`; // Using coordinates as temporary ID since model doesn't have unique Q IDs yet
                  return (
                    <div key={qIdx} className="form-group">
                      <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        {q.text} {q.isRequired && <span style={{ color: 'var(--accent-danger)' }}>*</span>}
                      </label>
                      
                      {q.type === 'text' && (
                        <input
                          type="text"
                          className="form-input"
                          required={q.isRequired}
                          onChange={(e) => handleInputChange(qId, e.target.value)}
                        />
                      )}

                      {q.type === 'number' && (
                        <input
                          type="number"
                          className="form-input"
                          required={q.isRequired}
                          onChange={(e) => handleInputChange(qId, parseFloat(e.target.value))}
                        />
                      )}

                      {q.type === 'boolean' && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="radio" name={qId} required={q.isRequired} onChange={() => handleInputChange(qId, true)} /> Yes
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="radio" name={qId} required={q.isRequired} onChange={() => handleInputChange(qId, false)} /> No
                          </label>
                        </div>
                      )}

                      {q.type === 'choice' && (
                        <select className="form-input" required={q.isRequired} onChange={(e) => handleInputChange(qId, e.target.value)}>
                          <option value="">Select an option</option>
                          {q.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 3rem' }}>Submit Report</button>
      </div>
    </form>
  );
}
