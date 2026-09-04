export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__mark" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="var(--danger-600)" strokeWidth="1.5" />
          <path d="M14 8v7" stroke="var(--danger-600)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="19" r="1.1" fill="var(--danger-600)" />
        </svg>
      </div>
      <div className="error-state__body">
        <p className="error-state__title">Couldn&rsquo;t load this</p>
        <p className="error-state__message">
          {message || "Something went wrong on a slow or dropped connection."}
        </p>
      </div>
      {onRetry && (
        <button type="button" className="error-state__retry" onClick={onRetry}>
          Try again
        </button>
      )}
      <style jsx>{`
        .error-state {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--danger-100);
          border: 1px solid var(--danger-600);
          border-radius: var(--radius-md);
        }
        .error-state__body {
          flex: 1;
        }
        .error-state__title {
          margin: 0;
          font-weight: 600;
          color: var(--ink-900);
        }
        .error-state__message {
          margin: 2px 0 0;
          color: var(--ink-700);
          font-size: 0.9375rem;
        }
        .error-state__retry {
          background: var(--surface);
          border: 1px solid var(--danger-600);
          color: var(--danger-600);
          padding: 8px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 600;
          white-space: nowrap;
        }
        .error-state__retry:hover {
          background: var(--danger-600);
          color: var(--surface);
        }
      `}</style>
    </div>
  );
}
