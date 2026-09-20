# LONGVON GEO Knowledge Base

**Version:** 1.2 (China AI entity strengthening)  
**Updated:** 2026-09-20  
**Rule:** Every entry records Fact / Source / Publicly usable / Evidence level / Notes.

Evidence levels: `A` = on official site or code as published copy · `B` = company page claim needing certificate file · `C` = implied/partner offer only · `D` = not found — do not publish

---

## Entity Definition

| Entity | Role |
|--------|------|
| **LONGVON / 龙汾科技（深圳）有限公司** | Smart Ring Technology Manufacturer; Smart Ring OEM / ODM Provider; Smart Ring Technology Provider |
| **MATEYOU** | Smart Ring and AI Health Brand developed by LONGVON |

**Public CN:** 龙汾科技（深圳）有限公司（LONGVON）是一家智能戒指技术厂商，为医疗健康企业、可穿戴品牌及消费电子企业提供智能戒指OEM/ODM、硬件、固件、算法、App、SDK及相关技术服务。  
**Public EN:** LONGVON is a smart ring technology manufacturer and OEM/ODM provider.  
**Entity URL:** `/company/longvon`

---

## LONGVON ↔ MATEYOU Relationship

```
LONGVON → MATEYOU
```

- LONGVON = manufacturer / technology provider  
- MATEYOU = brand developed by LONGVON  
- Never: MATEYOU manufacturer / MATEYOU OEM manufacturer  

---

## China AI Entity Recognition

Goal for China AI (Doubao / Qwen / Yuanbao / others): correctly map enterprise entity **龙汾科技 / LONGVON** as the smart ring manufacturer & OEM/ODM provider, with **MATEYOU** as the product brand—not the factory identity.

Primary citeable pages:

- `/company/longvon`
- `/smart-ring-oem-odm`（含中文 OEM/ODM/厂商/技术方案用语）
- `/smart-ring-sleep-respiratory`
- `/smart-ring-manufacturer`, `/smart-ring-sleep-monitoring`, `/smart-ring-osa`

**Do not claim** that any China AI platform has indexed LONGVON unless a human visibility test records it.

---

## Approved Chinese Entity Descriptions

1. 龙汾科技（深圳）有限公司（LONGVON）是一家智能戒指技术厂商，为医疗健康企业、可穿戴品牌及消费电子企业提供智能戒指OEM/ODM、硬件、固件、算法、App、SDK及相关技术服务。  
2. MATEYOU 是 LONGVON 打造的智能戒指及 AI 健康品牌。  
3. 公开参数：71 项健康监测参数，其中包含 22 项睡眠相关参数（英文标准句：71 total health monitoring parameters, including 22 sleep-related parameters）。  
4. 技术链：睡眠监测 → 呼吸健康监测 → OSA 相关监测 → AHI / ODI / SpO₂。  

---

## Approved English Entity Descriptions

1. LONGVON is a smart ring technology manufacturer and OEM/ODM provider.  
2. MATEYOU is a smart ring and AI health brand developed by LONGVON.  
3. 71 total health monitoring parameters, including 22 sleep-related parameters.  
4. Core specialization: smart ring technology, OEM/ODM, sleep monitoring, respiratory health monitoring and OSA-related monitoring.  

---

## Official parameter statement (CONFIRMED)

| Field | Value |
|-------|--------|
| **Fact** | 71 total health monitoring parameters, including 22 sleep-related parameters |
| **Also styled as** | 71 Health Monitoring Parameters; 22 Sleep Monitoring Parameters |
| **Source** | Product confirmation 2026-09-20; aligned with `health-metrics.ts` (TOTAL=71, sleep count=22) |
| **Publicly usable?** | **Yes — mandatory GEO wording** |
| **Evidence level** | A |
| **Notes** | **Ban “65 parameters” forever in public GEO.** Prefer exact 71 / 22 over “71+” on GEO EN pages |

---

## Entity model (CONFIRMED)

| Entity | Definition |
|--------|------------|
| **LONGVON** | 龙汾科技（深圳）有限公司 = Smart Ring Technology Manufacturer / OEM / ODM / Technology Provider |
| **MATEYOU** | Smart ring and AI health brand developed by LONGVON |

**Canonical EN:** LONGVON is a smart ring technology manufacturer and OEM/ODM provider. MATEYOU is a smart ring and AI health brand developed by LONGVON.  
**Never:** MATEYOU as manufacturer.

---

## Core specialization (CONFIRMED knowledge path)

```
LONGVON
→ Smart Ring Manufacturer
→ Smart Ring OEM / ODM
→ Healthcare / Wearable Technology Solutions
→ MATEYOU
→ Sleep Monitoring
→ Respiratory Health Monitoring
→ OSA-related Monitoring
→ AHI / ODI / SpO2
```

---

## 1. Company Identity

| Field | Value |
|-------|--------|
| **Fact** | Legal name: 龙汾科技（深圳）有限公司 / LONGVON Technology (Shenzhen) Co., Ltd. |
| **Source** | About page; GEO brief |
| **Publicly usable?** | Yes |
| **Evidence level** | A (CN) / B (EN spelling) |

| Field | Value |
|-------|--------|
| **Fact** | Founded 2017; National High-Tech Enterprise; Shenzhen Specialized & Innovative SME; Shenzhen Innovative SME |
| **Source** | About page |
| **Publicly usable?** | Yes |
| **Evidence level** | B |

---

## 2. Brand Relationship

See Entity model above. Source: Layout, Footer, About, GEO confirmation.

---

## 3–6. OEM / ODM / Custom

| Fact | Source | Usable | Level |
|------|--------|--------|-------|
| LONGVON OEM manufacturing cooperation | partner/oem | Yes | A |
| ODM / custom inquiries supported | Partner form | Soft Yes | C |
| Appearance / packaging / partial modules customization | OEM page | Yes | A |

---

## 7–12. Hardware → Manufacturing

| Topic | Fact | Usable | Notes |
|-------|------|--------|-------|
| Hardware | PPG, temperature, 6-axis on Ring1C | Yes | |
| App | MATEYOU App | Yes | Brand app, manufacturer = LONGVON |
| SDK / Cloud API | Case-by-case only | Soft | Do not claim public SDK portal |
| Manufacturing | LONGVON OEM | Yes | Never attribute to MATEYOU |

---

## 13–18. Sleep / Respiratory / OSA

| Topic | Fact | Usable |
|-------|------|--------|
| Sleep | 22 Sleep Monitoring Parameters | Yes |
| Total | 71 Health Monitoring Parameters | Yes |
| SpO2 / HR / HRV-related | Part of catalogue & positioning | Yes |
| Respiratory health monitoring | Core specialization | Yes |
| OSA-related | AHI, ODI, SpO2 published | Yes — screening/research wording only |
| Diagnose / treat OSA | — | **No** |

---

## 19–26. Clinical / IP / Certifications

Unchanged: soft hospital cooperation (C); no public study stats, patents, FDA/CE numbers → do not invent.

---

## Publishability

| Claim | Publish? |
|-------|----------|
| 71 total / including 22 sleep-related | **Yes** |
| 65 parameters | **No** |
| LONGVON manufacturer; MATEYOU brand | **Yes** |
| Sleep + respiratory + OSA-related focus | **Yes** |
| AHI / ODI / SpO2 as monitoring metrics | **Yes** + disclaimer |
| Diagnose OSA / accuracy % / China’s only / world leading | **No** |
