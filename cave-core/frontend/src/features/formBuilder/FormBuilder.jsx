import { useState, useEffect } from 'react';
import './FormBuilder.css';

export default function FormBuilder({ initialData, onSave }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [targetTiers, setTargetTiers] = useState(initialData?.targetTiers || ['District']);
  const [structure, setStructure] = useState(initialData?.structure || [
    {
      headingTitle: 'General Information',
      subHeadings: [
        {
          subHeadingTitle: 'Basic Details',
          questions: [
            { text: 'Full Name', type: 'text', isRequired: true, options: [] }
          ]
        }
      ]
    }
  ]);

  const tiers = ['Head', 'Regional', 'Zonal', 'District'];

  const addHeading = () => {
    setStructure([...structure, { headingTitle: 'New Heading', subHeadings: [] }]);
  };

  const removeHeading = (hIdx) => {
    setStructure(structure.filter((_, i) => i !== hIdx));
  };

  const addSubHeading = (hIdx) => {
    const newStructure = [...structure];
    newStructure[hIdx].subHeadings.push({ subHeadingTitle: 'New Sub-Heading', questions: [] });
    setStructure(newStructure);
  };

  const removeSubHeading = (hIdx, sIdx) => {
    const newStructure = [...structure];
    newStructure[hIdx].subHeadings = newStructure[hIdx].subHeadings.filter((_, i) => i !== sIdx);
    setStructure(newStructure);
  };

  const addQuestion = (hIdx, sIdx) => {
    const newStructure = [...structure];
    newStructure[hIdx].subHeadings[sIdx].questions.push({
      text: 'New Question',
      type: 'text',
      isRequired: false,
      options: []
    });
    setStructure(newStructure);
  };

  const removeQuestion = (hIdx, sIdx, qIdx) => {
    const newStructure = [...structure];
    newStructure[hIdx].subHeadings[sIdx].questions = newStructure[hIdx].subHeadings[sIdx].questions.filter((_, i) => i !== qIdx);
    setStructure(newStructure);
  };

  const updateQuestion = (hIdx, sIdx, qIdx, field, value) => {
    const newStructure = [...structure];
    newStructure[hIdx].subHeadings[sIdx].questions[qIdx][field] = value;
    setStructure(newStructure);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check if there's at least one question in the entire structure
    const totalQuestions = structure.reduce((acc, heading) => {
      return acc + heading.subHeadings.reduce((subAcc, sub) => subAcc + sub.questions.length, 0);
    }, 0);

    if (totalQuestions === 0) {
      alert('Your form must have at least one question.');
      return;
    }

    onSave({ title, targetTiers, structure });
  };


  return (
    <div className="ultra-builder">
      <form onSubmit={handleSubmit}>
        <section className="builder-settings glass-panel">
          <div className="form-group">
            <label className="form-label">Form Title</label>
            <input
              className="form-input title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Daily Progress Report"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Office Tiers</label>
            <div className="tier-chips">
              {tiers.map(tier => (
                <label key={tier} className={`tier-chip ${targetTiers.includes(tier) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={targetTiers.includes(tier)}
                    onChange={(e) => {
                      if (e.target.checked) setTargetTiers([...targetTiers, tier]);
                      else setTargetTiers(targetTiers.filter(t => t !== tier));
                    }}
                  />
                  {tier}
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="builder-structure">
          {structure.map((heading, hIdx) => (
            <div key={hIdx} className="builder-heading glass-panel">
              <div className="heading-header">
                <input
                  className="heading-input"
                  value={heading.headingTitle}
                  placeholder="Section Heading (Optional)"
                  onChange={(e) => {
                    const next = [...structure];
                    next[hIdx].headingTitle = e.target.value;
                    setStructure(next);
                  }}
                />

                <button type="button" className="btn-icon btn-danger" onClick={() => removeHeading(hIdx)}>🗑</button>
              </div>

              <div className="sub-headings-container">
                {heading.subHeadings.map((sub, sIdx) => (
                  <div key={sIdx} className="builder-subheading">
                    <div className="subheading-header">
                      <input
                        className="subheading-input"
                        value={sub.subHeadingTitle}
                        placeholder="Sub-section Title (Optional)"
                        onChange={(e) => {
                          const next = [...structure];
                          next[hIdx].subHeadings[sIdx].subHeadingTitle = e.target.value;
                          setStructure(next);
                        }}
                      />

                      <button type="button" className="btn-icon" onClick={() => removeSubHeading(hIdx, sIdx)}>✕</button>
                    </div>

                    <div className="questions-container">
                      {sub.questions.map((q, qIdx) => (
                        <div key={qIdx} className="builder-question">
                          <div className="question-main">
                            <input
                              className="question-text"
                              value={q.text}
                              onChange={(e) => updateQuestion(hIdx, sIdx, qIdx, 'text', e.target.value)}
                              placeholder="Question text"
                            />
                            <select
                              className="question-type"
                              value={q.type}
                              onChange={(e) => updateQuestion(hIdx, sIdx, qIdx, 'type', e.target.value)}
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="boolean">Yes/No</option>
                              <option value="choice">Multiple Choice</option>
                            </select>
                          </div>
                          
                          {q.type === 'choice' && (
                            <div className="options-editor">
                              <input 
                                className="options-input"
                                placeholder="Comma separated options"
                                value={q.options.join(', ')}
                                onChange={(e) => updateQuestion(hIdx, sIdx, qIdx, 'options', e.target.value.split(',').map(s => s.trim()))}
                              />
                            </div>
                          )}

                          <div className="question-footer">
                            <label className="required-toggle">
                              <input
                                type="checkbox"
                                checked={q.isRequired}
                                onChange={(e) => updateQuestion(hIdx, sIdx, qIdx, 'isRequired', e.target.checked)}
                              />
                              Required
                            </label>
                            <button type="button" className="btn-icon btn-danger" onClick={() => removeQuestion(hIdx, sIdx, qIdx)}>🗑</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="btn-add-q" onClick={() => addQuestion(hIdx, sIdx)}>+ Add Question</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn-add-sub" onClick={() => addSubHeading(hIdx)}>+ Add Sub-Heading</button>
              </div>
            </div>
          ))}
        </div>

        <div className="builder-actions">
          <button type="button" className="btn btn-secondary" onClick={addHeading}>+ Add Section</button>
          <button type="submit" className="btn btn-primary btn-save">Save Form Template</button>
        </div>
      </form>
    </div>
  );
}
