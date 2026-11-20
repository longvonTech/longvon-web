# LONGVON Channel Health Data API Integration — v1

Status: implementation baseline; production E2E not yet verified.

## Scope

This integration adds a server-side NestJS adapter for the Apifox channel query APIs. The browser never receives the LONGVON channel token, access key, or access secret.

Implemented query resources:

| Web API | LONGVON upstream path |
|---|---|
| POST /health-data/channel/hr | /system/v1/channel/health-data/hr-data |
| POST /health-data/channel/temperature | /system/v1/channel/health-data/temp-data |
| POST /health-data/channel/spo2 | /system/v1/channel/health-data/spo2-data |
| POST /health-data/channel/steps | /system/v1/channel/health-data/step-data |
| POST /health-data/channel/momentum | /system/v1/channel/health-data/momentum-one-minute-data |
| POST /health-data/channel/sleep | /system/v1/channel/health-data/sleep-data |
| POST /health-data/channel/osa | /system/v1/channel/health-data/osa-data |

All routes require the existing LONGVON admin JWT. This is an internal integration/verification surface, not yet a customer self-service API. Customer access must not be enabled until a verified customer-to-xid/device ownership mapping is implemented.

## Server environment

Configure only on the API server:

- LONGVON_CHANNEL_API_BASE_URL (default https://api.longvon.com/api)
- LONGVON_CHANNEL_TOKEN (channel token; with or without Bearer prefix)
- LONGVON_CHANNEL_ACCESS_KEY
- LONGVON_CHANNEL_ACCESS_SECRET
- LONGVON_CHANNEL_LANGUAGE (default zh)

Do not put these values in NEXT_PUBLIC_* variables, browser storage, frontend source, or client-visible responses. Rotate any credentials previously pasted into shared chat or source documents.

## Request contracts

Range queries (HR, temperature, SpO2, steps, momentum):

```json
{
  "lastVersion": null,
  "devTimeStart": "13-digit Unix milliseconds",
  "devTimeEnd": "13-digit Unix milliseconds",
  "phonenumber": "LONGVON xid"
}
```

Sleep query:

```json
{
  "lastVersion": null,
  "devTime": "13-digit Unix milliseconds for sleep date",
  "phonenumber": "LONGVON xid"
}
```

OSA query:

```json
{
  "devTime": "13-digit Unix milliseconds for sleep date",
  "phonenumber": "LONGVON xid"
}
```

The adapter preserves the upstream response envelope and field values. It does not scale o2Score, reinterpret AHI/ODI levels, or infer clinical meanings.

## Known unresolved upstream contract questions

1. Channel token acquisition response schema, expiry, refresh and revocation.
2. Exact lastVersion cursor semantics and paging/max-record limits.
3. Timestamp timezone and range-boundary behavior.
4. Whether phonenumber is always required for all channel-scoped resources.
5. Momentum units/formula and retention enforcement details (Apifox says generally seven days).
6. OSA p3/p4 definitions, o2Score scale, AHI/ODI level enums, RRI units and null/empty behavior.
7. Sleep status/dataType enums and optional response fields.
8. Profile update null/omitted-field semantics and device unbinding data retention.
9. HRV and stress result query APIs remain undiscovered.

## Security and release gates

- Channel query routes are admin-only.
- Credentials remain server-side.
- Upstream errors are reduced to status/code/message; do not log request headers or credentials.
- Do not treat Apifox examples as real user data or clinical evidence.
- Before production release, run real E2E tests using an authorized channel account, test xid and test device.
- Add customer ownership checks before exposing any health data to customer sessions.
