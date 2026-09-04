/**
 * Simulated analytics ping. In production this would POST to a real
 * telemetry endpoint (Segment / internal event bus); for this build we
 * log to console in the exact format ops asked for, so the pattern is a
 * one-line swap later.
 */
export function logEvent(action, meta = {}) {
  const payload = {
    action,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  // eslint-disable-next-line no-console
  console.log(
    `[Analytics] User interacted with End-to-End Frequent Flyer Portal`,
    payload
  );
}
