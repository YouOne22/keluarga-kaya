export default function Loading() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-header">
        <div className="skeleton-line" style={{ width: 140, height: 10 }} />
        <div className="skeleton-line" style={{ width: 220, height: 24, marginTop: 8 }} />
      </div>
      <div className="skeleton-card" style={{ marginTop: 20 }}>
        <div className="skeleton-line" style={{ width: 110, height: 10 }} />
        <div className="skeleton-line" style={{ width: 200, height: 32, marginTop: 10 }} />
        <div className="skeleton-split">
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      </div>
      <div className="skeleton-card" style={{ marginTop: 16 }}>
        <div className="skeleton-line" style={{ width: 160, height: 14 }} />
        <div className="skeleton-line skeleton-row" />
        <div className="skeleton-line skeleton-row" />
        <div className="skeleton-line skeleton-row" />
      </div>
      <div className="skeleton-pulse" />
    </div>
  );
}