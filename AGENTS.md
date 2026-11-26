# LONGVON project rules

- Before work, read current GitHub main, Issue/PR status and the private `longvonTech/longvon-ops` handover. Record the actual SHA; never infer production version from main.
- GitHub is the source for source code, task ownership, decisions and reviewed evidence. Internal operations records are in longvon-ops; this repository stays public.
- One writer per task branch. Claim a task in private HANDOVER before edits; re-read remote before pushing. Preserve unrelated changes and historical evidence. Handover releases the claim; another environment resumes from the recorded commit and next command.
- Independent worktrees/environments must not concurrently change one task branch or execute production operations.
- No merge, production publish/restart, migration, customer-record operation or production inquiry without explicit separate owner authorization for that exact operation.
- Production release and rollback share `deploy-production` Actions concurrency and ECS `_recovery/deployment.lock`; a lock is never automatically discarded. Unknown or live lock owners fail closed.
- Do not lower approval/health/provenance/static integrity gates. Require independent production reviewers and reviewed policy digest. Candidate allowlisting is not production approval.
- Preserve the healthy API, old Web artifact and shared static files. Web-only switch/rollback; no static deletion or overwrite on hash conflict.
- Never commit credentials, PM2 environment snapshots, server logs, database backups or customer data. Keep original ZIP assets in the approved private Release archive, not Git history.
- Every completed task records commit, commands, environment, evidence hashes, failed attempts, next steps and remaining permissions. CI/Linux evidence is not Codex Cloud execution or real customer conversion evidence.
- GEO: approved standard OEM MOQ1000 applies only to existing Ring1/Ring1C platforms; custom ODM independently scoped; never publish the internal 500 pilot policy. Preserve approved medical/technical boundaries.
- Monitoring uses the fixed12 English queries, true Google/ChatGPT/Perplexity sessions and append-only evidence. Country UNKNOWN when unverified. Distinguish default answer/search, ranking/recommendation/citation and pre/post production release. Never fabricate observations or overwrite the72 historical records.

Canonical internal documents: `longvon-ops/docs/operations/{PROJECT-STATUS,HANDOVER,ENVIRONMENT,RELEASE-RUNBOOK}.md`. Public release controls: docs/release/LV-CLOUD-DEPLOY-001.md.
