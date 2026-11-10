# LONGVON_GITHUB_CREDENTIAL_SECURITY_AUDIT.md

**Task:** P42-R2-001  
**Date (UTC):** 2026-11-10  
**Status:** COMPLETED (local sanitize) + OWNER ACTION for token rotation

## Original problem
Round 1 Push/PR failed. Inspection found `remote.origin.url` contained **embedded HTTPS userinfo** (username + token-like secret) for `github.com/longvonTech/longvon-web`.

## Security check results
| Check | Result |
|---|---|
| Embedded credentials in worktree `origin` URL | **YES** (before fix) |
| Token-like pattern in remote URL | **YES** (before fix) |
| Same pattern in main workspace remote after check | No (already clean / cleaned) |
| Secrets written into tracked repo files this Round 2 | No |
| `git rev-list` content scan for `ghp_` / `github_pat_` in reachable commits (sample) | No hits reported |
| Full token printed in this report | **Never** |

## Handling
1. Immediately ran `git remote set-url origin https://github.com/longvonTech/longvon-web.git` on `geo/phase-4.2-execution` worktree.
2. Verified remote no longer contains userinfo or token patterns.
3. Prefer GitHub CLI keyring auth (`gh` logged in as `longvonTech` via keyring) for push/PR.
4. **Owner must revoke/rotate** any previously embedded personal access token that may have been exposed in local shell history, Cursor transcripts, or failed auth logs. This agent cannot complete GitHub token revocation in the account UI.

## Push / PR
See Round 2 execution report for live push/PR outcome after sanitize.

## Residual risk
If the exposed token was real, treat it as compromised until owner revokes it — even though remote URL is now clean.
