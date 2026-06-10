const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

const scoreBands = [
  { label: 'Excellent', value: '>= 8' },
  { label: 'Good', value: '6 - 8' },
  { label: 'Average', value: '4 - 6' },
];

const topSubjects = [
  { label: 'Math', value: 'Group A' },
  { label: 'Physics', value: 'Group A' },
  { label: 'Chemistry', value: 'Group A' },
];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <h1 className="brand__name">G-Scores</h1>
          <span className="brand__meta">National exam score dashboard</span>
        </div>
        <span className="status-pill">API: {apiBaseUrl}</span>
      </header>

      <section className="workspace" aria-label="G-Scores dashboard">
        <article className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Candidate Lookup</h2>
          </div>
          <div className="panel__body">
            <div className="input-row">
              <input aria-label="Candidate registration number" placeholder="Registration number" />
              <button type="button">Search</button>
            </div>
            <div className="metric-grid" aria-label="Score level summary">
              {scoreBands.map((band) => (
                <div className="metric" key={band.label}>
                  <p className="metric__label">{band.label}</p>
                  <p className="metric__value">{band.value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Top Group A</h2>
          </div>
          <div className="panel__body">
            <div className="table-preview">
              {topSubjects.map((subject) => (
                <div className="table-row" key={subject.label}>
                  <span>{subject.label}</span>
                  <strong>{subject.value}</strong>
                </div>
              ))}
            </div>
            <span className="api-url">{apiBaseUrl}</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
