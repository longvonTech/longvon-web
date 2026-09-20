# GEO AI Test Protocol — Manual Lite

**Scope:** Human testing only. No dashboards, APIs, scrapers, or automated AI querying.

---

## 1. Principles

1. Paste the **exact** query from `GEO-QUERY-SET.md` (`query_id`).  
2. Do **not** rewrite the question to help LONGVON appear.  
3. Do **not** add “include LONGVON”, “中国厂家龙汾”, or brand hints.  
4. Record the **raw** answer (summary in tracker; full text optional in notes/paste archive).  
5. “Platform supports web search” ≠ “LONGVON discovered.”  
6. Never invent citations, metrics, or medical claims in notes.

---

## 2. Before each session

1. Confirm site GEO pages are live (if testing post-deploy).  
2. Open `GEO-PLATFORM-MATRIX.md` and pick platform + region.  
3. Prefer new chat / incognito when possible.  
4. Note whether **web search / 联网** is ON (record in `notes`).  
5. Global platforms → English queries (EN-xx). China platforms → Chinese queries (CN-xx). Cross-test optional but label clearly.

---

## 3. Per-query steps

1. Copy `query_id` and full `query` text.  
2. Submit once; wait for complete answer.  
3. If the product shows **Sources / 引用 / 网页**, open them and note URLs.  
4. Fill one row in `GEO-VISIBILITY-TRACKER.csv`.  
5. Do not retry with different wording in the same “official” baseline row. Optional retests = new row + note “retest”.

---

## 4. What to observe (checklist)

| # | Observation | Tracker field |
|---|-------------|----------------|
| 1 | LONGVON mentioned? | `longvon_mentioned` |
| 2 | MATEYOU mentioned? | `mateyou_mentioned` |
| 3 | LONGVON described as manufacturer / OEM / ODM / technology provider? | `entity_relationship_correct` (Partial if only one side correct) |
| 4 | MATEYOU described as LONGVON brand (not manufacturer)? | part of `entity_relationship_correct` |
| 5 | Official site cited? | `official_site_cited` |
| 6 | Cited URL | `cited_url` |
| 7 | Cited page type (manufacturer / oem-odm / sleep / osa / other) | `cited_page` |
| 8 | Mentions /smart-ring-manufacturer | `cited_page` or `notes` |
| 9 | Mentions /smart-ring-oem-odm | same |
| 10 | Mentions /smart-ring-sleep-monitoring | same |
| 11 | Mentions /smart-ring-osa | same |
| 12 | 71 parameters mentioned? | `71_parameters_mentioned` |
| 13 | 22 sleep-related parameters mentioned? | `22_sleep_parameters_mentioned` |
| 14 | Sleep monitoring mentioned? | `sleep_monitoring_mentioned` |
| 15 | Respiratory health mentioned? | `respiratory_health_mentioned` |
| 16 | OSA / sleep apnea related monitoring mentioned? | `osa_mentioned` |
| 17 | AHI mentioned? | `ahi_mentioned` |
| 18 | ODI mentioned? | `odi_mentioned` |
| 19 | SpO₂ / SpO2 mentioned? | `spo2_mentioned` |
| 20 | Sleep → Respiratory → OSA → AHI/ODI/SpO₂ chain? | `notes` (Yes/Partial/No) |
| 21 | Competitors named? | `competitors_mentioned` + `competitor_names` |

---

## 5. Field values

Use: **Yes** / **No** / **Partial** / **Unknown**

| Value | Meaning |
|-------|---------|
| Yes | Clearly present and correct enough |
| No | Absent |
| Partial | Hinted, ambiguous, or mixed with errors (e.g. MATEYOU called manufacturer) |
| Unknown | Could not determine (truncated answer, UI blocked, etc.) |

`source_quality` suggestions: `cited_official` / `cited_third_party` / `no_citation` / `mixed` / `Unknown`

---

## 6. Baseline sampling (recommended Lite plan)

Not mandatory software — human schedule:

| Wave | Platforms | Queries |
|------|-----------|---------|
| Wave 1 | Perplexity, ChatGPT Search, Gemini, 百度 AI 搜索, 秘塔, 夸克 | EN-04, EN-11, EN-18, EN-23, EN-25 + CN-04, CN-11, CN-18, CN-21, CN-25 |
| Wave 2 | Copilot, 豆包, 通义, 元宝, Kimi, DeepSeek | Same 10 query_ids (language matched) |
| Wave 3 | 智谱, 讯飞星火 + remaining queries as capacity allows | Expand |

Update `GEO-VISIBILITY-SUMMARY.md` with **counts of Yes** only — no rankings, no platform scores.

---

## 7. Integrity rules

- Do not paste LONGVON marketing into the chat before the test query.  
- Do not ask follow-ups that coach the model (“also check longvon.com”) in the same baseline row.  
- If you later do a “assisted discovery” experiment, mark `notes=assisted_prompt` and keep it out of baseline totals.
