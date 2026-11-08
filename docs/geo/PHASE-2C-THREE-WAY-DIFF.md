# Phase 2C — Three-Way Diff

Legend:
- **prodRecord** = SHA256 recorded from ECS read-only audit on **2026-11-02** (not re-verified today). Marked N/A when no record exists.
- **fix01** = `71b3e88` tree.
- **phase2c** = isolated candidate worktree after Phase 2B meta extracts + Phase 2C Contact next.config fix.
- **dirty** = original worktree `geo/fix-01-identity-language` working files (not a release candidate).

Local hashes are not presented as live production hashes.

| Path | prodRecord (2026-11-02) | fix01 | phase2c | dirty | In Option B COPY? | Contact/G5/OEM impact | Extra auth? |
|---|---|---|---|---|---|---|---|
| `apps/web/next.config.ts` | `48fe0a78…` | `db89e547…` (no Contact) | `48fe0a78…` (Contact fallback restored locally) | `48fe0a78…` | **NO** | Contact fallback only; no form logic | Keep excluded from package |
| `apps/web/middleware.ts` | N/A (ADD) | `384f53cf…` | `384f53cf…` | `384f53cf…` | YES | html lang header only | No |
| `apps/web/app/layout.tsx` | `ee2a8356…` | `d2add71a…` | `d2add71a…` | `d2add71a…` | YES | SSR lang + identity; keeps G5 capture | Confirm G5 markers postdeploy |
| `apps/web/app/en/partner/oem/page.tsx` | `5babf1d3…` | `a74ef156…` | `c6882b52…` (152-char description) | `c6882b52…` | YES | Meta/hreflang/schema path; form component unchanged in candidate vs fix01 | No form rewrite |
| `apps/web/app/en/smart-ring-manufacturer/page.tsx` | `726cc0b8…` | `21c60433…` | `2912e2b5…` (145-char description only) | `6d0c20f6…` (description + trust body extras) | YES in Phase 2B package | Meta only in candidate; dirty has extra body | **Denylist currently `must_not_change` — conflict** |
| `apps/web/app/partner/oem/page.tsx` | `f3836e2c…` | `7a7917d9…` | `7a7917d9…` | `903932f7…` | YES | ZH RFQ hreflang change from baseline; dirty diverges further | Do not ship dirty rewrite |
| `apps/web/components/HtmlLang.tsx` | `1cd1f534…` present | ABSENT | DELETE target | ABSENT | DELETE only | Removes client lang mutator | Confirm backup before delete |
| `apps/web/components/LeadAttributionCapture.tsx` | `56abca82…` | `56abca82…` | `56abca82…` | `56abca82…` | NO | G5 | Protected |
| `apps/web/lib/lead-attribution.ts` | `a96d88a6…` | `a96d88a6…` | `a96d88a6…` | `a96d88a6…` | NO | G5 | Protected |
| `apps/web/components/OemRfqForm.tsx` | `70a9c1aa…` | `70a9c1aa…` | `70a9c1aa…` | `70a9c1aa…` | NO | OEM form | Protected |
| `apps/web/lib/partner-api.ts` | `2b7f5660…` | `2b7f5660…` | `2b7f5660…` | `2b7f5660…` | NO | G5 payload helper | Protected |
| `apps/web/lib/i18n-routes.ts` | `80fe66c1…` | `5e9242e5…` | `5e9242e5…` | `5e9242e5…` | YES | hreflang helpers | No |
| `apps/web/components/StructuredData.tsx` | `b68bca06…` | `8a6dbb65…` | `8a6dbb65…` | `8d223e92…` | YES | JSON-LD; dirty further changed | Ship fix01/phase bytes only |
| `infra/nginx.conf` | N/A this round | present in git | present | dirty differs | **NO** | Contact primary path on live | Host nginx may differ; do not deploy from package |

## Candidate source delta vs `71b3e88` (Phase 2C end state)
Only three modified tracked files:
1. `apps/web/app/en/partner/oem/page.tsx` — description only.
2. `apps/web/app/en/smart-ring-manufacturer/page.tsx` — description only.
3. `apps/web/next.config.ts` — Contact redirects only (local/regression; not for Option B COPY).

No G5/OEM form business-logic deltas in the candidate.
