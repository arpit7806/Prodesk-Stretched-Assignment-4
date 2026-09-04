export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div role="status" aria-live="polite" className="skeleton-wrap">
      <span className="sr-only">Loading member records…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i} aria-hidden="true">
          <div className="skeleton-block skeleton-block--name" />
          <div className="skeleton-block skeleton-block--tier" />
          <div className="skeleton-block skeleton-block--miles" />
          <div className="skeleton-block skeleton-block--status" />
        </div>
      ))}
      <style jsx>{`
        .skeleton-wrap {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .skeleton-row {
          display: flex;
          gap: var(--space-2);
          padding: var(--space-2);
          background: var(--surface);
          border: 1px solid var(--ink-100);
          border-radius: var(--radius-md);
        }
        .skeleton-block {
          height: 16px;
          border-radius: var(--radius-sm);
          background: linear-gradient(
            90deg,
            var(--ink-100) 25%,
            var(--ink-200) 37%,
            var(--ink-100) 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        .skeleton-block--name {
          width: 28%;
        }
        .skeleton-block--tier {
          width: 14%;
        }
        .skeleton-block--miles {
          width: 18%;
        }
        .skeleton-block--status {
          width: 12%;
          margin-left: auto;
        }
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-block {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
