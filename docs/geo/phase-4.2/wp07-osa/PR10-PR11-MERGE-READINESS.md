# PR #10 / #11 Merge Readiness — WP07-DECISION-001-F (D-11=A)

**Merge authorization:** **Not granted** — Cursor must not merge. Owner merges after review.

## Live tips (pre-decision push baseline)
- PR #10 tip: `ee246a3` · MERGEABLE · CLEAN  
- PR #11 tip before decision commit: `fa5fce6` · MERGEABLE · CLEAN · base = #10 head  

## PR #10 readiness

| Topic | Assessment |
|---|---|
| Scope | CGE-001 commercial packet + SDK EN/ZH + OEM/manufacturer fixes |
| Conflicts vs base `geo/phase-4.2-execution` | GitHub: CLEAN / MERGEABLE |
| SEO/routes/SDK | Present in branch; prod SDK historically 404 until deploy |
| Tests | Local evidence in CGE packet; GitHub CI **not triggered** (main-only) |
| P0 blockers | None identified for **stack merge into Phase 4.2 working line** |
| Production deploy | Separate owner gate |

**Conclusion PR #10:** **Conditionally ready for owner merge** into `geo/phase-4.2-execution`, subject to D-14 exception acceptance.

## PR #11 readiness

| Topic | Assessment |
|---|---|
| Depends on #10 | **Yes** — must merge #10 first (D-11) |
| OSA pages + WP07 docs | Present; D-01 disclaimer applied in decision commit |
| Diff vs #10 | WP07-only when based on CGE tip |
| Conflicts | CLEAN / MERGEABLE at audit |
| P0 medical invent | None on OSA B2B pages |
| P1 | Owner must accept medical-oriented+disclaimer (D-01 done); deploy still blocked |
| CI | Same main-only exception |

**Conclusion PR #11:** **Conditionally ready for owner merge after #10**, subject to same CI exception.

## Required merge order
1. Owner merges **PR #10** → `geo/phase-4.2-execution`  
2. Restack/rebase #11 if parent moves (GitHub stack does not auto-rebase)  
3. Owner merges **PR #11**  
4. Production deploy of SDK+OSA only under separate D-02 approval  

## Conflicts
None reported by GitHub at audit (`mergeable_state: clean` both).

## P0 / P1 blockers for merge vs deploy

| Item | Blocks merge? | Blocks deploy? |
|---|---|---|
| CI not running on branch | Policy (D-14 exception) | Policy |
| D-01 disclaimer | Resolved in code | — |
| Owner deploy approval | No | **Yes** |
| Missing nm / ODI formula / clinical dossiers | No (not claimed) | Only if sales wants those claims |

## Owner exception needed?
**Yes — D-14 CI exception** (or trigger CI against `main` after merge). Cursor does not waive this; owner chooses.
