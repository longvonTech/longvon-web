# LONGVON Cloud Upload Interface Catalog 001

**Project:** LONGVON Web BLE / LONGVON Web Health Platform  
**Status:** Implemented as metadata-only catalog + dry-run preparation API  
**Outbound upload:** DISABLED  
**Persistence of health payloads:** DISABLED  
**Upstream host:** https://api.longvon.com

## 1. Scope and hard safety boundary

This implementation establishes the server-side interface contract and maps SDK-confirmed upstream routes. It does not send requests to the upstream cloud, persist physiological data, start algorithm processing, or claim successful uploads.

The browser must never receive LONGVON `accessSecret`. When real transmission is separately authorized, the API server will act as the gateway and hold platform credentials in server-side environment/secret storage.

## 2. Implemented local API endpoints

All endpoints require the existing LONGVON Web JWT authentication.

### GET /cloud-integration/catalog

Returns:
- upstream host (configuration only);
- current mode: `metadata-only`;
- outbound upload enabled: `false`;
- health data persistence enabled: `false`;
- upload operation catalog and Android/iOS route candidates;
- algorithm-result API gaps.

### POST /cloud-integration/uploads/prepare

Metadata-only dry-run. No health values, raw PPG arrays or report contents are accepted.

Request:
```json
{
  "operation": "osa-history",
  "deviceMac": "optional-device-mac",
  "deviceId": "optional-internal-device-id",
  "sampleCount": 120,
  "startTime": "2026-11-14T00:00:00.000Z",
  "endTime": "2026-11-14T08:00:00.000Z"
}
```

Supported operations:
- `heart-rate`
- `spo2`
- `temperature`
- `steps-calories`
- `sleep-basic`
- `osa-history`
- `raw-ppg` (blocked until an authoritative cloud endpoint is provided)

The response explicitly reports `outboundRequestSent: false` and `dataPersisted: false`.

## 3. Upstream endpoints recovered from SDK binaries

Base host: `https://api.longvon.com`

| Data / function | Android route | iOS route | Status |
|---|---|---|---|
| Token | `POST /api/auth/get-token` | `POST /api/auth/get-token` | Path found; request/response and encryption contract still needs backend confirmation |
| Device bind | `POST /api/system/sdk/devInfo/bindDevByMac` | `/api/ruoyi-system/devInfo/...` family | Confirm exact iOS bind path and schema |
| Device list | `POST /api/system/sdk/devInfo/myDevList` | `/api/ruoyi-system/devInfo/...` family | Confirm exact iOS path and schema |
| Device removal | `POST /api/system/sdk/devInfo/removeDev` | `/api/ruoyi-system/devInfo/...` family | Confirm exact iOS path and schema |
| Heart manual record | `POST /prod-api/system/dataHrRecord/manualMeasure` | `POST /api/ruoyi-system/dataHrRecord/manualMeasure` | Prefix differs |
| SpO2 history | `POST /api/system/dataSpo2Record/batchInsertNew` | `POST /api/ruoyi-system/dataSpo2Record/batchInsertNew` | Prefix differs |
| Temperature history | `POST /api/system/dataCtmpRecord/batchInsertNew` | `POST /api/ruoyi-system/dataCtmpRecord/batchInsertNew` | Prefix differs |
| Steps/calories | `POST /api/system/dataStepsCalorieRecord/batchInsertNew` | `POST /api/ruoyi-system/dataStepsCalorieRecord/batchInsertNew` | Prefix differs |
| Sleep/basic movement | `POST /api/system/baseDataRecord/batchInsert` | `POST /api/ruoyi-system/baseDataRecord/batchInsert` | Prefix differs; confirm type mapping |
| OSA history | `POST /api/ruoyi-system/lookeeRecord/osaDataInsert` | `POST /api/ruoyi-system/lookeeRecord/osaDataInsert` | Path found; request DTO still needs backend confirmation |
| Raw PPG 100Hz | Not confirmed | Not confirmed | Do not invent endpoint |
| Sleep algorithm report query | Not confirmed | Not confirmed | Backend API required |
| OSA report query (ODI/AHI) | Not confirmed | Not confirmed | Backend API required |
| Stress/HRV report query | Not confirmed | Not confirmed | Backend API required |
| Algorithm job status/callback | Not confirmed | Not confirmed | Backend API required |

**Important:** The Android/iOS route prefixes differ for several health-history endpoints. Do not assume the paths are aliases or rewrite one platform to match the other until the cloud backend owner confirms the canonical routes.

## 4. Data contract details needed from backend owner

For each confirmed upload endpoint, obtain:
1. HTTP method, canonical path and environment host.
2. Required headers, authorization format, tenant/app identifiers and timestamp/signature rules.
3. Exact request JSON schema and at least one synthetic example.
4. Required device identity fields and whether MAC address is mandatory.
5. Timestamp unit and timezone convention.
6. Units, sentinel values, quality/error codes and missing-value rules.
7. Batch size and maximum body size.
8. Duplicate/idempotency behavior.
9. Success response schema, error response schema and retry policy.
10. Data retention, deletion and partner/user isolation requirements.

## 5. OSA payload fields visible in the Android SDK

The SDK bytecode shows an OSA top-level `dataList`. Per-period records include:
- `startTime`
- `endTime`
- `deviceName`
- `deviceMac`
- `detailList`

Detail records expose fields including:
- `hr`
- `mySpO2`
- `sport`
- `reserve`
- `devTime`
- `time`

These are field names observed in the SDK implementation, not a complete authoritative backend DTO. Confirm exact types, units, optionality and accepted enum values before transmission.

## 6. Sleep/basic payload fields visible in the Android SDK

The Android SDK's sleep/basic upload builder uses a `dataList`; inspected bytecode exposes per-item fields including `dataValue` and `type` (sleep/basic type observed as `4`). This is not sufficient to finalize the request schema. Obtain the backend DTO and synthetic request fixture.

## 7. Algorithm result-query APIs still required

The upload endpoints do not prove that result retrieval is available. Obtain distinct read APIs for:
- sleep summary and sleep stages (awake/light/deep/REM), sleep intervals and quality flags;
- OSA report (ODI thresholds and calculation window, AHI definition if supported, event counts, valid monitoring duration, signal quality);
- HRV/stress results (metric definitions, time windows, baseline and confidence/quality flags);
- algorithm processing status, job ID, completion callback/webhook, and failure details.

Do not label AHI/ODI as clinically diagnostic without the relevant definitions and validation evidence.

## 8. Authentication/security

The SDK initialization requires platform-issued `accessKey` and `accessSecret`. iOS exposes `currentAccess_token`; Android documents the user Token for Web API calls. SDK network interceptors attach authorization and platform context headers.

Implementation rule:
- platform secrets stay server-side;
- browser calls only the LONGVON Web API using its existing user session;
- enforce user/device ownership before any eventual upload;
- redact tokens, secrets, MAC addresses and health values from logs;
- no health payload logging;
- do not enable upstream requests until backend contract and owner approval are complete.

## 9. Acceptance criteria for this phase

- [x] Local catalog endpoint exists.
- [x] Metadata-only upload preparation endpoint exists.
- [x] Android/iOS upload endpoint candidates are listed.
- [x] Unconfirmed raw PPG and algorithm-result endpoints are explicitly blocked/unconfirmed.
- [x] Outbound upload remains disabled in code.
- [x] No cloud credentials required or added.
- [x] No real health payload accepted by the dry-run endpoint.
- [ ] Backend owner confirms canonical paths and schemas.
- [ ] Synthetic contract fixtures approved.
- [ ] Separate owner authorization for enabling actual outbound transmission.
