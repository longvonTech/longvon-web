# Phase 2C — Regression Report

Environment: isolated worktree `/private/tmp/longvon-geo-phase2-candidate` (`geo/fix-01-phase2-candidate`).
Build: `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` → PASS.
Original worktree not reset/cleaned/overwritten. No production mutate. No Gemini API.

## Results

| Check | Result | Evidence |
|---|---|---|
| `/` homepage | PASS HTTP 200, `lang=zh-CN` | standalone local |
| `/contact` | PASS `308` → `/partner/oem` → 200 | after candidate `next.config.ts` fix |
| `/contact/` → OEM | PASS via `/contact` hop then OEM 200 | Next trailing-slash behavior; live nginx is direct 301 |
| `/en/partner/oem` | PASS 200, `lang=en`, JSON-LD present | standalone |
| `/en/smart-ring-manufacturer` | PASS 200, `lang=en` | standalone |
| Manufacturer Meta | PASS exact 145-char approved text, single description | SSR HTML |
| EN OEM Meta | PASS exact 152-char approved text, single description | SSR HTML |
| hreflang OEM pair | PASS reciprocal zh-CN/en; x-default English RFQ | SSR HTML |
| G5 unauthorized diff | PASS none vs `71b3e88` for capture/attribution/OemRfqForm/partner-api | `git diff` |
| OEM form module unauthorized diff | PASS none | same |
| Live production Contact | PASS nginx 301 (public probe) | www.longvon.com |
| Fresh ECS file hashes | **N/A / not re-verified** | needs owner-authorized host read |

## Candidate commit readiness
**Not yet.** Contact local blocker is resolved without G5/OEM form changes, and Option B should continue excluding `next.config.ts`. Remaining gates before any final candidate commit / release package:
1. Reconcile manufacturer denylist vs Meta COPY authorization.
2. Re-capture current production target hashes and backups.
3. Confirm host nginx Contact locations still present.
4. Decide whether candidate commit should include local `next.config.ts` Contact fallback for git completeness while keeping it out of deploy COPY.

## Explicit answers required by Phase 2C
- **Contact 404 root cause:** standalone candidate lacked nginx and lacked Next Contact redirects; not a missing page component.
- **Production vs baseline:** production Contact is nginx(+ recorded next.config fallback); FIX-01 baseline next.config omits Contact; many FIX-01 web files intentionally differ from 2026-11-02 ECS hashes.
- **Need Contact fix?** For isolated regression: yes (done locally). For Option B production package: no COPY of next.config; rely on live nginx and existing production next.config.
- **Affect G5?** No in the Contact fix; G5 files unchanged.
- **Adjust manifest?** Yes: denylist/manufacturer conflict + keep next.config excluded + refresh predeploy hashes.
- **Ready for final candidate commit?** **No** until the remaining gates above are closed.
