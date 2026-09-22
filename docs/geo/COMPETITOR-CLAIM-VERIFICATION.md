# Competitor Claim Verification (from Qwen-style outputs)

**Rule:** Anything appearing only inside an AI answer is a **claim**, not a fact.  
**Statuses:** `VERIFIED` | `UNVERIFIED` | `PARTIAL` | `CONTRADICTED`  
**Do not** copy UNVERIFIED claims onto LONGVON pages.

---

## Method

1. Extract high-risk claims typically seen in Qwen supplier answers (capacity, medical certifications, rankings, clinical studies).  
2. Search for independent public sources.  
3. If no reliable source → `UNVERIFIED`.

---

## Claim register

| Qwen_claim (example class) | Typical attributed firm | source_found | source_type | verified | verification_url | notes |
|----------------------------|-------------------------|--------------|-------------|----------|------------------|-------|
| FDA / CE / FCC / RoHS / SRRC passed for smart ring | 华芯智 | PARTIAL | official_website | UNVERIFIED | https://www.cssring.com/ | Site asserts certifications; independent certificate documents not verified in this pass |
| Near-100-person R&D team / 20–30 products/year | 华芯智 | PARTIAL | official_about | UNVERIFIED | https://www.cssring.com/p-about.html | Self-reported |
| Southern Medical University joint R&D (TCM ring) | 华芯智 | PARTIAL | industry_media | UNVERIFIED | https://www.pcd.com.cn/smart/202605/133629.html | Media claim; no primary university confirmation checked |
| 99%+ manufacturing yield | 灵可 | NO | trade_content | UNVERIFIED | Toutiao listicle | Classic AI/trade inflation pattern |
| Daily capacity 27,000 / monthly 300,000 | Various | NO | — | UNVERIFIED | — | Do not adopt without factory docs |
| Coverage in 190+ countries | 玖治/RingConn | PARTIAL | brand/media | UNVERIFIED | Tencent News / brand materials | Marketing reach claim; not audited |
| Clinical OSA accuracy ~90.7% | RingConn Gen2 | PARTIAL | brand_site | UNVERIFIED | ringconncn.com about | Brand claim; not adopted for LONGVON |
| ISO13485 / Class II device registration | Various | NO | — | UNVERIFIED | — | Never copy to LONGVON without registration proof |
| 2000 PSG cases / clinical validation | Various | NO | — | UNVERIFIED | — | Medical claim — blocked for LONGVON public GEO |
| Smart ring ODM capability | 天键股份 | YES | ir_media | PARTIAL | https://www.gelonghui.com/live/2676854 | Company IR reply affirms ODM + mass production; scale still “small” |
| Smart ring developed + trial production | 佳禾智能 | YES | ir_media | PARTIAL | Tencent/NBD IR Q&A | Confirms development/trial; not full OEM brochure |
| Co-developed smart ring listed in US | 宜安科技 | YES | ir_media | PARTIAL | NBD 2024-09-01 | Parts/co-dev role; foreign partner unnamed |
| ZenRing first batch >7000 | 纬联弘 | YES | industry_media | PARTIAL | CNR / Sichuan media | Media-reported production milestone |
| Full mold→SMT→assembly closed loop | 纬联弘 | YES | industry_media | PARTIAL | Same media cluster | Manufacturing capability narrative |
| Precious-metal smart ring ODM/OEM | 彩之物 | YES | baike/official | PARTIAL | Baike / colofoo | Public marketing identity; not audited factory audit |
| Global first pure-gold smart ring | 西普尼 | YES | company_announcement_media | PARTIAL | Gelonghui / Guandian | Product launch news; “first” claims remain marketing language |
| Minew smart ring OEM product line | Minew | NO | official_oem_page | UNVERIFIED | minewtech.com/services | OEM/ODM real for IoT; ring-specific line not confirmed |

---

## Guidance for LONGVON

Allowed public facts only from LONGVON evidence library (`LONGVON-GEO-KNOWLEDGE-BASE.md`, `EVIDENCE-MATRIX.md`, `geo-commercial.ts`):

- Manufacturer / OEM / ODM / solution provider identity  
- Hardware / firmware / algorithms / app / SDK / manufacturing (project-scoped)  
- 71 / 22 parameters  
- Sleep / respiratory / OSA-**related** monitoring; AHI / ODI / SpO₂  
- MATEYOU = brand  

Forbidden upgrades from competitor AI claims:

- Diagnosis / treatment / replace PSG  
- Unverified FDA/CE/NMPA  
- Invented capacity / yield / ranking / hospital lists  

---

## Next verification backlog (optional human)

1. Download / photograph certificate PDFs for any competitor certs before citing competitively.  
2. Archive IR Q&A screenshots for listed companies.  
3. Confirm 1688 storefront URLs for 三亿智戒 / 灵可 with dated captures.  
