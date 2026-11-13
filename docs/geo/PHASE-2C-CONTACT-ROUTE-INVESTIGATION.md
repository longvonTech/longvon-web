# Phase 2C — Contact Route Investigation

## Verdict
`/contact` is **not a page route**. Live production implements it as an **nginx 301** to `/partner/oem`. The FIX-01 Git baseline and Phase 2B candidate previously lacked the app-layer fallback, so a standalone Next.js build returned **404**. That local 404 does **not** prove production Contact is broken.

## Answers

| # | Question | Finding |
|---|---|---|
| 1 | Where does `/contact` exist? | Live production (nginx). Also present as Next.js `redirects()` in the dirty original worktree `apps/web/next.config.ts`, whose SHA256 matches the 2026-11-02 denylist production record. Absent as a page under `apps/web/app/contact` in all checked commits. |
| 2 | Mechanism? | Primary: nginx `location = /contact` / `location = /contact/` → `301 https://www.longvon.com/partner/oem`. Secondary/fallback: Next.js `redirects()` `/contact` → `/partner/oem` (308). Not a rewrite, not middleware, not a React page. |
| 3 | Why candidate 404? | Phase 2B tested standalone Next without nginx. Commits `71b3e88`, `0b0d50d`, and snapshot `d5eb8c9` all have `next.config.ts` **without** Contact redirects. No `/contact` page file exists → Next returns 404. |
| 4 | Which files prove production behavior? | Live public response `Server: nginx` + `301 Location: /partner/oem`. Documented in `infra/nginx.conf`, `infra/nginx-ecs-sites-mateyou.conf`, `docs/geo/GEO-FIX-01-DEPLOYMENT-REVIEW.md`, and denylist entry for `apps/web/next.config.ts` (reason: production has Contact fallback). |
| 5 | Restore require G5/OEM form changes? | **No.** Redirect-only. No form, attribution, or API change required. |
| 6 | Restore without form logic changes? | **Yes.** App-layer redirects in `next.config.ts` are sufficient for isolated Next regression. Production Option B must **not** overwrite live `next.config.ts` or nginx. |

## Evidence

### Live public HTTP (2026-11-08, read-only)
- `GET /contact` → `301` `Location: https://www.longvon.com/partner/oem` (`Server: nginx/1.28.3`)
- `GET /contact/` → same 301
- `GET /partner/oem` → `200`
- `GET /en/partner/oem` → `200`
- `GET /en/smart-ring-manufacturer` → `200`

### Git / worktree
- No `apps/web/app/contact/**` in `71b3e88` or `0b0d50d`.
- Middleware does not handle Contact.
- Dirty original `next.config.ts` SHA256 `48fe0a78b857e4108ebab339433795c1a3a57e618d8955e3f467ab8d09cd8e91` equals denylist production record.
- FIX-01 baseline `next.config.ts` SHA256 `db89e547dfc841448e974afb00fc26b4e4c811b75eae6cf5e93dfbf5248e68f6` (no Contact redirects).

### Isolated candidate fix (local only)
Added the same two redirect entries to candidate `apps/web/next.config.ts` only. Resulting SHA256 matches the recorded production/dirty file: `48fe0a78...`.
- Rebuild PASS.
- `/contact` → `308 /partner/oem` → `200`.
- `/contact/` → `308 /contact` → `308 /partner/oem` → `200` (Next trailing-slash hop; nginx live uses exact-match 301 for both).
- No G5/OEM form file changes.

## Scope note
This Contact fix is for **isolated regression fidelity**. It must remain **outside** Option B COPY. Production Contact continues to rely on nginx; live `next.config.ts` is denylisted `must_not_change`.
