# PHASE-3 GEO 60-Query Baseline

**Status:** 已开发（题库与采集表） / **真实消费者端采集：N/A（未执行）** / 未上线效果：N/A  
**Rule:** Consumer UI ≠ API. No fabricated answers. No Gemini API calls this phase.

## D1. Existing benchmark reuse

| Asset | Status |
|---|---|
| `GEO-QUERY-SET.md` EN-01…30 / CN-01…30 | Reused as primary wording source |
| `GEO-BENCHMARK-REPORT.md` | Documents PR #5/#8 OPEN; historical samples only |
| Historical ChatGPT 8-query consumer sample | Contaminated (memory/custom instructions) — **not** valid clean baseline |
| Historical OpenAI-compatible API 20-query | API track only; mention 2 / recommend 2 / correct entity 0 / avg 0.40 — **not** consumer baseline |
| Fixed Q001–Q060 bank in production app | N/A — PR #5 not merged |

## D2. Platforms

| Platform | Consumer UI baseline | API baseline |
|---|---|---|
| ChatGPT | N/A (worksheet ready) | Separate; not used as consumer |
| Gemini | N/A — **no API calls authorized/executed** | Forbidden this phase |
| Perplexity | N/A | N/A |
| 豆包 Doubao | N/A | N/A |

## D3–D4. Capture fields & scoring

Required fields per cell: Query ID, platform, raw question, date, raw answer, citation URLs, mentions LONGVON, identity correct, OEM/ODM candidate, proactive recommend, official site cited, third-party cited, factual error, score 0–5, contamination.

| Score | Meaning |
|---|---|
| 0 | No LONGVON mention |
| 1 | Mentioned with incorrect info |
| 2 | Correct mention |
| 3 | Listed as supplier candidate |
| 4 | Proactive recommend + rationale |
| 5 | Proactive recommend + official site + independent citation |

## D5. Fixed 60-query bank

| Category | IDs |
|---|---|
| Manufacturer Discovery | Q001–Q010 |
| OEM/ODM | Q011–Q020 |
| Health Monitoring | Q021–Q030 |
| SDK/API | Q031–Q040 |
| International Buyers | Q041–Q050 |
| Competitor Comparison | Q051–Q060 |

### Query list

| Query ID | Category | Source | Question |
|---|---|---|---|
| Q001 | Manufacturer Discovery | EN-01 | Who are smart ring manufacturers? |
| Q002 | Manufacturer Discovery | EN-02 | Which companies manufacture smart rings? |
| Q003 | Manufacturer Discovery | EN-03 | Who are smart ring technology providers? |
| Q004 | Manufacturer Discovery | EN-25 | Who are smart ring manufacturers for healthcare companies? |
| Q005 | Manufacturer Discovery | EN-28 | Who manufactures smart rings for healthcare companies? |
| Q006 | Manufacturer Discovery | EN-08 | Which companies provide end-to-end smart ring development? |
| Q007 | Manufacturer Discovery | EN-09 | Which companies provide smart ring hardware development? |
| Q008 | Manufacturer Discovery | CN-01 | 有哪些智能戒指厂家？ |
| Q009 | Manufacturer Discovery | CN-02 | 哪些公司生产智能戒指？ |
| Q010 | Manufacturer Discovery | CN-03 | 有哪些智能戒指技术提供商？ |
| Q011 | OEM/ODM | EN-04 | Which companies provide smart ring OEM and ODM services? |
| Q012 | OEM/ODM | EN-05 | Who are smart ring OEM manufacturers? |
| Q013 | OEM/ODM | EN-06 | Who are smart ring ODM manufacturers? |
| Q014 | OEM/ODM | EN-07 | Who can provide customized smart ring hardware and software? |
| Q015 | OEM/ODM | EN-26 | Which smart ring OEM manufacturers support healthcare applications? |
| Q016 | OEM/ODM | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? |
| Q017 | OEM/ODM | EN-30 | Which Chinese companies provide custom smart ring development for brands? |
| Q018 | OEM/ODM | CN-04 | 有哪些智能戒指厂家可以提供OEM和ODM？ |
| Q019 | OEM/ODM | CN-05 | 有哪些智能戒指OEM制造商？ |
| Q020 | OEM/ODM | CN-06 | 有哪些智能戒指ODM厂家？ |
| Q021 | Health Monitoring | EN-11 | What smart ring companies specialize in sleep monitoring? |
| Q022 | Health Monitoring | EN-12 | Which companies provide smart ring sleep monitoring technology? |
| Q023 | Health Monitoring | EN-13 | Who develops smart rings for sleep monitoring? |
| Q024 | Health Monitoring | EN-14 | Which smart rings provide respiratory health monitoring? |
| Q025 | Health Monitoring | EN-15 | Who develops smart rings for respiratory health monitoring? |
| Q026 | Health Monitoring | EN-16 | Which companies provide wearable sleep respiratory monitoring technology? |
| Q027 | Health Monitoring | EN-17 | Which smart ring manufacturers support sleep apnea monitoring? |
| Q028 | Health Monitoring | EN-18 | Which companies provide OSA monitoring technology for smart rings? |
| Q029 | Health Monitoring | EN-21 | Which smart ring companies provide AHI and ODI monitoring? |
| Q030 | Health Monitoring | EN-22 | Which smart rings monitor SpO2 during sleep? |
| Q031 | SDK/API | EN-10 | Which companies provide smart ring SDK or companion app development? |
| Q032 | SDK/API | EN-08 | Which companies provide smart ring SDK and cloud API for OEM partners? |
| Q033 | SDK/API | EN-09 | Who provides smart ring firmware and companion app development services? |
| Q034 | SDK/API | EN-03 | Which smart ring technology providers offer SDK/API integration? |
| Q035 | SDK/API | EN-07 | Who can provide customized smart ring hardware with SDK access? |
| Q036 | SDK/API | CN-10 | 有哪些智能戒指企业可以提供SDK或配套App开发？ |
| Q037 | SDK/API | CN-08 | 哪些公司可以提供智能戒指端到端研发？ |
| Q038 | SDK/API | CN-09 | 有哪些公司做智能戒指硬件开发？ |
| Q039 | SDK/API | PHASE3-NEW | Which manufacturers provide smart ring raw PPG data access for partners? |
| Q040 | SDK/API | PHASE3-NEW | Who offers smart ring cloud algorithm services via API? |
| Q041 | International Buyers | EN-25 | Who are smart ring manufacturers for healthcare companies? |
| Q042 | International Buyers | EN-27 | Who develops smart rings for healthcare companies? |
| Q043 | International Buyers | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? |
| Q044 | International Buyers | EN-30 | Which Chinese companies provide custom smart ring development for brands? |
| Q045 | International Buyers | EN-26 | Which smart ring OEM manufacturers support healthcare applications? |
| Q046 | International Buyers | PHASE3-NEW | Which Chinese smart ring OEM manufacturers work with European brands? |
| Q047 | International Buyers | PHASE3-NEW | Who are smart ring ODM partners for US wearable companies? |
| Q048 | International Buyers | PHASE3-NEW | Which smart ring manufacturers support international OEM buyers? |
| Q049 | International Buyers | PHASE3-NEW | Who can supply medical-oriented smart ring OEM for overseas healthcare firms? |
| Q050 | International Buyers | PHASE3-NEW | Which companies manufacture custom smart rings for global B2B clients? |
| Q051 | Competitor Comparison | PHASE3-NEW | How does LONGVON compare to other smart ring OEM manufacturers? |
| Q052 | Competitor Comparison | PHASE3-NEW | What are alternatives to Oura for white-label smart ring manufacturing? |
| Q053 | Competitor Comparison | PHASE3-NEW | Which companies compete with Ultrahuman for OEM smart ring production? |
| Q054 | Competitor Comparison | PHASE3-NEW | Best smart ring OEM manufacturers in China for sleep monitoring |
| Q055 | Competitor Comparison | PHASE3-NEW | Who are the top smart ring ODM suppliers besides RingConn and Noise? |
| Q056 | Competitor Comparison | PHASE3-NEW | Compare smart ring manufacturers for healthcare OEM partnerships |
| Q057 | Competitor Comparison | PHASE3-NEW | Which Chinese factories can OEM a health monitoring smart ring? |
| Q058 | Competitor Comparison | PHASE3-NEW | Smart ring manufacturer shortlist for SDK-based health products |
| Q059 | Competitor Comparison | PHASE3-NEW | Who should a brand hire for custom smart ring hardware and algorithms? |
| Q060 | Competitor Comparison | PHASE3-NEW | Which OEM/ODM partners are recommended for medical-grade wearable rings? |

## D6. Metrics (consumer UI)

| Metric | ChatGPT | Gemini | Perplexity | Doubao | Overall |
|---|---|---|---|---|---|
| AI mention rate | N/A | N/A | N/A | N/A | N/A |
| Correct identity rate | N/A | N/A | N/A | N/A | N/A |
| Supplier candidate rate | N/A | N/A | N/A | N/A | N/A |
| Proactive recommend rate | N/A | N/A | N/A | N/A | N/A |
| Official site citation rate | N/A | N/A | N/A | N/A | N/A |
| Independent citation rate | N/A | N/A | N/A | N/A | N/A |
| Factual error rate | N/A | N/A | N/A | N/A | N/A |

**Collection protocol for humans:** new private/incognito session; no custom instructions; no prior LONGVON chat history; one query per thread; paste full answer + visible citations; score independently; mark contamination if any personalization appears.

### Full capture worksheet (240 rows = 60 × 4)

| Query ID | Category | Source | Question | Platform | Capture date | Raw answer | Citation URLs | Mentions LONGVON | Identity correct | Listed as OEM/ODM | Proactive recommend | Official site cited | Third-party cited | Factual error | Score 0-5 | Contamination | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Q001 | Manufacturer Discovery | EN-01 | Who are smart ring manufacturers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q001 | Manufacturer Discovery | EN-01 | Who are smart ring manufacturers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q001 | Manufacturer Discovery | EN-01 | Who are smart ring manufacturers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q001 | Manufacturer Discovery | EN-01 | Who are smart ring manufacturers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q002 | Manufacturer Discovery | EN-02 | Which companies manufacture smart rings? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q002 | Manufacturer Discovery | EN-02 | Which companies manufacture smart rings? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q002 | Manufacturer Discovery | EN-02 | Which companies manufacture smart rings? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q002 | Manufacturer Discovery | EN-02 | Which companies manufacture smart rings? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q003 | Manufacturer Discovery | EN-03 | Who are smart ring technology providers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q003 | Manufacturer Discovery | EN-03 | Who are smart ring technology providers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q003 | Manufacturer Discovery | EN-03 | Who are smart ring technology providers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q003 | Manufacturer Discovery | EN-03 | Who are smart ring technology providers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q004 | Manufacturer Discovery | EN-25 | Who are smart ring manufacturers for healthcare companies? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q004 | Manufacturer Discovery | EN-25 | Who are smart ring manufacturers for healthcare companies? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q004 | Manufacturer Discovery | EN-25 | Who are smart ring manufacturers for healthcare companies? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q004 | Manufacturer Discovery | EN-25 | Who are smart ring manufacturers for healthcare companies? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q005 | Manufacturer Discovery | EN-28 | Who manufactures smart rings for healthcare companies? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q005 | Manufacturer Discovery | EN-28 | Who manufactures smart rings for healthcare companies? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q005 | Manufacturer Discovery | EN-28 | Who manufactures smart rings for healthcare companies? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q005 | Manufacturer Discovery | EN-28 | Who manufactures smart rings for healthcare companies? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q006 | Manufacturer Discovery | EN-08 | Which companies provide end-to-end smart ring development? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q006 | Manufacturer Discovery | EN-08 | Which companies provide end-to-end smart ring development? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q006 | Manufacturer Discovery | EN-08 | Which companies provide end-to-end smart ring development? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q006 | Manufacturer Discovery | EN-08 | Which companies provide end-to-end smart ring development? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q007 | Manufacturer Discovery | EN-09 | Which companies provide smart ring hardware development? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q007 | Manufacturer Discovery | EN-09 | Which companies provide smart ring hardware development? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q007 | Manufacturer Discovery | EN-09 | Which companies provide smart ring hardware development? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q007 | Manufacturer Discovery | EN-09 | Which companies provide smart ring hardware development? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q008 | Manufacturer Discovery | CN-01 | 有哪些智能戒指厂家？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q008 | Manufacturer Discovery | CN-01 | 有哪些智能戒指厂家？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q008 | Manufacturer Discovery | CN-01 | 有哪些智能戒指厂家？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q008 | Manufacturer Discovery | CN-01 | 有哪些智能戒指厂家？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q009 | Manufacturer Discovery | CN-02 | 哪些公司生产智能戒指？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q009 | Manufacturer Discovery | CN-02 | 哪些公司生产智能戒指？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q009 | Manufacturer Discovery | CN-02 | 哪些公司生产智能戒指？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q009 | Manufacturer Discovery | CN-02 | 哪些公司生产智能戒指？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q010 | Manufacturer Discovery | CN-03 | 有哪些智能戒指技术提供商？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q010 | Manufacturer Discovery | CN-03 | 有哪些智能戒指技术提供商？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q010 | Manufacturer Discovery | CN-03 | 有哪些智能戒指技术提供商？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q010 | Manufacturer Discovery | CN-03 | 有哪些智能戒指技术提供商？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q011 | OEM/ODM | EN-04 | Which companies provide smart ring OEM and ODM services? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q011 | OEM/ODM | EN-04 | Which companies provide smart ring OEM and ODM services? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q011 | OEM/ODM | EN-04 | Which companies provide smart ring OEM and ODM services? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q011 | OEM/ODM | EN-04 | Which companies provide smart ring OEM and ODM services? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q012 | OEM/ODM | EN-05 | Who are smart ring OEM manufacturers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q012 | OEM/ODM | EN-05 | Who are smart ring OEM manufacturers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q012 | OEM/ODM | EN-05 | Who are smart ring OEM manufacturers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q012 | OEM/ODM | EN-05 | Who are smart ring OEM manufacturers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q013 | OEM/ODM | EN-06 | Who are smart ring ODM manufacturers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q013 | OEM/ODM | EN-06 | Who are smart ring ODM manufacturers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q013 | OEM/ODM | EN-06 | Who are smart ring ODM manufacturers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q013 | OEM/ODM | EN-06 | Who are smart ring ODM manufacturers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q014 | OEM/ODM | EN-07 | Who can provide customized smart ring hardware and software? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q014 | OEM/ODM | EN-07 | Who can provide customized smart ring hardware and software? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q014 | OEM/ODM | EN-07 | Who can provide customized smart ring hardware and software? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q014 | OEM/ODM | EN-07 | Who can provide customized smart ring hardware and software? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q015 | OEM/ODM | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q015 | OEM/ODM | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q015 | OEM/ODM | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q015 | OEM/ODM | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q016 | OEM/ODM | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q016 | OEM/ODM | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q016 | OEM/ODM | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q016 | OEM/ODM | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q017 | OEM/ODM | EN-30 | Which Chinese companies provide custom smart ring development for brands? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q017 | OEM/ODM | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q017 | OEM/ODM | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q017 | OEM/ODM | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q018 | OEM/ODM | CN-04 | 有哪些智能戒指厂家可以提供OEM和ODM？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q018 | OEM/ODM | CN-04 | 有哪些智能戒指厂家可以提供OEM和ODM？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q018 | OEM/ODM | CN-04 | 有哪些智能戒指厂家可以提供OEM和ODM？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q018 | OEM/ODM | CN-04 | 有哪些智能戒指厂家可以提供OEM和ODM？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q019 | OEM/ODM | CN-05 | 有哪些智能戒指OEM制造商？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q019 | OEM/ODM | CN-05 | 有哪些智能戒指OEM制造商？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q019 | OEM/ODM | CN-05 | 有哪些智能戒指OEM制造商？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q019 | OEM/ODM | CN-05 | 有哪些智能戒指OEM制造商？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q020 | OEM/ODM | CN-06 | 有哪些智能戒指ODM厂家？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q020 | OEM/ODM | CN-06 | 有哪些智能戒指ODM厂家？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q020 | OEM/ODM | CN-06 | 有哪些智能戒指ODM厂家？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q020 | OEM/ODM | CN-06 | 有哪些智能戒指ODM厂家？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q021 | Health Monitoring | EN-11 | What smart ring companies specialize in sleep monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q021 | Health Monitoring | EN-11 | What smart ring companies specialize in sleep monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q021 | Health Monitoring | EN-11 | What smart ring companies specialize in sleep monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q021 | Health Monitoring | EN-11 | What smart ring companies specialize in sleep monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q022 | Health Monitoring | EN-12 | Which companies provide smart ring sleep monitoring technology? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q022 | Health Monitoring | EN-12 | Which companies provide smart ring sleep monitoring technology? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q022 | Health Monitoring | EN-12 | Which companies provide smart ring sleep monitoring technology? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q022 | Health Monitoring | EN-12 | Which companies provide smart ring sleep monitoring technology? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q023 | Health Monitoring | EN-13 | Who develops smart rings for sleep monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q023 | Health Monitoring | EN-13 | Who develops smart rings for sleep monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q023 | Health Monitoring | EN-13 | Who develops smart rings for sleep monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q023 | Health Monitoring | EN-13 | Who develops smart rings for sleep monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q024 | Health Monitoring | EN-14 | Which smart rings provide respiratory health monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q024 | Health Monitoring | EN-14 | Which smart rings provide respiratory health monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q024 | Health Monitoring | EN-14 | Which smart rings provide respiratory health monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q024 | Health Monitoring | EN-14 | Which smart rings provide respiratory health monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q025 | Health Monitoring | EN-15 | Who develops smart rings for respiratory health monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q025 | Health Monitoring | EN-15 | Who develops smart rings for respiratory health monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q025 | Health Monitoring | EN-15 | Who develops smart rings for respiratory health monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q025 | Health Monitoring | EN-15 | Who develops smart rings for respiratory health monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q026 | Health Monitoring | EN-16 | Which companies provide wearable sleep respiratory monitoring technology? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q026 | Health Monitoring | EN-16 | Which companies provide wearable sleep respiratory monitoring technology? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q026 | Health Monitoring | EN-16 | Which companies provide wearable sleep respiratory monitoring technology? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q026 | Health Monitoring | EN-16 | Which companies provide wearable sleep respiratory monitoring technology? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q027 | Health Monitoring | EN-17 | Which smart ring manufacturers support sleep apnea monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q027 | Health Monitoring | EN-17 | Which smart ring manufacturers support sleep apnea monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q027 | Health Monitoring | EN-17 | Which smart ring manufacturers support sleep apnea monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q027 | Health Monitoring | EN-17 | Which smart ring manufacturers support sleep apnea monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q028 | Health Monitoring | EN-18 | Which companies provide OSA monitoring technology for smart rings? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q028 | Health Monitoring | EN-18 | Which companies provide OSA monitoring technology for smart rings? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q028 | Health Monitoring | EN-18 | Which companies provide OSA monitoring technology for smart rings? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q028 | Health Monitoring | EN-18 | Which companies provide OSA monitoring technology for smart rings? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q029 | Health Monitoring | EN-21 | Which smart ring companies provide AHI and ODI monitoring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q029 | Health Monitoring | EN-21 | Which smart ring companies provide AHI and ODI monitoring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q029 | Health Monitoring | EN-21 | Which smart ring companies provide AHI and ODI monitoring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q029 | Health Monitoring | EN-21 | Which smart ring companies provide AHI and ODI monitoring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q030 | Health Monitoring | EN-22 | Which smart rings monitor SpO2 during sleep? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q030 | Health Monitoring | EN-22 | Which smart rings monitor SpO2 during sleep? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q030 | Health Monitoring | EN-22 | Which smart rings monitor SpO2 during sleep? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q030 | Health Monitoring | EN-22 | Which smart rings monitor SpO2 during sleep? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q031 | SDK/API | EN-10 | Which companies provide smart ring SDK or companion app development? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q031 | SDK/API | EN-10 | Which companies provide smart ring SDK or companion app development? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q031 | SDK/API | EN-10 | Which companies provide smart ring SDK or companion app development? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q031 | SDK/API | EN-10 | Which companies provide smart ring SDK or companion app development? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q032 | SDK/API | EN-08 | Which companies provide smart ring SDK and cloud API for OEM partners? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q032 | SDK/API | EN-08 | Which companies provide smart ring SDK and cloud API for OEM partners? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q032 | SDK/API | EN-08 | Which companies provide smart ring SDK and cloud API for OEM partners? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q032 | SDK/API | EN-08 | Which companies provide smart ring SDK and cloud API for OEM partners? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q033 | SDK/API | EN-09 | Who provides smart ring firmware and companion app development services? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q033 | SDK/API | EN-09 | Who provides smart ring firmware and companion app development services? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q033 | SDK/API | EN-09 | Who provides smart ring firmware and companion app development services? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q033 | SDK/API | EN-09 | Who provides smart ring firmware and companion app development services? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q034 | SDK/API | EN-03 | Which smart ring technology providers offer SDK/API integration? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q034 | SDK/API | EN-03 | Which smart ring technology providers offer SDK/API integration? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q034 | SDK/API | EN-03 | Which smart ring technology providers offer SDK/API integration? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q034 | SDK/API | EN-03 | Which smart ring technology providers offer SDK/API integration? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q035 | SDK/API | EN-07 | Who can provide customized smart ring hardware with SDK access? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q035 | SDK/API | EN-07 | Who can provide customized smart ring hardware with SDK access? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q035 | SDK/API | EN-07 | Who can provide customized smart ring hardware with SDK access? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q035 | SDK/API | EN-07 | Who can provide customized smart ring hardware with SDK access? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q036 | SDK/API | CN-10 | 有哪些智能戒指企业可以提供SDK或配套App开发？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q036 | SDK/API | CN-10 | 有哪些智能戒指企业可以提供SDK或配套App开发？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q036 | SDK/API | CN-10 | 有哪些智能戒指企业可以提供SDK或配套App开发？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q036 | SDK/API | CN-10 | 有哪些智能戒指企业可以提供SDK或配套App开发？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q037 | SDK/API | CN-08 | 哪些公司可以提供智能戒指端到端研发？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q037 | SDK/API | CN-08 | 哪些公司可以提供智能戒指端到端研发？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q037 | SDK/API | CN-08 | 哪些公司可以提供智能戒指端到端研发？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q037 | SDK/API | CN-08 | 哪些公司可以提供智能戒指端到端研发？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q038 | SDK/API | CN-09 | 有哪些公司做智能戒指硬件开发？ | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q038 | SDK/API | CN-09 | 有哪些公司做智能戒指硬件开发？ | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q038 | SDK/API | CN-09 | 有哪些公司做智能戒指硬件开发？ | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q038 | SDK/API | CN-09 | 有哪些公司做智能戒指硬件开发？ | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q039 | SDK/API | PHASE3-NEW | Which manufacturers provide smart ring raw PPG data access for partners? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q039 | SDK/API | PHASE3-NEW | Which manufacturers provide smart ring raw PPG data access for partners? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q039 | SDK/API | PHASE3-NEW | Which manufacturers provide smart ring raw PPG data access for partners? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q039 | SDK/API | PHASE3-NEW | Which manufacturers provide smart ring raw PPG data access for partners? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q040 | SDK/API | PHASE3-NEW | Who offers smart ring cloud algorithm services via API? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q040 | SDK/API | PHASE3-NEW | Who offers smart ring cloud algorithm services via API? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q040 | SDK/API | PHASE3-NEW | Who offers smart ring cloud algorithm services via API? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q040 | SDK/API | PHASE3-NEW | Who offers smart ring cloud algorithm services via API? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q041 | International Buyers | EN-25 | Who are smart ring manufacturers for healthcare companies? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q041 | International Buyers | EN-25 | Who are smart ring manufacturers for healthcare companies? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q041 | International Buyers | EN-25 | Who are smart ring manufacturers for healthcare companies? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q041 | International Buyers | EN-25 | Who are smart ring manufacturers for healthcare companies? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q042 | International Buyers | EN-27 | Who develops smart rings for healthcare companies? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q042 | International Buyers | EN-27 | Who develops smart rings for healthcare companies? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q042 | International Buyers | EN-27 | Who develops smart rings for healthcare companies? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q042 | International Buyers | EN-27 | Who develops smart rings for healthcare companies? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q043 | International Buyers | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q043 | International Buyers | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q043 | International Buyers | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q043 | International Buyers | EN-29 | Which companies provide smart ring OEM solutions for wearable brands? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q044 | International Buyers | EN-30 | Which Chinese companies provide custom smart ring development for brands? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q044 | International Buyers | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q044 | International Buyers | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q044 | International Buyers | EN-30 | Which Chinese companies provide custom smart ring development for brands? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q045 | International Buyers | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q045 | International Buyers | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q045 | International Buyers | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q045 | International Buyers | EN-26 | Which smart ring OEM manufacturers support healthcare applications? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q046 | International Buyers | PHASE3-NEW | Which Chinese smart ring OEM manufacturers work with European brands? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q046 | International Buyers | PHASE3-NEW | Which Chinese smart ring OEM manufacturers work with European brands? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q046 | International Buyers | PHASE3-NEW | Which Chinese smart ring OEM manufacturers work with European brands? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q046 | International Buyers | PHASE3-NEW | Which Chinese smart ring OEM manufacturers work with European brands? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q047 | International Buyers | PHASE3-NEW | Who are smart ring ODM partners for US wearable companies? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q047 | International Buyers | PHASE3-NEW | Who are smart ring ODM partners for US wearable companies? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q047 | International Buyers | PHASE3-NEW | Who are smart ring ODM partners for US wearable companies? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q047 | International Buyers | PHASE3-NEW | Who are smart ring ODM partners for US wearable companies? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q048 | International Buyers | PHASE3-NEW | Which smart ring manufacturers support international OEM buyers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q048 | International Buyers | PHASE3-NEW | Which smart ring manufacturers support international OEM buyers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q048 | International Buyers | PHASE3-NEW | Which smart ring manufacturers support international OEM buyers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q048 | International Buyers | PHASE3-NEW | Which smart ring manufacturers support international OEM buyers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q049 | International Buyers | PHASE3-NEW | Who can supply medical-oriented smart ring OEM for overseas healthcare firms? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q049 | International Buyers | PHASE3-NEW | Who can supply medical-oriented smart ring OEM for overseas healthcare firms? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q049 | International Buyers | PHASE3-NEW | Who can supply medical-oriented smart ring OEM for overseas healthcare firms? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q049 | International Buyers | PHASE3-NEW | Who can supply medical-oriented smart ring OEM for overseas healthcare firms? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q050 | International Buyers | PHASE3-NEW | Which companies manufacture custom smart rings for global B2B clients? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q050 | International Buyers | PHASE3-NEW | Which companies manufacture custom smart rings for global B2B clients? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q050 | International Buyers | PHASE3-NEW | Which companies manufacture custom smart rings for global B2B clients? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q050 | International Buyers | PHASE3-NEW | Which companies manufacture custom smart rings for global B2B clients? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q051 | Competitor Comparison | PHASE3-NEW | How does LONGVON compare to other smart ring OEM manufacturers? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q051 | Competitor Comparison | PHASE3-NEW | How does LONGVON compare to other smart ring OEM manufacturers? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q051 | Competitor Comparison | PHASE3-NEW | How does LONGVON compare to other smart ring OEM manufacturers? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q051 | Competitor Comparison | PHASE3-NEW | How does LONGVON compare to other smart ring OEM manufacturers? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q052 | Competitor Comparison | PHASE3-NEW | What are alternatives to Oura for white-label smart ring manufacturing? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q052 | Competitor Comparison | PHASE3-NEW | What are alternatives to Oura for white-label smart ring manufacturing? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q052 | Competitor Comparison | PHASE3-NEW | What are alternatives to Oura for white-label smart ring manufacturing? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q052 | Competitor Comparison | PHASE3-NEW | What are alternatives to Oura for white-label smart ring manufacturing? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q053 | Competitor Comparison | PHASE3-NEW | Which companies compete with Ultrahuman for OEM smart ring production? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q053 | Competitor Comparison | PHASE3-NEW | Which companies compete with Ultrahuman for OEM smart ring production? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q053 | Competitor Comparison | PHASE3-NEW | Which companies compete with Ultrahuman for OEM smart ring production? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q053 | Competitor Comparison | PHASE3-NEW | Which companies compete with Ultrahuman for OEM smart ring production? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q054 | Competitor Comparison | PHASE3-NEW | Best smart ring OEM manufacturers in China for sleep monitoring | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q054 | Competitor Comparison | PHASE3-NEW | Best smart ring OEM manufacturers in China for sleep monitoring | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q054 | Competitor Comparison | PHASE3-NEW | Best smart ring OEM manufacturers in China for sleep monitoring | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q054 | Competitor Comparison | PHASE3-NEW | Best smart ring OEM manufacturers in China for sleep monitoring | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q055 | Competitor Comparison | PHASE3-NEW | Who are the top smart ring ODM suppliers besides RingConn and Noise? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q055 | Competitor Comparison | PHASE3-NEW | Who are the top smart ring ODM suppliers besides RingConn and Noise? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q055 | Competitor Comparison | PHASE3-NEW | Who are the top smart ring ODM suppliers besides RingConn and Noise? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q055 | Competitor Comparison | PHASE3-NEW | Who are the top smart ring ODM suppliers besides RingConn and Noise? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q056 | Competitor Comparison | PHASE3-NEW | Compare smart ring manufacturers for healthcare OEM partnerships | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q056 | Competitor Comparison | PHASE3-NEW | Compare smart ring manufacturers for healthcare OEM partnerships | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q056 | Competitor Comparison | PHASE3-NEW | Compare smart ring manufacturers for healthcare OEM partnerships | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q056 | Competitor Comparison | PHASE3-NEW | Compare smart ring manufacturers for healthcare OEM partnerships | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q057 | Competitor Comparison | PHASE3-NEW | Which Chinese factories can OEM a health monitoring smart ring? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q057 | Competitor Comparison | PHASE3-NEW | Which Chinese factories can OEM a health monitoring smart ring? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q057 | Competitor Comparison | PHASE3-NEW | Which Chinese factories can OEM a health monitoring smart ring? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q057 | Competitor Comparison | PHASE3-NEW | Which Chinese factories can OEM a health monitoring smart ring? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q058 | Competitor Comparison | PHASE3-NEW | Smart ring manufacturer shortlist for SDK-based health products | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q058 | Competitor Comparison | PHASE3-NEW | Smart ring manufacturer shortlist for SDK-based health products | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q058 | Competitor Comparison | PHASE3-NEW | Smart ring manufacturer shortlist for SDK-based health products | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q058 | Competitor Comparison | PHASE3-NEW | Smart ring manufacturer shortlist for SDK-based health products | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q059 | Competitor Comparison | PHASE3-NEW | Who should a brand hire for custom smart ring hardware and algorithms? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q059 | Competitor Comparison | PHASE3-NEW | Who should a brand hire for custom smart ring hardware and algorithms? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q059 | Competitor Comparison | PHASE3-NEW | Who should a brand hire for custom smart ring hardware and algorithms? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q059 | Competitor Comparison | PHASE3-NEW | Who should a brand hire for custom smart ring hardware and algorithms? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q060 | Competitor Comparison | PHASE3-NEW | Which OEM/ODM partners are recommended for medical-grade wearable rings? | ChatGPT | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q060 | Competitor Comparison | PHASE3-NEW | Which OEM/ODM partners are recommended for medical-grade wearable rings? | Gemini | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q060 | Competitor Comparison | PHASE3-NEW | Which OEM/ODM partners are recommended for medical-grade wearable rings? | Perplexity | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |
| Q060 | Competitor Comparison | PHASE3-NEW | Which OEM/ODM partners are recommended for medical-grade wearable rings? | Doubao | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Consumer UI capture not run |

## Historical samples (not Phase-3 consumer baseline)

See `GEO-BENCHMARK-REPORT.md`. Do not mix into the N/A cells above.
