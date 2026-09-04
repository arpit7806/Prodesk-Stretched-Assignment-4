"use client";

import { useEffect, useState } from "react";

/**
 * Tracks real browser connectivity via navigator.onLine + the online/offline
 * events, AND exposes a manual simulator so evaluators can demo the
 * "spotty 3G" unhappy path without actually cutting their wifi.
 */
export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [simMode, setSimMode] = useState("normal");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    window.__ffPortalNetworkMode = simMode;
  }, [simMode]);

  const effectiveMode = !isOnline ? "offline" : simMode;

  const label =
    effectiveMode === "offline"
      ? "Offline"
      : effectiveMode === "slow"
      ? "Slow connection"
      : "Online";

  const dotClass =
    effectiveMode === "offline"
      ? "status-dot status-dot--offline"
      : effectiveMode === "slow"
      ? "status-dot status-dot--slow"
      : "status-dot status-dot--online";

  return (
    <div className="conn-status">
      <span className={dotClass} aria-hidden="true" />
      <span className="conn-status__label" role="status" aria-live="polite">
        {label}
      </span>

      <label className="conn-status__sim" htmlFor="network-sim">
        Simulate:
        <select
          id="network-sim"
          value={simMode}
          onChange={(e) => setSimMode(e.target.value)}
          disabled={!isOnline}
          aria-label="Simulate network condition for demo purposes"
        >
          <option value="normal">Normal</option>
          <option value="slow">Slow 3G</option>
          <option value="offline">Offline</option>
        </select>
      </label>

      <style jsx>{`
        .conn-status {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 0.8125rem;
          color: var(--ink-500);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .status-dot--online {
          background: var(--success-600);
        }
        .status-dot--slow {
          background: #b98a1f;
        }
        .status-dot--offline {
          background: var(--danger-600);
        }
        .conn-status__label {
          font-weight: 500;
          color: var(--ink-700);
        }
        .conn-status__sim {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: var(--space-2);
          padding-left: var(--space-2);
          border-left: 1px solid var(--ink-200);
          color: var(--ink-500);
        }
        .conn-status__sim select {
          border: 1px solid var(--ink-200);
          border-radius: var(--radius-sm);
          padding: 2px 6px;
          background: var(--surface);
        }
      `}</style>
    </div>
  );
}
