import ConnectionStatus from "./ConnectionStatus";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <span className="app-header__mark" aria-hidden="true">
            ✈
          </span>
          <div>
            <p className="app-header__eyebrow">Ops Console</p>
            <h1>Frequent Flyer Portal</h1>
          </div>
        </div>
        <ConnectionStatus />
      </div>
      <style jsx>{`
        .app-header {
          background: var(--surface);
          border-bottom: 1px solid var(--ink-100);
        }
        .app-header__inner {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--space-3) var(--space-3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .app-header__brand {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .app-header__mark {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ink-900);
          color: var(--surface);
          border-radius: var(--radius-sm);
          font-size: 1.125rem;
          transform: rotate(45deg);
        }
        .app-header__eyebrow {
          margin: 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-300);
        }
        h1 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--ink-900);
        }
      `}</style>
    </header>
  );
}
