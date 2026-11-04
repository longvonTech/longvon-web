# Production credential rotation

Code cleanup does **not** revoke credentials that were previously committed. Treat every secret that has appeared in tracked source as compromised, even after it is deleted from the current tree.

This change does not rotate anything and does not contact production. The owner must rotate credentials in the systems that issued them, then store the new values only on the server.

## Do this before deploying the cleanup

`ecosystem.config.js` no longer contains secret literals. PM2 refuses to start until the required names are present in the process environment. `scripts/deploy.sh` reads them from the server-side `.env.production` file, which stays out of git and is excluded from the deploy rsync.

If that file does not already contain the required names, the next deploy will stop before build and restart. Populate it on the server first. Do not commit it, paste it into GitHub, or put the values in a workflow file.

Required names:

| Variable | Where to rotate |
| --- | --- |
| `DATABASE_URL` | PostgreSQL user password, then the server env URL |
| `REDIS_URL` | Redis password, then the server env URL |
| `JWT_ACCESS_SECRET` | Generate a new random secret. Existing access tokens stop validating. |
| `JWT_REFRESH_SECRET` | Generate a different random secret. Existing refresh sessions stop validating. |
| `ADMIN_IMAGE_PASSWORD` | Choose a new admin password. The API no longer accepts a built-in fallback. |
| `WECOM_WEBHOOK_URL` | Recreate the WeCom group robot webhook and revoke the old one. |
| `DASHSCOPE_API_KEY` | Revoke the DashScope key in the Alibaba Cloud console and issue a new one. |

Also review any other third-party key that was ever stored in `ecosystem.config.js` or another tracked file, including Baidu push tokens if they were copied into source. `NEXT_PUBLIC_BAIDU_VERIFICATION` is published in page HTML; set it again from the Baidu console before the next web build if the meta tag must stay present. It is not a substitute for rotating the private keys above.

`GEMINI_API_KEY` is not part of this cleanup and must not be added to git, GitHub Actions source, CI logs, or any `NEXT_PUBLIC_` variable. After deploy is approved, set it only on the API host. `GEMINI_MODEL` may be set on the API host; the default is `gemini-3.8-flash`.

Suggested local generation for new random secrets (run on the server, do not commit the output):

```bash
openssl rand -hex 32
openssl rand -hex 64
```

Write the new values into `/root/mateyou/.env.production` with mode `600`. A later deploy exports that file into the shell and PM2 reads the same names. The file contents must never be printed in CI logs or shell traces.

## Order of operations

1. Rotate the live credentials in PostgreSQL, Redis, the JWT secret store, the admin password, WeCom, and DashScope.
2. Update only the server-side environment with the new values.
3. Confirm the application still starts against the new values in a maintenance window you control.
4. Only then merge and deploy the commit that deletes the literals from git. Merging earlier removes the values PM2 used to read from `ecosystem.config.js`.
5. After rotation, old values copied from git history, forks, or CI logs are still invalid only if the consoles actually revoked them. Deleting a line in git does not close a database account or an API key.

## Git history

This change does not rewrite history and does not force-push. Older commits and blobs can still contain the previous values. After the credentials have been rotated, plan a separate history purge (`git filter-repo` or BFG) plus a coordinated force-push, GitHub secret scanning, and a fork/cache review. Do that only after revocation, with a named owner, because a history rewrite will require every clone to reset.

## What stays in git

- `.env.example` and `.env.production.example` keep placeholders and the local development database password only.
- CI uses `ci-only-placeholder` JWT values and the local development database password. Those are not production credentials.
- `node scripts/check-hardcoded-secrets.mjs` fails the build when a tracked file assigns a likely secret. It prints the file and variable name, never the value.
