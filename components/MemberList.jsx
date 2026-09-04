"use client";

import EmptyState from "./EmptyState";

const TIER_ORDER = { Diamond: 0, Platinum: 1, Gold: 2, Silver: 3 };

function TierBadge({ tier }) {
  return (
    <span className={`tier-badge tier-badge--${tier.toLowerCase()}`}>
      {tier}
      <style jsx>{`
        .tier-badge {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-data);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid var(--ink-300);
          color: var(--ink-700);
          background: var(--surface-muted);
        }
        .tier-badge--diamond {
          border-color: var(--ink-900);
          color: var(--ink-900);
          font-weight: 600;
        }
        .tier-badge--platinum {
          border-color: var(--ink-500);
        }
      `}</style>
    </span>
  );
}

function StatusPill({ status }) {
  const active = status === "Active";
  return (
    <span className={`status-pill ${active ? "status-pill--active" : "status-pill--suspended"}`}>
      <span className="status-pill__dot" aria-hidden="true" />
      {status}
      <style jsx>{`
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--ink-700);
        }
        .status-pill__dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .status-pill--active .status-pill__dot {
          background: var(--success-600);
        }
        .status-pill--suspended .status-pill__dot {
          background: var(--danger-600);
        }
      `}</style>
    </span>
  );
}

export default function MemberList({ members, onEdit, onDelete, searchTerm, onClearSearch }) {
  if (members.length === 0) {
    return searchTerm ? (
      <EmptyState
        title={`No matches for "${searchTerm}"`}
        message="Check the spelling, or try just the member ID."
        actionLabel="Clear search"
        onAction={onClearSearch}
      />
    ) : (
      <EmptyState
        title="No members on file yet"
        message="Records added here will show up in this list."
      />
    );
  }

  const sorted = [...members].sort(
    (a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)
  );

  return (
    <ul className="member-list" aria-label="Frequent flyer members">
      {sorted.map((m) => (
        <li className="member-stub" key={m.id}>
          <div className="member-stub__notch member-stub__notch--left" aria-hidden="true" />
          <div className="member-stub__notch member-stub__notch--right" aria-hidden="true" />

          <div className="member-stub__main">
            <div className="member-stub__id-col">
              <span className="member-stub__member-id">{m.memberId}</span>
              <span className="member-stub__name">{m.name}</span>
              <span className="member-stub__email">{m.email}</span>
            </div>

            <div className="member-stub__mid">
              <TierBadge tier={m.tier} />
              <span className="member-stub__miles">
                {m.miles.toLocaleString()} <span className="member-stub__miles-label">mi</span>
              </span>
              <StatusPill status={m.status} />
            </div>
          </div>

          <div className="member-stub__perforation" aria-hidden="true" />

          <div className="member-stub__actions">
            <button
              type="button"
              onClick={() => onEdit(m)}
              aria-label={`Edit ${m.name}, member ${m.memberId}`}
            >
              Edit
            </button>
            <button
              type="button"
              className="member-stub__delete"
              onClick={() => onDelete(m)}
              aria-label={`Remove ${m.name}, member ${m.memberId}`}
            >
              Remove
            </button>
          </div>
        </li>
      ))}

      <style jsx>{`
        .member-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .member-stub {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--ink-100);
          border-radius: var(--radius-md);
          padding: var(--space-2);
          gap: var(--space-2);
        }
        .member-stub__notch {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--surface-muted);
          border: 1px solid var(--ink-100);
        }
        .member-stub__notch--left {
          left: calc(72% - 7px);
        }
        .member-stub__notch--right {
          left: calc(72% - 7px);
          display: none;
        }
        .member-stub__perforation {
          position: absolute;
          left: 72%;
          top: 10px;
          bottom: 10px;
          border-left: 1.5px dashed var(--ink-200);
        }
        .member-stub__main {
          display: flex;
          flex: 1;
          align-items: center;
          gap: var(--space-3);
          min-width: 0;
        }
        .member-stub__id-col {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1.2;
        }
        .member-stub__member-id {
          font-family: var(--font-data);
          font-size: 0.75rem;
          color: var(--ink-500);
          letter-spacing: 0.02em;
        }
        .member-stub__name {
          font-weight: 600;
          color: var(--ink-900);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .member-stub__email {
          font-size: 0.8125rem;
          color: var(--ink-500);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .member-stub__mid {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          flex: 1;
        }
        .member-stub__miles {
          font-family: var(--font-data);
          font-size: 0.875rem;
          color: var(--ink-700);
        }
        .member-stub__miles-label {
          color: var(--ink-300);
          font-size: 0.75rem;
        }
        .member-stub__actions {
          display: flex;
          gap: var(--space-1);
          padding-left: var(--space-2);
        }
        .member-stub__actions button {
          background: var(--surface);
          border: 1px solid var(--ink-200);
          border-radius: var(--radius-sm);
          padding: 7px 12px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--ink-700);
        }
        .member-stub__actions button:hover {
          border-color: var(--ink-500);
        }
        .member-stub__delete:hover {
          border-color: var(--danger-600);
          color: var(--danger-600);
        }

        @media (max-width: 720px) {
          .member-stub {
            flex-direction: column;
            align-items: stretch;
          }
          .member-stub__perforation,
          .member-stub__notch {
            display: none;
          }
          .member-stub__main {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-1);
          }
          .member-stub__mid {
            width: 100%;
            justify-content: space-between;
          }
          .member-stub__actions {
            padding-left: 0;
            padding-top: var(--space-1);
            border-top: 1px dashed var(--ink-200);
            margin-top: var(--space-1);
            justify-content: flex-end;
          }
        }
      `}</style>
    </ul>
  );
}
