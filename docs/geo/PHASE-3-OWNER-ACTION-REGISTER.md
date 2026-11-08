# PHASE-3 Owner Action Register

Re-verified 2026-11-08 against `docs/geo/OWNER-ACTION-REGISTER.md` and Phase 3 access limits.  
**No external platform mutations performed.**

| # | Item | Current status | Evidence | Incomplete | Owner | Next action | External auth? |
|---|---|---|---|---|---|---|---|
| 1 | Admin password rotation | Unverified complete | Historical PR #8 credential exposure notes; bootstrap docs exist without repeating secrets | Prove rotation + service validation | Account/system owner | Rotate affected credentials via secure channel; confirm login | Yes — this phase forbidden to change |
| 2 | WeCom visual check | Pending human | 2026-11-01 webhook engineering ping recorded; G5-SMOKE first-touch field still pending human view | Open WeCom, screenshot non-PII field presence | Owner/Sales | Record checklist result | Needs legitimate WeCom access |
| 3 | CSDN C2 | DRAFT / LOGIN_REQUIRED | `content-drafts/CSDN-OEM-TRUST-202611.md` | Human publish + public URL + campaign tag | CSDN account owner | Publish manually; register URL | Yes |
| 4 | Sales 48h QUALIFIED/LOST | SOP written; routine unproven | Admin endpoint historically probed; no current filled ledger for 2026-11-08 | Mark each real lead ≤48h with stage+reason | Sales owner | Enforce weekly audit of timeouts | Internal |
| 5 | Funnel weekly report | Template exists; week not filled | Prior FINAL/GEO status docs | Fill Lead/Smoke-excluded/Qualified/Sample/Order counts or N/A | Sales/Ops | Produce week-of report | CRM/order book read access |
| 6 | Bing/GSC access | No access evidence | `SEARCH-MONITORING.md`, Phase 3 E | Grant read-only or export CSVs | Site owner | Authorize console | Yes |
| 7 | GEO PR #5 / #8 / #7 | OPEN; #5/#8 CI success; #7 CI fail | GitHub PR records in GEO-BENCHMARK-REPORT | Owner dependency decision; do not merge #7+#8 together | Repo owner | Review then explicit merge approval | Merge needs explicit approve |
| 8 | FIX-01 production backup gate | **Blocking** | `PHASE-3-PRODUCTION-READONLY-AUDIT.md` | Create on-server 31-file source backup | Deploy owner | After backup, re-open approval pack | Production write auth later |
| 9 | C3 directory correction follow-up | Emails sent historically; acceptance unknown | Prior owner register | Check replies/public pages | Owner | No unsolicited re-contact without auth | External |

Status labels: items are mostly **已开发/部分已验证** operationally; none of #1–#5 are **已产生效果** for commercial GEO outcomes.
