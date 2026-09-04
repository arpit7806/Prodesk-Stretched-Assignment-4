/**
 * sanitizeText
 * -------------
 * Strips out any HTML/script payloads from raw user input before it is
 * ever written to Redux state. We deliberately do NOT rely on
 * dangerouslySetInnerHTML anywhere in this app, so React already escapes
 * output on render -- but the portal also exports data (CSV / future API
 * sync) and floor staff often paste text from Excel, so we sanitize at the
 * point of entry too. Defense in depth, not just output escaping.
 *
 * Strategy:
 * 1. Strip <script>...</script> blocks entirely (including content).
 * 2. Strip all remaining HTML tags.
 * 3. Neutralize javascript: / data: URI payloads that could be pasted
 *    into a field and later used as a link.
 * 4. Trim + collapse excess whitespace.
 */
export function sanitizeText(value) {
  if (typeof value !== "string") return "";

  let clean = value;

  // 1. Remove script blocks completely
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, "");

  // 2. Strip any remaining HTML tags
  clean = clean.replace(/<\/?[^>]+(>|$)/g, "");

  // 3. Neutralize dangerous URI schemes if someone pastes an href-like string
  clean = clean.replace(/javascript:/gi, "");
  clean = clean.replace(/data:text\/html/gi, "");

  // 4. Strip inline event handler patterns like onerror=
  clean = clean.replace(/on\w+\s*=/gi, "");

  return clean.trim().replace(/\s+/g, " ");
}

/**
 * sanitizeMemberInput
 * Runs sanitizeText across every string field of a member record payload.
 */
export function sanitizeMemberInput(payload) {
  const clean = { ...payload };
  for (const key of Object.keys(clean)) {
    if (typeof clean[key] === "string") {
      clean[key] = sanitizeText(clean[key]);
    }
  }
  return clean;
}
