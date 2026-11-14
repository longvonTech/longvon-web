# PROD-DB-RECOVERY-002 — Diagnostics Report

**Asia/Shanghai:** 2026-11-14 20:45 · **UTC:** 2026-11-14T12:45:00Z  
**Task:** Independent GitHub Actions production **readonly** diagnostics workflow  
**PR:** #19 · Branch `recovery/production-readonly-diagnostics` → `main`  
**Approved content SHA (keep-set):** `6762bb656c7d603669ef46a8a8ad6eaf33da439a`  

---

## Evidence classification legend

| Label | Meaning |
|---|---|
| **Actual execution** | Produced by a completed Actions run of this workflow |
| **Historical log** | From prior Actions deploy failures (P3018/P3009) |
| **Inference** | Logical conclusion; not a live query |
| **Unresolved** | Not yet known; requires workflow run |

---

## 0. Status of THIS document revision

| Item | Status | Class |
|---|---|---|
| Security hardening of workflow + remote script | **YES** (this commit) | Actual (repo) |
| Workflow executed | **NO** — owner forbade run until review | Unresolved |
| Live O-1 / O-3 | **NOT RUN** | Unresolved |
| Production contact from authoring agent | **NONE** | Actual |

After an approved dispatch, **replace** live sections with the Artifact Markdown only (single sanitized report). Dump/CSV/raw logs stay on ECS.

---

## 0.1 Security hardening summary (PR #19 fix)

| Requirement | Implementation |
|---|---|
| Backup perms | `umask 077`; backup dir `700`; dump/CSV/logs `600` |
| Dump never leaves ECS | Artifact allowlist = one `.md` file; refuse `*.dump`/`*.csv`/`*_raw*` |
| Artifact contents | Status fields, sizes, SHA256, table exists, schema privs, dir inventory, dep **count** only — **no** raw migration logs/SQL/structure dumps |
| SSH trust | Requires secret **`ECS_SSH_KNOWN_HOSTS`** (owner-supplied pre-verified lines). **No** `ssh-keyscan`-only trust |
| Inputs | Passed via `env:`; `approved_sha` must match `^[0-9a-fA-F]{40}$` and a real commit; keep-set from that SHA’s git tree |
| pipefail + `head` | `pg_restore -l` written to file first |
| inventory | No `migration.sql` head dump; size + SHA256 only |
| Failures | Separate `O1_BACKUP` / `O1_SQL` / `O3_INVENTORY` statuses; non-OK → exit 1 |

### Owner action before first run

Add production environment secret:

- **`ECS_SSH_KNOWN_HOSTS`** — verified `known_hosts` line(s) for `ECS_HOST`  
  (Do not invent fingerprints in git. Obtain from a trusted prior connection, e.g. `ssh-keygen -lf` on an already-trusted client.)

Existing secrets still required: `ECS_HOST`, `ECS_USER`, `ECS_SSH_KEY_B64`.

---

## 1. O-1 results (pending workflow run)

| Check | Result | Class |
|---|---|---|
| Disk / backup / SHA256 / pg_restore | **Unresolved** | — |
| Target migration status fields | **Unresolved** live; historical started_at `2026-10-17 15:16:32.005100 UTC` | Historical |
| logs field | Will remain **ECS-only** even after run | Policy |
| `growth.syndication_jobs` exists | **Unresolved** | — |
| growth USAGE/CREATE | **Unresolved** live; historical CREATE denied (42501) | Historical |

---

## 2. O-3 results (pending workflow run)

| Check | Result | Class |
|---|---|---|
| Full ECS dir list + SQL size/SHA256 | **Unresolved** (historical count **8**) | Historical count |
| Keep-set at `6762bb6` | `00000000000000_init`, `20250627000000_news_enterprise_media`, `migration_lock.toml` | Actual (git) |
| ECS-only dirs | **Unresolved** names | — |
| Dep match count | **Unresolved** on ECS; **0** matches in approved git apps/packages | Actual (git) + unresolved ECS |

---

## 3. Historical context (not a substitute for live diagnostics)

| Fact | Source |
|---|---|
| P3018 / 42501 on `CREATE TABLE growth.syndication_jobs` | Actions `39044287850` |
| P3009 blocking later deploy | Actions `43413969407` |
| Round 1 Cloud/Mac SSH blocked | `PROD-DB-RECOVERY-001-ROUND1-RESULTS.md` |

---

## 4. Expected owner steps (after approve + secrets)

1. Ensure `ECS_SSH_KNOWN_HOSTS` is set on `production` environment.  
2. Merge or allow `workflow_dispatch` from the approved ref.  
3. Run **Production readonly diagnostics** with `confirm_readonly=YES` and approved SHA.  
4. Download Artifact (single Markdown).  
5. Separate Round 2 for O-2 / O-3 cleanup / O-5.

---

## 5. Stop

Security fixes committed for PR review only.  
**Workflow not executed. ECS not contacted. Production DB not accessed.**
