# Demo Script — ENG-163087 (Frequent Flyer Portal)

Target: ~3 minutes. Screen-record following this order.

**0:00 – Intro (10s)**
"This is ENG-163087, the Frequent Flyer Portal replacing the client's
paper + Excel workflow. Walking through the happy path first, then the
edge cases the TRD called out specifically."

**0:10 – Happy path (35s)**
- Load the app — point out the loading skeleton appears briefly before
  the member list renders (mock API simulates real latency).
- Search "Rao" — show the list filtering live, mention the `aria-live`
  region announcing result count for screen readers.
- Click **+ Add member** — fill in a valid record, submit, point out
  the toast confirmation and the new boarding-pass-style row appearing
  at the top of the list.

**0:45 – Unhappy path: empty states (20s)**
- Search for something with no matches ("zzz") — show the "No matches"
  empty state with the Clear search action, not a blank screen.

**1:05 – Unhappy path: invalid input (25s)**
- Open Add member, submit with empty fields — show every required
  field highlighting red with an inline error message, and that the
  form does NOT submit.
- Fix one field, leave the member ID malformed — show the specific
  format error ("Use the format FF-#####").

**1:30 – Unhappy path: spotty connectivity (40s)**
- Point at the connection status pill in the header (shows real
  online/offline state).
- Switch the "Simulate" dropdown to **Slow 3G** — add a member, show
  the visible loading state during the artificially slowed request.
- Switch to **Offline** — attempt an action, show the error state with
  the **Try again** button, then switch back to Normal and retry
  successfully.

**2:10 – Accessibility pass (30s)**
- Tab through the page using only the keyboard — show visible focus
  rings, that the Add modal traps focus, and `Escape` closes it and
  returns focus to the trigger button.
- Briefly mention: all interactive elements have ARIA labels, form
  errors are wired via `aria-invalid`/`aria-describedby`.

**2:40 – Wrap (15s)**
- Show `npm run lint` → zero warnings, and `npm run build` → clean
  production build in the terminal.
- "Telemetry logging and input sanitization are in the console/source —
  covered in the README for anything not visible on screen."
