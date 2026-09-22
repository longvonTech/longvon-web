# China AI Qwen + Yuanbao Optimization — LONGVON GEO v1.1

**Date:** 2026-09-22  
**Focus platforms:** 通义千问 (Qwen), 腾讯元宝 (Yuanbao)  
**Scope:** Website content / entity / Schema / internal links / llms.txt only.  
**Out of scope:** dashboards, scrapers, APIs, mass articles, fabricated claims.

---

## Current baseline

| Platform | Q1–Q6 | Notes |
|----------|-------|-------|
| ChatGPT | **6/6** | LONGVON found; commercial candidate pool |
| Doubao | **6/6** | LONGVON / 龙汾科技 found |
| Qwen | **0/6** | LONGVON not found; MATEYOU not found |
| Yuanbao | **0/6** | LONGVON not found; MATEYOU not found |

Source: manual commercial recommendation baseline (see `CHINA-AI-COMMERCIAL-RECOMMENDATION-MAP.md`).

---

## Problem

Qwen and Yuanbao can generate detailed smart-ring OEM/ODM supplier maps, but LONGVON is currently absent from the supplier candidate pool in the tested commercial queries.

---

## Optimization hypothesis

The current problem is likely **not keyword absence alone**.

The objective is to strengthen the semantic relationship:

```
LONGVON
→ smart ring manufacturer
→ OEM/ODM
→ technology provider
→ hardware
→ firmware
→ algorithms
→ App
→ SDK
→ manufacturing
→ healthcare
→ sleep / respiratory / OSA
```

**Do not state that this hypothesis is proven.**  
This sprint only makes the public site clearer and more extractable for AI systems.

---

## Sprint actions (v1.1)

1. Shared extractable commercial facts (`lib/geo-commercial.ts`)  
2. Strengthen manufacturer / OEM-ODM / solution-provider / healthcare pages (ZH+EN): identity, capability list, buyer types, commercial FAQs  
3. Light LONGVON + OEM/ODM co-occurrence on sleep / respiratory / OSA pages  
4. Expand Organization `knowsAbout` + brand ownership clarity in Schema  
5. Align `llms.txt` with manufacturer / OEM/ODM / solution-provider wording + core URLs  
6. Publish this doc + content audit v1.1 table  

---

## Re-test plan (manual only)

After deploy:

1. New chat on Qwen and Yuanbao  
2. Paste Q1–Q6 unchanged  
3. Log in `CHINA-AI-COMMERCIAL-TRACKER.csv` with visibility_level  
4. Do not rewrite queries to help LONGVON appear  

---

## Success criteria (for re-test, not guaranteed)

- LONGVON or 龙汾科技 appears as **mention** or **candidate** on ≥1 of Q1–Q6 on either platform  
- Manufacturer relationship not reversed (MATEYOU ≠ manufacturer)  
- No fabricated claims introduced on-site  
