"use client";

import { useEffect } from "react";

export default function Toast({ message, tone = "success", onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
      {message}
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
      <style jsx>{`
        .toast {
          position: fixed;
          bottom: var(--space-3);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: 12px var(--space-2);
          border-radius: var(--radius-sm);
          font-size: 0.9375rem;
          font-weight: 500;
          box-shadow: 0 10px 30px rgba(20, 22, 26, 0.2);
          z-index: 80;
        }
        .toast--success {
          background: var(--ink-900);
          color: var(--surface);
        }
        .toast--error {
          background: var(--danger-600);
          color: var(--surface);
        }
        .toast button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.125rem;
          line-height: 1;
          opacity: 0.8;
        }
        .toast button:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
