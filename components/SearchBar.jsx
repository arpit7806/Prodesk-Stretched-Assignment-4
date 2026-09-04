"use client";

export default function SearchBar({ value, onChange, resultCount, totalCount }) {
  return (
    <div className="search-bar">
      <label htmlFor="member-search" className="sr-only">
        Search members by name or member ID
      </label>
      <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="var(--ink-500)" strokeWidth="1.5" />
        <path d="M12.5 12.5L16 16" stroke="var(--ink-500)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        id="member-search"
        type="search"
        placeholder="Search by name or member ID…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {value
          ? `${resultCount} of ${totalCount} members match your search`
          : `Showing all ${totalCount} members`}
      </span>
      <style jsx>{`
        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-bar__icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }
        input {
          width: 100%;
          padding: 12px var(--space-2) 12px 42px;
          border: 1px solid var(--ink-200);
          border-radius: var(--radius-md);
          background: var(--surface);
          font-size: 0.9375rem;
        }
        input::placeholder {
          color: var(--ink-300);
        }
        input:focus-visible {
          border-color: var(--accent-600);
        }
      `}</style>
    </div>
  );
}
