# Phase 2B — Test Report

All commands ran against `/private/tmp/longvon-geo-phase2-candidate`, except the original 17-test suite which was run from the untouched source workspace.

| Check | Command / method | Result |
|---|---|---|
| Production build | `NEXT_PUBLIC_SITE_URL=https://www.longvon.com npm run build --workspace=apps/web` | PASS; Next 15.5.19 compiled, type/lint stage and 54 static pages completed. Two pre-existing hook dependency warnings in admin pages. |
| TypeScript | `./node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json` | PASS (exit 0). |
| Lint | `npm run lint --workspace=apps/web` | PASS (exit 0); existing admin hook warnings and `next lint` deprecation notice. Target files direct ESLint also PASS. |
| FIX-01 routing tests | `node --test apps/web/lib/i18n-routes.spec.mjs` | PASS 4/4. |
| Deploy safety suite | `node --test scripts/geo/fix-01-deploy.spec.mjs` (original worktree) | PASS 17/17. Test suite is not present in candidate base. |
| SSR language | Standalone HTTP local smoke `/`, `/en`, `/partner/oem`, `/en/partner/oem`, `/en/smart-ring-manufacturer` | PASS; `zh-CN` and `en` as expected. |
| RFQ hreflang | Inspect rendered `link[rel=alternate]` | PASS reciprocal `zh-CN`/`en`; both x-default point to English RFQ. |
| Manufacturer description | Built HTML | PASS exact specified text, 145 chars, one meta description. |
| EN OEM description | Built HTML | PASS exact specified text, 152 chars, one meta description. |
| JSON-LD | Built OEM HTML | PASS JSON-LD script present; Organization/Service components compile/render. |
| Homepage/OEM route | Built standalone HTTP `/`, `/partner/oem`, `/en/partner/oem` | PASS HTTP 200. |
| Contact→OEM | Built standalone HTTP `/contact` | FAIL/BLOCKER: HTTP 404. This is also recorded as absent from baseline redirects; no local unauthorized route change was made. |
| G5 diff | Git status + baseline-source diff | PASS for *candidate incremental edits*: no G5 files changed; base root layout keeps capture. |
| Independent package inventory | Node hash/path script over payload | PASS 30 payload files; 30 COPY, 1 DELETE; protected target paths excluded. This does not validate production target hashes or authorize use. |

A local `next dev` smoke attempt did not become ready and is not counted as a pass; production standalone smoke was used instead. No production target, external accounts, or Gemini API were contacted.
