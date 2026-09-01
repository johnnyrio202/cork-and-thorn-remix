// Plain constants only — no server-only imports (db/email/etc). This
// file gets imported from client components, so anything with a
// side-effecting import (like lib/inquiries.ts's getSql) doesn't belong
// here, or it'd get bundled into client JS.

// Off for now per explicit request (2026-09-01) — the upload UI, the
// upload endpoint, and the resume field on job applications all still
// exist, just gated behind this. Flip back to true to re-enable; no
// other code changes needed.
export const RESUME_UPLOADS_ENABLED = false
