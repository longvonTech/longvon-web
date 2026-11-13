# PHASE-3 Master Tracker

Updated: 2026-11-08  
Worktree: `/private/tmp/longvon-geo-phase2-candidate` (original dirty worktree preserved)

| WP | Task | Pri | Status | Evidence | Tests | Blockers | Next | Owner |
|---|---|---|---|---|---|---|---|---|
| A1 | Prod access inventory | P0 | 已验证 | SSH `mateyou-ecs` BatchMode OK | — | — | Keep read-only | Cursor/LONGVON |
| A2 | Prod version | P0 | 已验证 | git `f330be89…`; standalone 2026-11-01 | — | — | — | Cursor |
| A3 | 31-file hash audit | P0 | 已验证 | `phase3-three-way.json` 0 CONFLICT | — | — | Re-hash immediately pre-deploy | Cursor |
| A4 | Prod backup | P0 | 已验证 | `_rollback/geo-fix-01-optionb-src.20261108T143100Z` + tar; inventory `ce52d796…` | Restore 31/31 PASS | — | Human release approval | LONGVON |
| A5 | Rollback package | P0 | 已验证 | On-server Option B source bak + independent restore | PASS | Runtime rebuild still procedural | Await written deploy approval | LONGVON |
| A6 | Audit doc | P0 | 已开发+已验证 | `PHASE-3-PRODUCTION-READONLY-AUDIT.md` | — | — | — | Cursor |
| B1 | Candidate identity | P0 | 已验证 | payload `8e41fd4…`; Phase3 pkg `3.0.0` manifest `bc13b55c7163068edc2e7a00ac6dd8a49625f67127c8aa06a726bc7be7af688f` | — | — | Don’t confuse tip vs package | Cursor |
| B2 | Field Meta protect | P0 | 已验证 | assert-meta 145/152 | PASS | — | — | Cursor |
| B3 | Contact nginx vs next | P0 | 已验证 | nginx 301; next never_copy | SSR PASS | — | — | Cursor |
| B4 | Full retest | P0 | 已验证 | 26/26; build; tsc; lint; SSR | PASS | — | — | Cursor |
| B5 | Final candidate + verdict | P0 | 已验证技术 / 未生产就绪 | `PHASE-3-FIX01-FINAL-REVIEW.md` | — | Backup gate | Human approval later | LONGVON |
| C | Approval pack | P0 | 已开发 | `PHASE-3-PRODUCTION-RELEASE-APPROVAL.md` → **READY FOR HUMAN RELEASE APPROVAL** | — | Written deploy approval | Owner decision | LONGVON |
| D | 60-query baseline | P1 | 题库已开发 / 采集 N/A | `PHASE-3-GEO-60-QUERY-BASELINE.md` | — | Human logins | Run clean consumer captures | GEO + humans |
| E | Search baseline | P1 | 框架已开发 / 数据 N/A | `PHASE-3-SEARCH-ENGINE-BASELINE.md` | — | Bing/GSC auth | Grant read-only | Site owner |
| F | Commercial attribution | P1 | 规则已开发 / KPI N/A | `PHASE-3-COMMERCIAL-ATTRIBUTION.md` | — | Analytics/CRM exports | Fill after data access | Sales/Ops |
| G | Content plan | P2 | 已开发诊断 | `PHASE-3-CONTENT-OPTIMIZATION-PLAN.md` | — | Content publish auth | Prioritize post FIX-01 | Content owner |
| H | Owner register | P2 | 已开发复核 | `PHASE-3-OWNER-ACTION-REGISTER.md` | — | External accounts | Execute owner rows | Owners |
| — | 7/14/30 monitoring clock | P1 | **未启动** | Policy: no post-release timer pre-publish | — | FIX-01 not live | Start only after release | LONGVON |
| — | Final report | P0 | 已开发 | `PHASE-3-FINAL-EXECUTION-REPORT.md` | — | — | Owner decisions | Cursor/LONGVON |

Four-status discipline reminder: technical PASS ≠ 已上线 ≠ 已产生效果.
