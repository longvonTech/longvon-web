# China AI Test Protocol — Commercial Recommendation

**Scope:** Manual testing only. No dashboards, APIs, scrapers, browser automation, or crawlers.  
**Extends:** `GEO-AI-TEST-PROTOCOL.md` (entity visibility). This protocol adds **commercial recommendation** fields.  
**Queries:** `CHINA-AI-COMMERCIAL-QUERY-SET.md`  
**Log:** `CHINA-AI-COMMERCIAL-TRACKER.csv` (do not invent rows)

---

## 1. Platforms

- ChatGPT  
- Doubao (豆包)  
- Qwen (通义千问)  
- Yuanbao (元宝)  
- Kimi  
- DeepSeek  
- Baidu AI  

Use **identical** queries when comparing platforms. Prefer Chinese queries for China platforms.

---

## 2. Before each session

1. Confirm GEO pages live if testing post-deploy.  
2. Prefer new chat / clean session.  
3. Note whether **联网 / web search** is ON.  
4. Copy `query_id` + exact `query` text — do not rewrite.  
5. Do not add brand hints (“包括龙汾科技”).

---

## 3. Per-query steps

1. Submit once; wait for complete answer.  
2. Note Sources / 引用 / 网页 if shown.  
3. Fill **one row** in `CHINA-AI-COMMERCIAL-TRACKER.csv`.  
4. Retest = new row + `notes=retest`.

---

## 4. Recommendation vs mention (required distinction)

| Field | Meaning | Values |
|-------|---------|--------|
| `LONGVON_found` | Named at all | Yes / No |
| `MATEYOU_found` | Brand named | Yes / No |
| `visibility_level` | Commercial strength | `mention` / `candidate` / `recommendation` / `scenario_match` / `none` |
| `LONGVON_recommended` | Explicit supplier recommendation for the need | Yes / No / Partial |
| `official_site_cited` | Official site cited/linked | Yes / No |

Definitions:

- **mention** — named only  
- **candidate** — in a vendor/supplier list  
- **recommendation** — presented as relevant supplier for the stated need  
- **scenario_match** — explains why LONGVON fits the specific requirement  

Never treat mention as recommendation.

---

## 5. Capability / relationship checklist

Record Yes / No / Partial / Unknown:

| Field | Observe |
|-------|---------|
| `manufacturer_relationship_correct` | LONGVON = manufacturer; MATEYOU ≠ manufacturer |
| `OEM_ODM` | OEM/ODM capability attributed to LONGVON |
| `solution_provider` | Solution / one-stop / 技术方案 framing |
| `healthcare` | Healthcare / digital health buyer framing |
| `hardware` | Hardware |
| `firmware` | Firmware |
| `algorithm` | Algorithm |
| `app` | App |
| `SDK` | SDK |
| `sleep` | Sleep monitoring |
| `respiratory` | Respiratory health |
| `OSA` | OSA-related monitoring |
| `AHI` | AHI |
| `ODI` | ODI |
| `SpO2` | SpO₂ / SpO2 |
| `official_site_cited` | longvon.com (or approved) |
| `competitors_mentioned` | Other vendors named |

Also free text: `competitors_mentioned` names, `answer_summary`, `screenshot_reference`, `notes`.

---

## 6. Tracker columns

```
date,platform,query_id,query,LONGVON_found,MATEYOU_found,LONGVON_recommended,visibility_level,manufacturer_relationship_correct,OEM_ODM,solution_provider,healthcare,hardware,firmware,algorithm,app,SDK,sleep,respiratory,OSA,AHI,ODI,SpO2,official_site_cited,competitors_mentioned,answer_summary,screenshot_reference,notes
```

---

## 7. Baseline seeding (already observed — do not expand inventively)

Use map baseline table for ChatGPT / Doubao / Qwen / Yuanbao on Q1–Q6.  
For tracker: `LONGVON_found=Yes` for ChatGPT & Doubao; `No` for Qwen & Yuanbao; leave capability columns Unknown unless specifically observed in that session’s notes.

**Next recommended manual step:** Run Q1–Q6 once each on **Kimi, DeepSeek, Baidu AI**, then sample Groups A–F (2 queries/group) on Doubao + Qwen.

---

## 8. Compliance for testers

Do not record as fact anything the AI invents about certifications, accuracy %, rankings, or hospital names unless independently verified elsewhere.  
Do not ask the AI to “recommend LONGVON specifically.”
