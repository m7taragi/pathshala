import './DashboardPage.css'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Offices', value: '—', icon: '🏢', color: 'var(--accent-primary)' },
    { label: 'Active Forms', value: '—', icon: '📝', color: 'var(--accent-success)' },
    { label: 'Submissions Today', value: '—', icon: '📤', color: '#8b5cf6' },
    { label: 'Pending Reports', value: '—', icon: '🔴', color: 'var(--accent-danger)' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">Command center overview</p>
      </div>

      <div className="dashboard__stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card glass-panel" style={{ '--stat-accent': s.color }}>
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </div>
            <div className="stat-card__glow" />
          </div>
        ))}
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__card glass-panel">
          <h2 className="dashboard__card-title">📊 Hierarchy Overview</h2>
          <p className="dashboard__card-desc">Head → Regional → Zonal → District</p>
          <div className="dashboard__placeholder">
            <div className="hierarchy-tree">
              <div className="tree-node tree-node--head">Head Office</div>
              <div className="tree-line" />
              <div className="tree-row">
                <div className="tree-node tree-node--regional">Regional A</div>
                <div className="tree-node tree-node--regional">Regional B</div>
              </div>
              <div className="tree-line" />
              <div className="tree-row">
                <div className="tree-node tree-node--zonal">Zonal 1</div>
                <div className="tree-node tree-node--zonal">Zonal 2</div>
                <div className="tree-node tree-node--zonal">Zonal 3</div>
              </div>
              <div className="tree-line" />
              <div className="tree-row">
                <div className="tree-node tree-node--district">District α</div>
                <div className="tree-node tree-node--district">District β</div>
                <div className="tree-node tree-node--district">District γ</div>
                <div className="tree-node tree-node--district">District δ</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__card glass-panel">
          <h2 className="dashboard__card-title">🔴 Red Alerts</h2>
          <p className="dashboard__card-desc">Missing report submissions</p>
          <div className="dashboard__alerts-list">
            <div className="alert-item alert-item--warn">
              <span className="alert-item__dot" />
              <span>No submissions connected yet — start the backend server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
