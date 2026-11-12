# WP07 Current Code Baseline — WP07-DECISION-001-A

**Audited (UTC):** 2026-11-12T11:54:00Z · **Asia/Shanghai:** 2026-11-12 19:54  
**Method:** Live `git fetch` / `gh pr view` / commit diffs — not historical report alone.

## 1. Live PR / tip state (pre–decision-commit)

| Ref | Value |
|---|---|
| PR #10 | OPEN · base `geo/phase-4.2-execution` · head `cursor/geo-phase-4-2-cge-fc31` · tip **`ee246a3`** · MERGEABLE / CLEAN |
| PR #11 | OPEN · base `cursor/geo-phase-4-2-cge-fc31` · head `cursor/geo-wp07-osa-fc31` · tip **`fa5fce6`** · MERGEABLE / CLEAN |
| Local branch at audit start | `cursor/geo-wp07-osa-fc31` @ `fa5fce6` · clean · tracking origin |
| Working tree | Clean before decision edits |

## 2. Special verification: `fa5fce6` vs `9d16eae`

| Check | Result |
|---|---|
| Is `fa5fce6` PR #11 tip at audit start? | **YES** |
| Diff scope `9d16eae..fa5fce6` | **6 markdown files only** under `docs/geo/phase-4.2/wp07-osa/` (+393 lines) |
| Business / page code changed? | **NO** |
| OSA EN/ZH pages modified? | **NO** |
| Medical claims / SEO / routes / internal links changed? | **NO** |
| Unreviewed app changes in that commit? | **NO** |

**Diff summary:** WP07-REVIEW-001 documentation packet only (`WP07-REVIEW-001-FINAL-REPORT.md`, `PR10-PR11-DEPENDENCY-AUDIT.md`, `OSA-COMMERCIAL-PAGE-REVIEW.md`, `OSA-TECHNICAL-EVIDENCE-REVIEW.md`, `OSA-QUERY-MAPPING.md`, `WP07-OWNER-DECISIONS.md`).

**Conclusion:** Prior page audit at `9d16eae` remains valid for app code through `fa5fce6`. Decision-001 then applies D-01 disclaimer + minimal SDK↔OSA link on top of `fa5fce6`.

## 3. GitHub Checks at audit

| Branch | `gh pr checks` | Actions runs |
|---|---|---|
| `cursor/geo-phase-4-2-cge-fc31` | none reported | none listed |
| `cursor/geo-wp07-osa-fc31` | none reported | none listed |

**Cause:** `.github/workflows/ci.yml` triggers only on `push`/`pull_request` to **`main`**, not on stacked Phase 4.2 branches. See `CI-VERIFICATION-REPORT.md` (D-14 exception).

## 4. Post–decision tip

Baseline parent for decision work: **`fa5fce6`**.  
Decision commit tip: **`a6b234f595519fb204ba3eb20d3b73be040e3c87`** (D-01 + readiness docs + SDK↔OSA links).
