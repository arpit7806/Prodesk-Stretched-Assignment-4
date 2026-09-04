"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MEMBER_ID_RE = /^FF-\d{4,6}$/;

const EMPTY_FORM = {
  name: "",
  email: "",
  memberId: "",
  tier: "Silver",
  miles: "",
  status: "Active",
};

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Enter the member's full name.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name looks too short.";
  }

  if (!form.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Enter a valid email, like name@example.com.";
  }

  if (!form.memberId.trim()) {
    errors.memberId = "Enter a member ID.";
  } else if (!MEMBER_ID_RE.test(form.memberId.trim())) {
    errors.memberId = "Use the format FF-##### (e.g. FF-10234).";
  }

  if (form.miles === "" || form.miles === null || form.miles === undefined) {
    errors.miles = "Enter a starting miles balance.";
  } else if (Number.isNaN(Number(form.miles)) || Number(form.miles) < 0) {
    errors.miles = "Miles must be a number, 0 or higher.";
  }

  return errors;
}

export default function MemberFormModal({ initialData, onSubmit, onClose, isSaving, serverError }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          memberId: initialData.memberId,
          tier: initialData.tier,
          miles: String(initialData.miles),
          status: initialData.status,
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const triggerElRef = useRef(null);

  // Focus management: remember what opened the modal, focus first field on
  // mount, restore focus on unmount. Keyboard trap + Escape-to-close.
  useEffect(() => {
    triggerElRef.current = document.activeElement;
    firstFieldRef.current?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = dialogRef.current.querySelectorAll(
          'button, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerElRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate({ ...form }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, memberId: true, miles: true });

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = dialogRef.current.querySelector('[aria-invalid="true"]');
      firstInvalidField?.focus();
      return;
    }

    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      memberId: form.memberId.trim().toUpperCase(),
      tier: form.tier,
      status: form.status,
      miles: Number(form.miles),
    });
  }

  const fieldError = (name) => (touched[name] && errors[name] ? errors[name] : null);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-form-title"
        ref={dialogRef}
      >
        <div className="modal__header">
          <h2 id="member-form-title">{isEdit ? "Edit member" : "Add new member"}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="f-name">Full name</label>
              <input
                id="f-name"
                ref={firstFieldRef}
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-invalid={Boolean(fieldError("name"))}
                aria-describedby={fieldError("name") ? "err-name" : undefined}
                className={fieldError("name") ? "is-invalid" : ""}
              />
              {fieldError("name") && (
                <p id="err-name" className="field-error" role="alert">
                  {fieldError("name")}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={Boolean(fieldError("email"))}
                aria-describedby={fieldError("email") ? "err-email" : undefined}
                className={fieldError("email") ? "is-invalid" : ""}
              />
              {fieldError("email") && (
                <p id="err-email" className="field-error" role="alert">
                  {fieldError("email")}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-memberid">Member ID</label>
              <input
                id="f-memberid"
                type="text"
                placeholder="FF-10234"
                value={form.memberId}
                onChange={(e) => handleChange("memberId", e.target.value)}
                onBlur={() => handleBlur("memberId")}
                aria-invalid={Boolean(fieldError("memberId"))}
                aria-describedby={fieldError("memberId") ? "err-memberid" : undefined}
                className={fieldError("memberId") ? "is-invalid" : ""}
                disabled={isEdit}
              />
              {fieldError("memberId") && (
                <p id="err-memberid" className="field-error" role="alert">
                  {fieldError("memberId")}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-miles">Miles balance</label>
              <input
                id="f-miles"
                type="number"
                min="0"
                inputMode="numeric"
                value={form.miles}
                onChange={(e) => handleChange("miles", e.target.value)}
                onBlur={() => handleBlur("miles")}
                aria-invalid={Boolean(fieldError("miles"))}
                aria-describedby={fieldError("miles") ? "err-miles" : undefined}
                className={fieldError("miles") ? "is-invalid" : ""}
              />
              {fieldError("miles") && (
                <p id="err-miles" className="field-error" role="alert">
                  {fieldError("miles")}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-tier">Tier</label>
              <select id="f-tier" value={form.tier} onChange={(e) => handleChange("tier", e.target.value)}>
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Diamond</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-status">Status</label>
              <select id="f-status" value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          {serverError && (
            <p className="server-error" role="alert">
              {serverError}
            </p>
          )}

          <div className="modal__footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? "Saving…" : isEdit ? "Save changes" : "Add member"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 22, 26, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2);
          z-index: 50;
        }
        .modal {
          background: var(--surface);
          border-radius: var(--radius-md);
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: var(--space-4);
          box-shadow: 0 20px 50px rgba(20, 22, 26, 0.25);
        }
        .modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }
        .modal__header h2 {
          margin: 0;
          font-size: 1.125rem;
        }
        .modal__close {
          background: none;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          color: var(--ink-500);
          padding: var(--space-1);
        }
        .modal__close:hover {
          color: var(--ink-900);
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2) var(--space-2);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--ink-700);
        }
        .field input,
        .field select {
          border: 1px solid var(--ink-200);
          border-radius: var(--radius-sm);
          padding: 9px var(--space-1);
          background: var(--surface);
        }
        .field input:disabled {
          background: var(--surface-muted);
          color: var(--ink-500);
        }
        .field input.is-invalid {
          border-color: var(--danger-600);
          background: var(--danger-100);
        }
        .field-error {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--danger-600);
        }
        .server-error {
          margin: var(--space-2) 0 0;
          padding: var(--space-1) var(--space-2);
          background: var(--danger-100);
          border: 1px solid var(--danger-600);
          border-radius: var(--radius-sm);
          color: var(--ink-900);
          font-size: 0.875rem;
        }
        .modal__footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-1);
          margin-top: var(--space-3);
        }
        .btn-secondary {
          background: var(--surface);
          border: 1px solid var(--ink-200);
          padding: 10px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 500;
        }
        .btn-primary {
          background: var(--ink-900);
          color: var(--surface);
          border: none;
          padding: 10px var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: 600;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--ink-700);
        }

        @media (max-width: 520px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
