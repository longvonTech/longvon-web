# Phase 2C — Production Baseline Review

## Access used
- **Public HTTPS probes** of www.longvon.com (read-only).
- **Historical ECS SHA256 records** from 2026-11-02 (`DENYLIST.json` / `MANIFEST.json` / `GEO-FIX-01-DEPLOYMENT-REVIEW.md`).
- **No SSH / ECS filesystem re-read** in this round. No production files modified. No secrets displayed.

## Current live behavior (public)
| URL | Status | Notes |
|---|---|---|
| `/contact` | 301 → `/partner/oem` | nginx |
| `/contact/` | 301 → `/partner/oem` | nginx |
| `/partner/oem` | 200 | Next.js behind nginx |
| `/en/partner/oem` | 200 | Next.js |
| `/en/smart-ring-manufacturer` | 200 | Next.js |

## Version identifiers
| Layer | Identifier | Confidence |
|---|---|---|
| Public site | Responding; nginx 1.28.3; Next.js powered | Observed 2026-11-08 |
| ECS commit / release tag | **N/A this round** | Requires authorized read-only host access |
| Historical ECS web SHA inventory | Captured 2026-11-02 | Stale until re-verified |
| FIX-01 baseline | `71b3e8893f56848732f49acb580ef461129dcc49` | Local git |
| Partial production source snapshot | `d5eb8c9` (subset of apps/web) | Local git; incomplete by design |
| Phase 2C candidate branch | `geo/fix-01-phase2-candidate` (uncommitted deltas) | Local worktree |

## Files relevant to Contact
| File | Production role | FIX-01 baseline | Deploy package? |
|---|---|---|---|
| nginx site config (`location = /contact`) | Primary 301 | Present in repo `infra/*` but not claimed current on host | **No** (must_not_touch) |
| `apps/web/next.config.ts` | App-layer fallback recorded 2026-11-02 | Missing Contact redirects | **No** (must_not_change) |
| `apps/web/middleware.ts` | Not Contact | Added by FIX-01 for html lang | Yes (lang only) |
| Contact page component | None | None | N/A |

## Required authorization for true current production verification
Before any deploy approval, owner should authorize a **read-only** ECS check of:
1. Current `/root/mateyou` git/deploy stamp or release note if any.
2. Fresh SHA256 of `apps/web/next.config.ts`, `apps/web/app/layout.tsx`, OEM pages, manufacturer page, G5 files, and HtmlLang presence.
3. Active nginx site file that serves www.longvon.com Contact locations.
4. PM2 process name/script path for web only (no restart).

Without that re-hash, historical 2026-11-02 values must be labeled **recorded, not current**.
