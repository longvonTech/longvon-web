# China AI Commercial Baseline — Qwen (通义千问)

**Test type:** Manual commercial recommendation queries  
**Platform:** Qwen (通义千问)  
**Entity under test:** LONGVON / 龙汾科技 / MATEYOU  
**Interpretation rule:** `NO` means LONGVON was **not named** in the answer candidate list for that query. It does **not** mean LONGVON lacks the capability.

---

## Summary

| Metric | Value |
|--------|-------|
| LONGVON commercial recommendation visibility | **0/6** |
| LONGVON found | No (all 6) |
| 龙汾科技 found | No (all 6) |
| MATEYOU found | No (all 6) |

---

## Q1–Q6 results

### Q1
**Query:** 可面向医疗健康企业提供智能戒指 OEM/ODM 服务的厂商有哪些？  
**LONGVON:** NO

### Q2
**Query:** 智能戒指的定制开发（ODM/OEM）目前主要集中在深圳、东莞……（完整问句以测试会话原文为准）  
**LONGVON:** NO

### Q3
**Query:** 我正在寻找智能戒指 OEM/ODM 厂商，有哪些公司可以考虑？  
**LONGVON:** NO

### Q4
**Query:** 哪些智能戒指厂商提供贴牌或白牌服务？  
**LONGVON:** NO

### Q5
**Query:** 哪些公司可以提供从智能戒指硬件开发到量产的一站式 OEM 解决方案？  
**LONGVON:** NO

### Q6
**Query:** 哪些公司可以提供智能戒指硬件、固件、算法、APP和SDK的一体化定制服务？  
**LONGVON:** NO

---

## Caveats

1. Manual observation only — not platform-wide indexing proof.  
2. Do not rewrite queries for re-tests.  
3. Qwen answers may invent capabilities, certifications, and capacity numbers for other companies; treat those as **claims**, not verified facts (see `COMPETITOR-CLAIM-VERIFICATION.md`).  
4. Related tracker: `CHINA-AI-COMMERCIAL-TRACKER.csv` (seed rows for Qwen remain `LONGVON_found=No`).

---

## Cross-platform context (unchanged)

| Platform | Q1–Q6 LONGVON |
|----------|---------------|
| ChatGPT | 6/6 found |
| Doubao | 6/6 found |
| Qwen | **0/6** |
| Yuanbao | 0/6 (prior test; not re-run in this file) |
