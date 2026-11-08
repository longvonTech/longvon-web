# Phase 2D — Production Hash Review

## Status: BLOCKED / NOT CURRENT

No authorized read-only ECS/host session was opened in this round. Existing SSH keys on the operator machine were **not** used to establish a new production connection.

## What was checked instead
- Public HTTPS: `/contact` still `301` via nginx to `/partner/oem` (2026-11-08).
- Historical denylist/manifest SHA values remain labeled **2026-11-02 records only**.
- Candidate payload SHA256 values were regenerated for the Phase 2D package (source/payload only).

## Required before production authorization
Owner-authorized read-only capture of:
1. Production version/deploy stamp under `/root/mateyou` (if any).
2. Current SHA256 for all 30 COPY destinations.
3. Presence/hash of DELETE target `apps/web/components/HtmlLang.tsx`.
4. Confirmation `apps/web/next.config.ts` still matches intended Contact fallback or remains nginx-primary.
5. Confirmation G5/OEM form files still match protected hashes.

Until then: **do not treat any local or 2026-11-02 hash as current production truth.**
