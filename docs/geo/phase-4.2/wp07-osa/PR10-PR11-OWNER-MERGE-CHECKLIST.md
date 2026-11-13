# Owner Merge Checklist — PR #10 / #11

**Cursor status:** `READY_FOR_OWNER_MERGE_APPROVAL`  
**Cursor will not merge, restack, deploy, or publish content.**

## Decisions (already approved — do not re-open)
D-01 medical-oriented + disclaimer · D-02 same-batch SDK+OSA publish · D-11 #10 then #11 · D-14 CI green-or-exception.

## Checklist for owner

| # | Item | Suggested answer |
|---|---|---|
| 1 | Merge PR #10 now? | **Yes (recommended)** into `geo/phase-4.2-execution` |
| 2 | Merge PR #11 now? | **Yes after #10** (and restack if parent moved) |
| 3 | Merge order | **#10 → (#11 restack if needed) → #11** |
| 4 | Restack required? | **Likely after #10 merges** — see `PR11-FINAL-MERGE-READINESS.md` (commands suggested, not executed) |
| 5 | P0 open? | **None** on audited OSA/SDK pages |
| 6 | P1 open? | Accept **D-14 CI exception** OR require CI on `main` after merge |
| 7 | Accept CI exception? | Owner choice — evidence in CI report / FINAL execution report |
| 8 | Production deploy with this merge? | **No** — separate authorization; D-02 same-batch when approved |
| 9 | Publish six OSA drafts? | **No** (D-12 REVIEW) |

## Post-merge verification (owner / ops)
1. Confirm #10 commits on `geo/phase-4.2-execution`.  
2. Restack/update #11 base; confirm clean.  
3. Merge #11.  
4. Optional: trigger CI on `main` if that is the integration branch, or keep Phase 4.2 working line policy.  
5. Only after separate deploy approval: ship SDK EN/ZH + OSA EN/ZH together; smoke production URLs.

## Residual risks
- GitHub CI never ran on these PR heads (trigger limitation).  
- Production SDK historically 404 until deploy — OSA alone incomplete commercially.  
- Evidence gaps (nm, ODI formula, clinical, Ring1) remain — correctly unpublished.
