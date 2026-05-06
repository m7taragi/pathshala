import './GravityGrid.css';

export default function GravityGrid({ data }) {
  if (!data || !data.grid) return null;

  // Extract all unique question IDs/Labels from the data
  // In a real app, we'd fetch the FormTemplate structure to get labels,
  // but for now we'll derive from the 'data' Mixed object.
  const questionKeys = Array.from(
    new Set(data.grid.flatMap(row => Object.keys(row.data || {})))
  );

  return (
    <div className="gravity-grid-container">
      <div className="grid-meta glass-panel">
        <div className="meta-item">
          <span className="meta-label">Submitted</span>
          <span className="meta-value">{data.submittedCount} / {data.totalDescendants + 1}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Reporting Rate</span>
          <span className="meta-value">
            {Math.round((data.submittedCount / (data.totalDescendants + 1)) * 100)}%
          </span>
        </div>
      </div>

      <div className="glass-panel overflow-auto" style={{ padding: 0 }}>
        <table className="gravity-table">
          <thead>
            <tr>
              <th className="sticky-col">Office Node</th>
              {questionKeys.map(key => (
                <th key={key}>{key.split('-').pop()}</th> 
              ))}
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {data.grid.map((row, i) => (
              <tr key={i}>
                <td className="sticky-col font-bold">
                  <div className="node-cell">
                    <span className={`tier-badge tier-${row.officeTier.toLowerCase()}`}>
                      {row.officeTier[0]}
                    </span>
                    {row.officeName}
                  </div>
                </td>
                {questionKeys.map(key => (
                  <td key={key} className={typeof row.data[key] === 'number' ? 'text-right' : ''}>
                    {row.data[key]?.toString() || '—'}
                  </td>
                ))}
                <td className="text-muted text-xs">
                  {new Date(row.submissionDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
            
            {/* Rolled up Totals Row */}
            <tr className="totals-row">
              <td className="sticky-col font-bold">∑ TOTAL (GRAVITY)</td>
              {questionKeys.map(key => (
                <td key={key} className="text-right font-bold">
                  {data.totals[key] !== undefined ? data.totals[key] : '—'}
                </td>
              ))}
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {data.missingOffices.length > 0 && (
        <div className="red-alerts glass-panel">
          <h3>🚩 Red Alerts (Missing Reports)</h3>
          <div className="alerts-grid">
            {data.missingOffices.map(o => (
              <div key={o._id} className="alert-badge">
                {o.name} ({o.tier})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
