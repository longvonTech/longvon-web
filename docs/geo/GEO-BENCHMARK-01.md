# GEO Benchmark 01

Hybrid recommendation benchmark for Gemini, Perplexity, and Doubao. It records two kinds of evidence and never mixes them:

- `api` is the official provider API. It measures API behavior. It is not the consumer search product and it is not GEO ranking evidence.
- `web_manual` is a human paste from the official consumer web UI. That is the primary GEO visibility record.

The dashboard is `/admin/geo`. Every API route under `/admin/geo-benchmark` requires the existing `x-admin-token` header. Unauthenticated calls receive 401. The page is not a public route; `/admin/` is already disallowed in `robots.txt`.

## Access limitation

The repository's internal boundary for this admin surface is the shared `ADMIN_IMAGE_PASSWORD` checked by `verifyAdminToken`. It is not per-user JWT authorization. Do not put the benchmark on a public controller. The token is server-checked. The browser only stores it in `localStorage` the same way the existing image and news admin does.

Operator and evaluator fields are role labels. The API rejects values that look like an email address or a phone number. Do not store platform account credentials or other personal data.

## Environment

Set these on the API server only. Leave keys empty and the provider stays disabled. No request is sent.

| Variable | Required to call | Purpose |
| --- | --- | --- |
| `ADMIN_IMAGE_PASSWORD` | For every dashboard call | Existing admin gate |
| `GEMINI_API_KEY` | Yes | Gemini API key, sent as `x-goog-api-key` |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash` |
| `PERPLEXITY_API_KEY` | Yes | Perplexity Agent API bearer token |
| `PERPLEXITY_MODEL` | No | Sent only when set. Otherwise Perplexity uses its default |
| `DOUBAO_API_KEY` | Yes, unless `ARK_API_KEY` is set | Volcengine Ark bearer token |
| `ARK_API_KEY` | Fallback for Doubao | Used only when `DOUBAO_API_KEY` is empty |
| `DOUBAO_MODEL` | Yes | Ark model ID or endpoint ID |
| `DOUBAO_API_BASE` | No | Default `https://ark.cn-beijing.volces.com/api/v3/chat/completions` |

The status endpoint reports `configured` and `ready` plus the model name. It does not return key material.

Apply the migration before use:

```bash
npm run db:migrate:deploy
```

The migration inserts Q001–Q060. The API also upserts that bank on first use, so a repeated start does not duplicate rows and wording stays on the approved text.

## Official API calls

Development and tests do not call the providers. A call happens only when an authenticated user posts to `POST /admin/geo-benchmark/runs`.

- One query is a single run. The screen shows a cost warning. Batch confirmation is not required.
- More than one query is a batch. The server rejects it unless `confirmCost` is true, and it sends nothing until then.
- Nothing runs on page load or deploy.
- Requests contain the exact query text and no LONGVON priming.
- Gemini uses `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent` with the `google_search` tool. Citations come from `groundingMetadata.groundingChunks`. The search-widget HTML is not stored.
- Perplexity uses `POST https://api.perplexity.ai/v1/agent` with the `web_search` tool. Citations come from `output[]` items of type `search_results`. Legacy `citations` / `search_results` payloads are still parsed if a response has that shape.
- Doubao uses the Ark Chat Completions API with `web_search_options: {}`. Citations come from `choices[].message.annotations[].url_citation` or `references` when the provider returns them.
- A missing citation list is stored as an empty list. The benchmark does not invent sources.
- A failed call is recorded on the run. It does not become a score of zero.
- Keys are redacted from stored payloads, logs, and exports.

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

| Score | Meaning |
| --- | --- |
| 0 | No LONGVON mention |
| 1 | Mentioned, but identity or facts are inaccurate |
| 2 | Correctly mentioned or identified |
| 3 | Included as a supplier candidate |
| 4 | Actively recommended with matching rationale |
| 5 | Actively recommended with the official website and independent third-party evidence citations |

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

Filters: provider, mode, category, date, and status. API and web panels are separate.

`GET /admin/geo-benchmark/export?format=csv|json` includes raw answers, citations, scores, and audit history. It writes an export audit event. Secrets are removed. CSV cells that start with `=`, `+`, `-`, or `@` are neutralized.

Audit actions: create, edit, review, exclude, export, and batch_run.

## Tests

```bash
npm test --workspace=apps/api -- --testPathPattern=geo-benchmark
```

The provider tests use a mock `fetch`. They assert that a missing key returns before any request.
