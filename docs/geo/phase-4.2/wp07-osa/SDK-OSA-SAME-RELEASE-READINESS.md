# SDK + OSA Same-Release Readiness — WP07-DECISION-001-C (D-02=A)

**Meaning:** Both page groups must be ready in the **same publish window**.  
**Does not authorize** production deploy.

## Page set

| Locale | SDK | OSA B2B |
|---|---|---|
| EN | `/en/smart-ring-sdk-api` | `/en/osa-smart-ring-technology` |
| ZH | `/smart-ring-sdk-api` | `/osa-smart-ring-technology` |

## Checklist (local tip after D-01)

| Check | SDK EN/ZH | OSA EN/ZH | Result |
|---|---|---|---|
| Route in app router | Present | Present | **PASS** |
| SSR HTTP 200 (standalone) | Yes | Yes | **PASS** — `evidence/ssr-smoke-wp07-decision-001.txt` |
| Canonical | Correct longvon.com URLs | Correct | **PASS** |
| hreflang zh-CN / en / x-default | Present in SSR HTML | Present | **PASS** |
| Meta title/description | Present | Present | **PASS** |
| Sitemap via `GEO_PAGE_SLUGS` | Yes | Yes | **PASS** |
| robots allowlist | Yes | Yes | **PASS** |
| Cross-links OSA↔SDK | SDK related links → OSA; OSA → SDK | Yes | **PASS** (minimal SDK reverse link added) |
| Partner OEM CTA | Present | Present | **PASS** |
| EN/ZH structural parity | Aligned | Aligned (+ D-01 disclaimer both) | **PASS** |
| Production live today | **No** (historically SDK 404 on prod until deploy) | **No** | Same-batch gate |

## SDK technical statement audit (must remain true)

| Statement | Status on SDK pages |
|---|---|
| 100Hz PPG for qualified OEM/ODM partners (project scope) | **Present** — PARTIAL evidence framing |
| Many algorithms cloud-dependent; not all offline | **Present** (FAQ + body) |
| SDK / algorithm license / support / cloud separated | **Present** |
| No public self-serve SDK portal | **Present** |
| No unrestricted BLE protocol promise | **Present** |
| Invented protocol/packet layout | **Absent** (correct) |

## Same-batch commercial completeness

| Condition | Status |
|---|---|
| Code ready on PR #10 (SDK) + PR #11 (OSA) | **Yes** (stack) |
| Owner D-01 disclaimer on OSA | **Done** |
| Owner deploy authorization | **Waiting** |
| If SDK not released, OSA lacks full conversion path | **Acknowledged** — do not mark “commercially complete in production” until both live |

## Readiness verdict
**READY_FOR_OWNER_REVIEW** for same-batch publish preparation.  
**Not** production-ready until owner executes/approves deploy of **both** groups together (D-02).
