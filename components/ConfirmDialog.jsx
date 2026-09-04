"use client";

import { useEffect, useRef } from "react";

export default function ConfirmDialog({ title, message, confirmLabel = "Confirm", onConfirm, onCancel, isDangerous }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
    function handleKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="confirm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="confirm-box__actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            ref={confirmRef}
            className={isDangerous ? "btn-danger" : "btn-primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 22, 26, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2);
          z-index: 60;
        }
        .confirm-box {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: var(--space-3);
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(20, 22, 26, 0.25);
        }
        .confirm-box h2 {
          margin: 0 0 var(--space-1);
          font-size: 1.0625rem;
        }
        .confirm-box p {
          margin: 0;
          color: var(--ink-500);
          font-size: 0.9375rem;
        }
        .confirm-box__actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-1);
          margin-top: var(--space-3);
        }
        .btn-secondary {
          background: var(--surface);
          border: 1px solid var(--ink-200);
          padding: 9px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 500;
        }
        .btn-primary {
          background: var(--ink-900);
          color: var(--surface);
          border: none;
          padding: 9px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
        .btn-danger {
          background: var(--danger-600);
          color: var(--surface);
          border: none;
          padding: 9px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
