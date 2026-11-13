# Phase 2C — Deployment Package Safety Review

## Package under review
Phase 2B audit package intent: **30 COPY + 1 DELETE** (manufacturer Meta included; HtmlLang delete retained).
`next.config.ts` Contact fix is **candidate-local only** and must stay **out** of COPY.

## Findings

### 1. Each COPY needs a clear reason
Most of the 29 original FIX-01 paths remain title/lang/hreflang/schema identity fixes. Phase 2B added manufacturer Meta REPLACE for the approved 145-char description. English OEM REPLACE now carries the approved 152-char description plus prior FIX-01 hreflang/schema wiring.

### 2. Compatibility with production
Cannot be fully certified from local payload hashes alone.
- Historical ECS hashes are from **2026-11-02**.
- Live Contact works via nginx today; Option B correctness depends on **not** overwriting nginx/`next.config.ts`.
- G5/OEM form files are byte-identical across prodRecord/fix01/candidate and are excluded from COPY — good.
- Chinese/English OEM REPLACE files change page modules that **import** OemRfqForm; they do not alter the form module itself, but postdeploy RFQ smoke is still required.

### 3. Risk of overwriting necessary production functions
High-risk if package expands beyond whitelist:
- Copying dirty worktree manufacturer (extra trust body) would exceed approved Meta-only scope.
- Copying dirty Chinese OEM rewrite would exceed scope.
- Copying `next.config.ts` from an incomplete baseline would **remove** Contact fallback if production still relies on the recorded file; Option B correctly excludes it.

### 4. Gaps / leaks
- Manufacturer is in Phase 2B COPY, but denylist still marks `apps/web/app/en/smart-ring-manufacturer/page.tsx` as `must_not_change`. **Manifest/denylist reconciliation is required** before any authorized deploy.
- Package still cannot reconstruct English OEM page alone if production lacked OemRfqForm/EnTrustStrip/geo-trust helpers; 2026-11-02 records say those already match on ECS and are protected.

### 5. DELETE still necessary?
Yes for FIX-01 completeness: remove `HtmlLang.tsx` after SSR lang lands. Leaving it unused is mostly harmless if imports are gone, but DELETE remains the approved end state. Require backup existence before unlink.

### 6. Contact / G5 impact of current package
- Contact: **no package change required** while nginx remains primary. Do not COPY `next.config.ts`.
- G5: layout REPLACE must keep `LeadAttributionCapture`; protected G5 files stay out of COPY. Candidate layout still contains capture.

### 7. Manifest adjustments needed
1. Keep `next.config.ts` excluded.
2. Explicitly authorize manufacturer Meta REPLACE **or** remove it from COPY; update denylist accordingly.
3. Re-run production predeploy hash capture before execute.
4. Do not absorb dirty-only body edits.
5. Retain HtmlLang DELETE with backup gate.

## Safety conclusion
Payload hash consistency is **necessary but not sufficient**. With current evidence, Option B remains the only plausible path **if and only if** denylist/manifest conflict is resolved and fresh production hashes/backups are verified. **Not deployable yet.**
