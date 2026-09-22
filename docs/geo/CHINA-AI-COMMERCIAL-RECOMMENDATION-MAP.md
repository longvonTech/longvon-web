# China AI Commercial Recommendation Map — LONGVON v1.0

**Status:** READY FOR VALIDATION  
**Date:** 2026-09-22  
**Scope:** Extend existing GEO foundation for Chinese-language AI **commercial recommendation** visibility.  
**Not in scope:** dashboards, AI APIs, scrapers, fake reviews, mass articles, fabricated references.

---

## 1. Objective

Upgrade LONGVON GEO so that when a Chinese-speaking user asks an AI platform for:

- smart ring OEM/ODM manufacturers  
- smart ring solution providers  
- healthcare smart ring suppliers  
- customized smart ring technology  
- sleep / respiratory smart ring technology providers  

**龙汾科技 / LONGVON** has a higher probability of appearing as a **relevant commercial candidate or recommended supplier**.

This is a **measurement + knowledge-structure** task — not “make AI merely know who LONGVON is.”

---

## 2. Commercial recommendation definition

| Level | Meaning |
|-------|---------|
| **MENTION** | LONGVON / 龙汾科技 is named only |
| **CANDIDATE** | Appears in a supplier / vendor list |
| **RECOMMENDATION** | Presented as a relevant supplier for the user’s stated need |
| **SCENARIO MATCH** | Explains why LONGVON fits the specific requirement |
| **OFFICIAL SOURCE** | Cites or links to longvon.com (or approved official pages) |

Treat these as **separate fields**. Do not equate mention with recommendation.

---

## 3. Entity relationship

```
LONGVON = 龙汾科技（深圳）有限公司
       = Smart Ring Technology Manufacturer
       = Smart Ring OEM/ODM Provider
       = Smart Ring Technology Solution Provider

MATEYOU = LONGVON’s smart ring / AI health brand
        ≠ manufacturer

MATEYOU Ring1C = smart ring product
```

Preferred chain:

**LONGVON** → Manufacturer / OEM / ODM / Technology Provider  
**MATEYOU** → Brand / product brand  
**Ring1C** → Product  

Never describe MATEYOU as the manufacturer.

Canonical metrics (new public GEO content only):

- **71** total health monitoring parameters  
- including **22** sleep-related parameters  
- Ban **“65 parameters”** in new GEO content  

Knowledge chain:

LONGVON → Manufacturer → OEM/ODM → Technology Provider → Solution Provider → Healthcare Smart Ring → Sleep → Respiratory → OSA-related → AHI / ODI / SpO₂

---

## 4. Q1–Q6 baseline (manual observation only)

Test set (commercial recommendation intent):

| ID | Query |
|----|-------|
| Q1 | 可提供智能戒指 OEM/ODM 服务的厂商有哪些？ |
| Q2 | 如果我要找一家可以定制开发智能戒指的厂商，有哪些公司可以选择？ |
| Q3 | 哪些公司可以提供智能戒指从硬件、固件、算法、App 到生产制造的一站式解决方案？ |
| Q4 | 我是一家医疗健康企业，想开发自己的智能戒指产品，有哪些 OEM/ODM 厂商可以合作？ |
| Q5 | 哪些智能戒指厂商可以提供睡眠监测解决方案和 OEM/ODM 服务？ |
| Q6 | 如果我要开发一款重点用于睡眠和睡眠呼吸健康监测的智能戒指，有哪些厂商可以提供技术和 OEM/ODM 支持？ |

### Baseline table (do not invent additional results)

| Platform | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 |
|----------|----|----|----|----|----|----|
| ChatGPT | LONGVON found | found | found | found | found | found |
| Doubao | LONGVON / 龙汾科技 found | found | found | found | found | found |
| Qwen | not found | not found | not found | not found | not found | not found |
| Yuanbao | not found | not found | not found | not found | not found | not found |
| Kimi | not tested | not tested | not tested | not tested | not tested | not tested |
| DeepSeek | not tested | not tested | not tested | not tested | not tested | not tested |
| Baidu AI | not tested | not tested | not tested | not tested | not tested | not tested |

**Caveats:** Manual observations only. Do not claim universal indexing or guaranteed recommendation. Do not rank AI platforms.

---

## 5. Platform status

| Platform | Status | Notes |
|----------|--------|-------|
| ChatGPT | Baseline recorded | Q1–Q6 LONGVON found |
| Doubao (豆包) | Baseline recorded | Q1–Q6 LONGVON / 龙汾科技 found |
| Qwen (通义) | Baseline recorded | Q1–Q6 not found |
| Yuanbao (元宝) | Baseline recorded | Q1–Q6 not found |
| Kimi | Pending | Not tested yet |
| DeepSeek | Pending | Not tested yet |
| Baidu AI | Pending | Not tested yet |

Full query matrix: `CHINA-AI-COMMERCIAL-QUERY-SET.md`  
Test protocol: `CHINA-AI-TEST-PROTOCOL.md`  
Results log: `CHINA-AI-COMMERCIAL-TRACKER.csv` (extends GEO visibility tracking for commercial fields)

---

## 6. Testing methodology

1. Use **identical** Chinese queries when comparing platforms.  
2. Manual paste only — no automation / scraping.  
3. Prefer new chat; note whether 联网 / web search is on.  
4. Record MENTION vs CANDIDATE vs RECOMMENDATION separately.  
5. Record manufacturer relationship correctness (LONGVON vs MATEYOU).  
6. Do not rewrite queries to help LONGVON appear.  
7. Optional retests = new tracker row + note “retest”.

Details: `CHINA-AI-TEST-PROTOCOL.md`.

---

## 7. Future test results

Store in `CHINA-AI-COMMERCIAL-TRACKER.csv`.  
Do not invent rows. Fill only after real manual tests.

Priority next session:

1. Complete **Kimi / DeepSeek / Baidu AI** on Q1–Q6.  
2. Re-test **Qwen / Yuanbao** after solution-provider + healthcare pages are live.  
3. Expand to Groups A–F sample (at least 2 queries per group).

---

## 8. Commercial intent categories

| Group | Intent | Primary site anchors |
|-------|--------|----------------------|
| A | OEM/ODM | `/smart-ring-oem-odm`, `/partner/oem` |
| B | Manufacturer / solution provider | `/smart-ring-manufacturer`, `/smart-ring-solution-provider`, `/smart-ring-technology` |
| C | Healthcare | `/smart-ring-healthcare-solutions`, OEM + manufacturer |
| D | Full stack (HW/FW/Algo/App/SDK/MFG) | `/smart-ring-technology`, `/smart-ring-oem-odm` |
| E | Sleep / respiratory | `/smart-ring-sleep-monitoring`, `/smart-ring-sleep-respiratory` |
| F | OSA / AHI / ODI / SpO₂ | `/smart-ring-osa` (+ respiratory/sleep) |

Queries: `CHINA-AI-COMMERCIAL-QUERY-SET.md`.

---

## 9. Recommended content relationships

```
Manufacturer
  → OEM/ODM
  → Solution Provider
  → Healthcare Solutions
  → Sleep Monitoring
  → Respiratory Monitoring
  → OSA (AHI / ODI / SpO₂)

OEM/ODM
  → Hardware · Firmware · Algorithm · App · SDK · Manufacturing
  → Technology page
  → Partner OEM form
```

Entity graph: `LONGVON-COMMERCIAL-ENTITY-GRAPH.md`.  
Page audit: `CHINA-AI-COMMERCIAL-CONTENT-AUDIT.md`.

---

## 10. Optimization backlog

| Priority | Item | Status |
|----------|------|--------|
| P0 | Close body links OEM↔Manufacturer/Technology; OSA→OEM commercial page | In sprint |
| P0 | Add `/smart-ring-solution-provider` + `/smart-ring-healthcare-solutions` | In sprint |
| P0 | Manual tests: Kimi, DeepSeek, Baidu AI (Q1–Q6) | Pending human |
| P1 | Alias `/smart-ring-respiratory` → sleep-respiratory | In sprint |
| P1 | Re-test Qwen / Yuanbao after content deploy | Pending human |
| P1 | Algorithm row visibility in OEM matrix | In sprint |
| P2 | Deepen respiratory capability copy | Backlog |
| P2 | Third-party evidence (when real) — never fabricate | Backlog |
| — | Dashboard / scraper / mass AI articles | **Out of scope** |

---

## Related docs

- `LONGVON-ENTITY.md` / `LONGVON-GEO-KNOWLEDGE-BASE.md` — entity canon  
- `GEO-AI-TEST-PROTOCOL.md` / `GEO-VISIBILITY-TRACKER.csv` — earlier entity visibility tracking  
- `CHINA-AI-COMMERCIAL-*` — this commercial recommendation layer  
