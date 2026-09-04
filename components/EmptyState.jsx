export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__mark" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="var(--ink-200)" strokeWidth="1.5" />
          <path d="M12 20h16M20 12v16" stroke="var(--ink-300)" strokeWidth="1.5" strokeLinecap="round" opacity="0" />
          <path d="M13 24l14-8M13 16l14 8" stroke="var(--ink-300)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="empty-state__title">{title}</p>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel && (
        <button type="button" className="empty-state__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-1);
          padding: var(--space-5) var(--space-2);
          background: var(--surface);
          border: 1px dashed var(--ink-200);
          border-radius: var(--radius-md);
        }
        .empty-state__mark {
          margin-bottom: var(--space-1);
        }
        .empty-state__title {
          margin: 0;
          font-weight: 600;
          color: var(--ink-700);
        }
        .empty-state__message {
          margin: 0;
          color: var(--ink-500);
          font-size: 0.9375rem;
          max-width: 32ch;
        }
        .empty-state__action {
          margin-top: var(--space-2);
          background: var(--ink-900);
          color: var(--surface);
          border: none;
          padding: 10px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 0.9375rem;
        }
        .empty-state__action:hover {
          background: var(--ink-700);
        }
      `}</style>
    </div>
  );
}
