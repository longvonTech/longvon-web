# PHASE-3 Production Release Approval Pack

## Conclusion

# NOT READY FOR PRODUCTION APPROVAL

This document prepares human approval materials only. **No merge, deploy, rsync, PM2, nginx reload, or production mutation was performed.**

## 1. Unique candidate

| Field | Value |
|---|---|
| Payload package commit | `8e41fd4c6cf8f934ded7b8b87ddebc35a61e1ecf` |
| Phase 3 package | `GEO-FIX-01-PHASE-3` / `3.0.0` |
| Manifest SHA256 | `3f4dbc71e2a005c7d07e08b9f4d8d9de1a2c8a55fc8fd4e59e319a9b3dbc794e` |
| Branch | `geo/fix-01-phase2-candidate` |
| COPY / DELETE | 30 / 1 |

## 2–3. Manifest & SHA256

- Manifest: `docs/geo/packages/geo-fix-01/MANIFEST.json`
- Inventory: `docs/geo/packages/geo-fix-01/SHA256SUMS.txt` (`1dc76049d734af7dd3ee6863b522d1a8a8edbf2fefc12a3a0c969f83c0488408`)
- Three-way: `docs/geo/phase3-three-way.json`

## 4. Production file difference table

See `PHASE-3-PRODUCTION-READONLY-AUDIT.md` §A3. Summary: 3 expected missing ADD, 27 expected REPLACE diffs (pinned), 1 expected present DELETE target. **0 CONFLICT.**

## 5. Production backup evidence

| Item | Status |
|---|---|
| On-server Option B 31-file source backup | **MISSING** |
| Standalone bak `web-standalone.bak.20261101165615` | Exists (compiled runtime; not Option B source set) |
| Fresh read-only pull to auditor workstation | Done (`/tmp/phase3-rollback-sim/backup`, 28 files, hashes OK) — **not retained as official prod backup** |

## 6. Rollback plan (for future authorized release)

1. Before COPY: create hashed tarball of all existing Option B targets + record ADD absences + modes.
2. Retain tarball under `/root/mateyou/_rollback/geo-fix-01-src-<timestamp>.tar` with SHA256 sidecar.
3. On failure after COPY/rebuild: restore tarball paths; remove ADD files; restore `HtmlLang.tsx`; rebuild/swap standalone per runbook; verify `/`, `/en/partner/oem`, `/en/smart-ring-manufacturer`, `/contact`, G5 capture still mounted.
4. Isolated source rollback drill: **PASS** (Phase 3). Production drill: not run.

## 7. Deploy steps (DO NOT EXECUTE without separate owner approval)

1. Re-run production hash audit; abort on CONFLICT.
2. Create & verify on-server source backup (blocking gate).
3. Dry-run Option B copy helper.
4. Execute COPY + DELETE only from whitelist.
5. Build web with `NEXT_PUBLIC_SITE_URL=https://www.longvon.com`.
6. Swap standalone per existing runbook (authorized window only).
7. Do **not** reload nginx for Contact (already correct).
8. Do **not** touch G5/OEM form files / env / DB.

## 8. Post-deploy verification

- `html lang` en/zh; Meta 145/152; hreflang/x-default; JSON-LD; Contact 301; OEM RFQ GET smoke (no real lead); G5 `LeadAttributionCapture` still in layout; homepage OK.

## 9. Rollback steps

As §6 + `docs/geo/ROLLBACK-RUNBOOK.md` / `GEO-FIX-01-DEPLOYMENT-RUNBOOK.md`.

## 10. Risk list

1. Missing on-server Option B source backup (**P0 blocker**).
2. Server git dirty unrelated files — collision risk.
3. Source COPY without successful rebuild leaves HTML unchanged / broken.
4. Search/AI still see old Meta until crawl after a real release.
5. Human error expanding COPY beyond whitelist.

## 11. Items requiring LONGVON owner approval

- [ ] Create & retain official production source backup for 31 targets
- [ ] Authorize production Option B COPY + rebuild window
- [ ] Authorize any PM2/standalone swap
- [ ] Confirm no concurrent content edits on same paths
- [ ] Explicit written approval to move from this pack to execution

**Until P0 backup gate is closed, approval status remains:** `NOT READY FOR PRODUCTION APPROVAL`

