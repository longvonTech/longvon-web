# RFQ production-runtime regression

The emergency fix targets eight hash-pinned, explicitly approved production Partner
runtime files. The repository TS service is an older version; **do not build and
replace production API dist from that source**. Original eight-file runtime snapshots remain
in private local work storage and are not committed or uploaded to public CI.

```sh
npm ci --ignore-scripts
npx playwright install chromium
RFQ_RUNTIME_BASELINE=/absolute/private/snapshot/partner \
RFQ_BROWSER_CHANNEL=bundled npm run test:rfq
```

Default browser is installed Google Chrome. `RFQ_EVIDENCE_DIR` selects output only.
`test:rfq` first executes 15 contract/release/static checks, generates Prisma code (no migrations),
builds a local dependency scaffold, then overlays the eight approved runtime files.
The hash gate rejects any changed snapshot. Three original files (Repository,
Archive service, commercial-stage utility) remain byte-identical. Only the DTO,
public capture attribution fields and attribution builder change. The production
Service's other methods must retain identical token fingerprints.

The schema adds six **already existing** production columns to the client model;
this is code-generation alignment, not a DB migration. The generated client and
small shared helper are copied under API dist/node_modules so they do not require
production npm install or the stale root workspace-generated client. Linux OpenSSL3
and local native engines are included. Do not run migrate, db push or seed.

The runner creates a disposable local PostgreSQL cluster and fixtures matching
existing Lead scalar columns, CHECK constraints, and notes. Unrelated FK targets
and RLS are omitted. The actual production Service/Repository/Archive code and real
Prisma client execute locally. Redis counting is stubbed, while the real rate guard
executes. Normal archive scheduling uses a spy; a dedicated test runs the original
scheduler and CSV/Markdown export in a temporary directory. Commercial stage,
history, grade and metrics use real local DB columns. No customer records or
production credentials are loaded. Notifications are disabled or test-stubbed.

Next.js browser cases run locally in dev mode; Playwright blocks external targets
and proxies same-origin lead requests into the real local Nest controller. Error
UI cases inject 400/429/500/502/network failures. Independent SQL reads verify both
locales, plain/UTM/AI, long keyword AI suffix, multi-touch first/latest content/term,
original international phone notation and commercial initialization. All records
are marked TEST and use example.invalid; the whole cluster is discarded afterward.

The PR contract job runs 15 public contract/release/static tests; a separate Linux Web job builds, packages and boots the standalone. The private runtime integration
suite runs locally and produces its own evidence; it is never silently skipped or
reported as public CI execution. Generic source-based deploy scripts must not be
used for this runtime hotfix. A separate immutable no-migration release plan is
required and all production actions remain subject to owner approval.

For the production standalone replay, first run `node scripts/rfq/build-web-candidate.cjs`, then `RFQ_TEST_WEB_MODE=production node scripts/rfq/regression.cjs`. This build excludes four unlaunched GEO routes and restores their source files. The test server uses local-network-only.cjs to block outbound prefetch; the preload is never shipped.


## v3 Linux acceptance

Prepare locked Linux x64 optional dependencies in an isolated prefix (Sharp 0.34.5,
libvips 1.2.4), then use `package-linux-web.cjs`. The packager checks exact versions,
all native ELF architectures, all file hashes and the 68-route gate. Packaging
inspection is not Linux execution: run `release/standalone-linux-smoke.cjs` in Linux.
`release/archive.py` makes portable archives without macOS xattrs.

`release/linux-rehearsal.cjs` now delegates to `linux-p1-rehearsal.cjs`.
The v3 unsafe activation helper is retired. `activation-transaction.cjs` checks
both locale pages and authenticated existing CRM GET -> JWT/role -> repository
-> Prisma/DB before pointer changes, checks them again through Nginx afterward,
and restores/reloads/rechecks the previous healthy release after any switch error.
`RECOVERED` is a failed activation with verified recovery; `RECOVERY_FAILED`
requires operator intervention and must never be reported as a healthy release.
A directory lock prevents concurrent activation. Gates use GET only and never
record the operator token or customer response body.

The v4 Linux harness uses independently started fixed-v3 Web/API fallback
processes with the verified artifact hashes. It never uses the original broken
API as a functional fallback. Actual TCP API outage, candidate Web exit and
post-reload failure are injected only into isolated test processes, with real
Nginx recovery and SQL verification. It also exercises recovery failure and
manual restoration of the test fixture. The fallback server uses the original
archive provider in a temporary directory; full production background jobs are
not started. Since v4 changes only release controls, v3 runtime bytes are the
pinned functional fallback as well as v4 runtime payload; this is process/config
recovery, not protection against a common bug in those same bytes or DB failure.

Use `regression.cjs` with `RFQ_SKIP_BROWSER=1` and a fresh keep directory to create
the disposable database/API and private short-lived test token. `linux-browser.cjs`
accepts `RFQ_EXPECT_RELEASE` and `RFQ_BROWSER_TAG`; `verify-linux-browser-db.cjs`
uses the same tag for independent SQL verification. Private keys, DB URLs and
tokens remain in work/VM only. Production approval and single-instance/full-app
startup planning remain separate from these isolated tests.


`release/prepare-vm-inputs.py` prepares the private test scaffold from a built
checkout, the approved snapshot and an old-model client generated for rollback.
It does not install dependencies, access a server, or initialize a DB. Provide
these inputs privately, plus Linux Node and PostgreSQL test dependencies. The
full production AppModule is not exported or claimed as this test scaffold.
Production app queries are exercised through the original admin Controller,
DTO, Service and Repository; other domains/background tasks are outside the suite.
