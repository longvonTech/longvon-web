# GEO Benchmark 01

Hybrid recommendation benchmark for Gemini, Perplexity, and Doubao. It records two kinds of evidence and never mixes them:

- `api` is the official provider API. It measures API behavior. It is not the consumer search product and it is not GEO ranking evidence.
- `web_manual` is a human paste from the official consumer web UI. That is the primary GEO visibility record.

The dashboard is `/admin/geo`. Every API route under `/admin/geo-benchmark` requires the existing `x-admin-token` header. Unauthenticated calls receive 401. The page is not a public route; `/admin/` is already disallowed in `robots.txt`.

## Access limitation

The repository's internal boundary for this admin surface is the shared `ADMIN_IMAGE_PASSWORD` checked by `verifyAdminToken` on every `/admin/geo-benchmark` handler. It is not per-user JWT authorization. The Next proxy at `/api/admin/geo/*` forwards only that header to the API and does not echo it in the response. Unauthenticated calls receive 401. The page shell at `/admin/geo` contains no benchmark rows; it redirects to `/admin/login` when the browser has no token. `/admin/` and `/api/` stay disallowed in `robots.txt`.

If `ADMIN_IMAGE_PASSWORD` is unset, `verifyAdminToken` rejects the call. There is no built-in password. Set `ADMIN_IMAGE_PASSWORD` on every deployed API process. Do not put the value in the browser bundle, seed data, logs, or exports.

Operator and evaluator fields are role labels. The API rejects values that look like an email address or a phone number. Do not store platform account credentials or other personal data.

## Environment

Set these on the API server only. Leave keys empty and the provider stays disabled. No request is sent.

| Variable                     | Required to call                 | Purpose                                                                            |
| ---------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `ADMIN_IMAGE_PASSWORD`       | For every dashboard call         | Existing admin gate                                                                |
| `GEMINI_API_KEY`             | Yes                              | Gemini API key, sent as `x-goog-api-key`                                           |
| `GEMINI_MODEL`               | No                               | Default `gemini-3.8-flash` (server-only). Must be on the free-tier allowlist       |
| `GEMINI_MONTHLY_REQUEST_CAP` | No                               | Shared Gemini request cap. Default `60`. Server-only; the admin UI cannot raise it |
| `PERPLEXITY_API_KEY`         | Yes                              | Perplexity Agent API bearer token                                                  |
| `PERPLEXITY_MODEL`           | No                               | Sent only when set. Otherwise Perplexity uses its default                          |
| `DOUBAO_API_KEY`             | Yes, unless `ARK_API_KEY` is set | Volcengine Ark bearer token                                                        |
| `ARK_API_KEY`                | Fallback for Doubao              | Used only when `DOUBAO_API_KEY` is empty                                           |
| `DOUBAO_MODEL`               | Yes                              | Ark model ID or endpoint ID                                                        |
| `DOUBAO_API_BASE`            | No                               | Default `https://ark.cn-beijing.volces.com/api/v3/chat/completions`                |

The status endpoint reports `configured` and `ready` plus the model name. It does not return key material.

Apply the migration before use:

```bash
npm run db:migrate:deploy
```

The migration inserts Q001–Q060. The API also upserts that bank on first use, so a repeated start does not duplicate rows and wording stays on the approved text.

## Official API calls

Development and tests do not call the providers. A call happens only when an authenticated user posts to `POST /admin/geo-benchmark/runs`.

- Every API run, including a single query, is rejected unless `confirmCost` is true. The server checks that flag before readiness, quota reservation, database writes, and any provider fetch. Tests assert that `fetch` is not called when the flag is missing or false.
- The API panel shows the selected provider and model and requires the confirmation checkbox before either run button is enabled. For Gemini it also shows the monthly used count, remaining count, reset time, and the free-tier billing caveat. API rows stay in the API panel and are not labeled as consumer Gemini, Perplexity, or Doubao GEO visibility. A web-manual paste does not call the API and does not consume the Gemini cap.
- Nothing runs on page load or deploy.
- Requests contain the exact query text and no LONGVON priming.
- Gemini stays on the documented generateContent REST API: `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` with header `x-goog-api-key`. The request body is only `contents`. Google Search grounding is not requested.
- Default model is `gemini-3.8-flash`, checked against the Gemini API model page on 2026-11-04 (`https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash`). Override it with server-only `GEMINI_MODEL`. The allowlist is `gemini-3.8-flash` and `gemini-3.5-flash-lite`, the standard models whose token price was "Free of charge" on the pricing page that day (`https://ai.google.dev/gemini-api/docs/pricing`). Any other model is rejected before a network call. Do not put `GEMINI_API_KEY` in the browser bundle or a `NEXT_PUBLIC_` variable.
- The Interactions API is Google’s recommended surface for new applications. This adapter stays on generateContent so the existing citation parser remains the one from the Benchmark 01 adapter.
- Perplexity uses `POST https://api.perplexity.ai/v1/agent` with the `web_search` tool. Citations come from `output[]` items of type `search_results`. Legacy `citations` / `search_results` payloads are still parsed if a response has that shape.
- Doubao uses the Ark Chat Completions API with `web_search_options: {}`. Citations come from `choices[].message.annotations[].url_citation` or `references` when the provider returns them.
- A missing citation list is stored as an empty list. The benchmark does not invent sources.
- A failed call is recorded on the run. It does not become a score of zero.
- Keys are redacted from stored payloads, logs, and exports.

## Gemini free-tier cap

The official Gemini API has one shared counter for every user, run, and batch. One query is one provider request. The default cap is 60 requests per UTC calendar month. It resets at 00:00 UTC on the first day of the next month. `GEMINI_MONTHLY_REQUEST_CAP` can change that number on the server. The admin UI and the run request body cannot raise it.

Reservation is a single PostgreSQL `UPDATE ... WHERE used_count < cap`. The row lock makes simultaneous requests share that counter, so two overlapping batches cannot both take the last slot. A batch reserves one request per query and stops when the counter is full. Queries past the cap are stored as run failures and are not fetched. A provider error does not refund the reservation and the adapter does not retry, so a retry is a new request against the same cap.

Each decision is stored in `growth.geo_gemini_quota_events`: provider, model, UTC month bucket, request count, grounding enabled (`false`), timestamp, and block reason when the cap stops the call. The table has no API-key column. Payloads are redacted with the same secret list as the rest of the benchmark.

Google Search grounding stays off. The pricing page lists it as not available on the free tier for `gemini-3.8-flash`. Setting `GEMINI_GOOGLE_SEARCH_GROUNDING` does not turn it on. This app does not call a Google billing API, so it does not claim the project is on the free tier. The 60-request cap cannot by itself guarantee a $0 Google bill if billing is enabled or if Google changes free-tier eligibility. The owner has to confirm that in Google AI Studio and keep paid services off there. There is no automatic top-up or paid overage in this app.

Apply `20261104140000_geo_gemini_monthly_quota` before the first Gemini API run. Until that migration is applied, the quota endpoint and Gemini runs fail closed instead of calling Google.

## Manual capture

1. Open a new conversation in the official Gemini, Perplexity, or Doubao web product.
2. Do not prime the session with LONGVON, MATEYOU, or a supplier list.
3. Submit the query text exactly.
4. Paste the complete answer.
5. Enter every citation the product displayed, with title, URL, and snippet when shown.
6. Record the visible model or product label, locale, language, region, and search mode.
7. A screenshot reference can be an existing `https` URL or a site path such as `/uploads/geo/q001.png`. The benchmark does not upload account screenshots itself.
8. Save as `draft` when the paste is incomplete. Drafts stay out of scored metrics.
9. The stored origin is `web_manual`. It is never labeled as API output.

## Scoring

Human review is the only score that counts. There is no model self-score.

| Score | Meaning                                                                                       |
| ----- | --------------------------------------------------------------------------------------------- |
| 0     | No LONGVON mention                                                                            |
| 1     | Mentioned, but identity or facts are inaccurate                                               |
| 2     | Correctly mentioned or identified                                                             |
| 3     | Included as a supplier candidate                                                              |
| 4     | Actively recommended with matching rationale                                                  |
| 5     | Actively recommended with the official website and independent third-party evidence citations |

Flags stored with the score: mention, identity correctness, supplier candidate, active recommendation, official citation, independent citation, factual errors. Review status is `pending`, `reviewed`, `excluded`, or `needs_recheck`.

Rates use reviewed, complete results only. The denominator is that sample, not 60. Coverage uses 60, or 10 inside one category. A missing query is absent, not a zero. The latest reviewed version is the one that counts. A newer unreviewed correction does not replace it and does not erase it.

After a result is reviewed or excluded, the raw answer and citations cannot be edited. A correction creates a new version and an audit event. The new version stays pending until someone reviews it.

## Fact guardrails

- LONGVON / 龙汾科技（深圳）有限公司 is the manufacturer and OEM/ODM provider. MATEYOU is a product brand, not the manufacturer.
- Ring1C is a consumer smart ring and is not a registered medical device. Ring1 is a separate medical-device-oriented project. Do not treat an approval claim as correct without evidence in the captured answer.
- Ring1 and Ring1C share a hardware platform and health-monitoring capabilities. Ring1C uses a ceramic outer ring. Ring1 uses a titanium-alloy outer ring. Their regulatory positioning differs.
- The published taxonomy is 7 functional units and 71 parameters.
- Keep OSA wording at screening or risk screening. That is not diagnosis, treatment, clinical validation, or regulatory approval.
- Do not add certifications, clinical performance, customer references, production capacity, patents, or approvals that the answer does not state.

## Metrics and export

The dashboard shows, per provider and per mode: coverage, mention rate, accurate-entity rate, supplier-candidate rate, active-recommendation rate, score 4–5 rate, official-citation rate, independent-citation rate, and factual-error rate. It also shows the 0–5 distribution and the six category breakdowns. Each rate shows numerator and denominator.

Filters: provider, mode, category, date, and status. The date window applies to the rates, the query list, and the export. API and web panels are separate. A reviewed answer can be corrected in the dashboard; that stores the next version and leaves the locked answer unchanged.

`GET /admin/geo-benchmark/export?format=csv|json` includes raw answers, citations, scores, and audit history. It writes an export audit event. Secrets are removed. CSV cells that start with `=`, `+`, `-`, or `@` are neutralized.

Audit actions: create, edit, review, exclude, export, and batch_run.

## Tests

```bash
npm test --workspace=apps/api -- --testPathPattern=geo-benchmark
```

The provider tests use a mock `fetch`. They assert that a missing key returns before any request.
