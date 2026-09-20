# GEO Platform Matrix — Global + China (Lite)

**Purpose:** Manual AI visibility testing only.  
**Rule:** “Platform can search the web” ≠ “LONGVON has been discovered.” Do not claim LONGVON is indexed or cited until a human test records it.

**Last updated:** 2026-09-20

---

## How to read this matrix

| Column | Meaning |
|--------|---------|
| Web search | Whether the product commonly can retrieve or browse live web results (capability may vary by mode/plan) |
| May cite official sites | Whether answers sometimes include URLs / source cards — not a guarantee for longvon.com |
| Test method | How testers should run queries |
| Verified for LONGVON | Always **No** until a row is filled in `GEO-VISIBILITY-TRACKER.csv` with evidence |

---

## Global

| Platform | Region | Type | Web search | May cite official sites | Test method | Verified for LONGVON |
|----------|--------|------|------------|-------------------------|-------------|----------------------|
| ChatGPT Search | Global | AI Search / Chat with search | Often yes (Search / browsing modes) | Possible | Use Search-enabled chat; paste query unchanged; save answer + any cited URLs | No |
| Google Gemini / Google AI | Global | AI Chat / AI Overviews / AI Mode | Often yes | Possible | Test Gemini chat and, separately, Google AI Overview if shown for the query | No |
| Perplexity | Global | AI Search | Yes (core product) | Common | New thread; paste query; record Sources panel URLs | No |
| Microsoft Copilot / Bing | Global | AI Chat + Search Engine | Yes | Possible | Copilot chat and/or Bing; note which UI; record citations | No |

---

## China

| Platform | Region | Type | Web search | May cite official sites | Test method | Verified for LONGVON |
|----------|--------|--------|------------|-------------------------|-------------|----------------------|
| 豆包 | China | AI Chat (may include search) | Mode-dependent | Possible | Use web/search mode if available; otherwise default chat; record mode | No |
| 通义千问 | China | AI Chat / Search-assisted | Mode-dependent | Possible | Tongyi app or web; enable联网/搜索 if offered | No |
| 腾讯元宝 | China | AI Chat / Search-assisted | Mode-dependent | Possible | Yuanbao app/web; note whether联网检索 was on | No |
| 百度 AI 搜索 / 文心 | China | AI Search / Chat | Yes (search products) | Possible | Prefer AI 搜索 UI when testing discovery; also test 文心 chat if needed | No |
| Kimi | China | AI Chat / Long-context (search modes) | Mode-dependent | Possible | Enable联网搜索 if available; record | No |
| DeepSeek | China | AI Chat | Mode-dependent | Possible | Note是否联网; DeepSeek chat vs search features differ by product surface | No |
| 智谱 / GLM | China | AI Chat | Mode-dependent | Possible | Zhipu/GLM web or app; record search toggle | No |
| 夸克 AI | China | AI Search / Assistant | Often tied to search | Possible | Quark AI / search entry; record cited pages | No |
| 讯飞星火 | China | AI Chat | Mode-dependent | Possible | Spark app/web; record联网状态 | No |
| 秘塔 | China | AI Search | Yes (search-oriented) | Possible | Metaso search UI; record sources | No |

---

## Notes for testers

1. Platform capability changes over time — update this matrix only when capability changes, not when LONGVON appears.  
2. Never mark “Verified for LONGVON” from marketing hope; only from tracker rows.  
3. Prefer **incognito / logged-out / new chat** when possible to reduce personalization bias.  
4. Same `query_id` text must be used across platforms (EN on Global; CN on China — see Query Set).  
5. This file is not evidence that LONGVON appears in any platform.
