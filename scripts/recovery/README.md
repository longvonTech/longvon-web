# LONGVON-P0-RECOVERY-001 release controls

This is the recovery release procedure, not approval to merge or deploy. The owner
must approve the concrete candidate SHA after CI succeeds. Never run the legacy
source-overlay deployment script or rebuild production API from the older TS tree.

## Candidate verification

Open the recovery PR against main and run CI and RFQ contract regression. Dispatch
`Deploy to ECS` on the recovery branch with `phase=geo`, `perform_deploy=false`,
`approval=VERIFY_ONLY`. The deploy job must be skipped. Review the exact commit,
Linux standalone smoke results, four bilingual SDK/OSA routes and artifact checksum.
Public CI does not contain the private production runtime snapshots, and does not
claim to run those integration tests. Those tests use isolated Linux/PostgreSQL.

The build freezes the reviewed API source, API dependency manifest, database schema
and Prisma version. Any change requires reconciliation with the real production
runtime before release; GEO mode cannot silently ignore a new backend change.

## Approved production execution

After explicit final approval, dispatch the same candidate with `phase=geo`,
`perform_deploy=true`, `approval=LONGVON-P0-RECOVERY-001`. The production environment
must have the existing ECS SSH secrets and match the pinned host keys. Artifacts
are checksum-verified, staged in a private directory, and checked before cutover.
No migration, db push, seed, production npm install or permission grants are run.

GEO requires an accepted healthy RFQ baseline on ECS. It retains the API process,
changes Web only, adds static files without deleting old chunks, and checks Web,
actual authenticated API/Prisma/DB and every manifest static resource. Public
static paths are readable by Nginx; private directories/configuration stay private.
A failure must fail the job and automatically restore the accepted healthy Web.
Never fall back to the legacy API, which restores the RFQ 500 defect.

After deploy, read-only HTTP checks must return 200 for:

- `/smart-ring-sdk-api`
- `/en/smart-ring-sdk-api`
- `/osa-smart-ring-technology`
- `/en/osa-smart-ring-technology`

Also check OEM pages, health/CORS, retained API PID and static resources. Do not
repeat the four already consumed production TEST submissions without new approval.
Actual WeCom recipient confirmation is separate from HTTP 200/errcode=0.

## Manual functional rollback

Use the active GEO release directory recorded in the private recovery state:

```sh
node /root/mateyou/_recovery/releases/<active-GEO-id>/scripts/recovery/deploy.cjs \
  --approved=LONGVON-P0-RECOVERY-001 --rollback-web
```

The command validates and restores the accepted previous Web artifact, retains the
healthy API PID, runs health gates and persists PM2 state. This is an application
rollback, not a database restore. Shared infrastructure failures still require
operator recovery. Backups and restoration records remain private on ECS.

## TEST statistics

The two explicitly approved synthetic inquiry rows are retained with soft-deletion
flags. Existing Repository queries exclude them using `deletedAt: null`; no query
methods are replaced. Verify admin totals, GEO source queries, commercial metrics,
raw row retention and original customer row hashes on ECS, emitting only counts
and booleans. The original archive service refreshes the active customer archive.
Do not upload production logs, customer rows/archives, backups, tokens or config.
