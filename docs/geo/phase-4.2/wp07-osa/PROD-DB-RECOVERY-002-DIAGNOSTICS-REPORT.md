# PROD-DB-RECOVERY-002 — Diagnostics Report

**Asia/Shanghai:** 2026-11-14 22:03 · **UTC:** 2026-11-14T14:03:00Z  
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
| Security hardening (+ round-3 fixes) | **YES** | Actual (repo) |
| Workflow executed | **NO** — owner forbade run until review | Unresolved |
| Live O-1 / O-3 | **NOT RUN** | Unresolved |
| Production contact from authoring agent | **NONE** | Actual |

After an approved dispatch, **replace** live sections with the Artifact Markdown only (single sanitized report). Dump/CSV/raw logs stay on ECS.

---

## 0.1 Security hardening summary (PR #19)

| Requirement | Implementation |
|---|---|
| Backup perms | `umask 077`; backup dir `700`; dump/CSV/logs `600` |
| Dump never leaves ECS | Artifact allowlist = one `.md` file; refuse `*.dump`/`*.csv`/`*_raw*` |
| Artifact contents | Status fields, sizes, SHA256, table exists, schema privs, dir inventory, dep **count** only — **no** raw migration logs/SQL/structure dumps |
| SSH trust | Requires secret **`ECS_SSH_KNOWN_HOSTS`** (owner-supplied). **No** `ssh-keyscan`-only trust |
| Inputs | Passed via `env:`; `approved_sha` 40-hex + real commit; keep-set from that SHA |
| pipefail + TOC | `pg_restore -l` → file first |
| Failures | Separate section statuses; non-OK → exit 1 |

### Round-3 review fixes

| Issue | Fix |
|---|---|
| Unsafe env load | **No** `source .env.production`, **no** `eval`, **no** `require(ecosystem.config.js)`. Dotenv line parse + JS **text scan** of `DATABASE_URL: '…'` only; fail closed if unreadable |
| Disk protection | Before `pg_dump`: `pg_database_size` + `df` avail; require `2×DB + 1GiB`; stop if insufficient; record in report |
| Temp dir cleanup | Unique `/tmp/prod-db-recovery-002-<runid>/`; refuse non-empty provided dir; **no** blanket `rm` of report dir contents |

### Round-4 review fixes

| Issue | Fix |
|---|---|
| SSH host match | `ssh-keygen -F "$ECS_HOST" -f known_hosts` required; no “any hashed line” shortcut; `StrictHostKeyChecking=yes` kept |
| Remote script path | Unique `/tmp/production-readonly-diagnostics-remote-<runid>.sh` (mode 700) |
| Backup failure flow | `pg_dump`/`pg_restore -l` failure → `O1_BACKUP_FAILED`; O-1 SQL = `NOT_EXECUTED`; O-3 still runs; overall `FAILED`; job fails after fetching report |

### Round-5 review fixes

| Issue | Fix |
|---|---|
| Backup dir overwrite | Atomic `mkdir` of `…/db-backup-prod-db-recovery-002-<stamp>-<RUN_ID>`; fail if exists; no reuse/clear |
| Dump overwrite | Exclusive noclobber create of `mateyou_prod.dump` (+ sidecars); refuse if present; failures retain dir |
| ECS temp script | **No** workflow SSH `rm` of remote script; path recorded in report/logs for owner-approved cleanup later |

### Round-6 review fixes

| Issue | Fix |
|---|---|
| `_rollback` chmod | Create only if missing; `chmod 700` **only** when this run created it; pre-existing → no chmod/clear; reject symlink / non-dir |
| `REPORT_OUT_DIR` | Must equal `/tmp/prod-db-recovery-002-${RUN_ID}`; create-only + 700; **refuse any pre-existing** (even empty); reject symlink |

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
