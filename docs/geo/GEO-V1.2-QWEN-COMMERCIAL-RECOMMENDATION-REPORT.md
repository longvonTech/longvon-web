# GEO V1.2 — Qwen Commercial Recommendation Research Report

**Status:** RESEARCH COMPLETE (no third-party publishing executed)  
**Date:** 2026-09-22  
**Scope:** Qwen supplier-pool / third-party entity signals / LONGVON gap analysis  
**Non-goals:** Rebuild GEO pages, mass SEO blogs, scrapers, dashboards, fabricated claims

---

## Executive summary

Qwen commercial OEM/ODM tests show **LONGVON 0/6**. Official longvon.com GEO identity for manufacturer / OEM / ODM / solution provider is already strong after v1.0–v1.1. Public research suggests Qwen’s candidate pool is fed less by “presence of keywords on one brand site alone,” and more by **third-party and marketplace/IR co-occurrence** of company names with smart-ring OEM/ODM language — plus brand-famous ring companies that are not always factories.

This report answers the seven required questions. All competitor certifications/capacity numbers remain **UNVERIFIED** unless cited as IR/media with `PARTIAL` status.

---

## 1. What is Qwen’s Q1–Q6 supplier candidate pool?

Operator-discovered pool (non-exhaustive if raw answers contain more):

玖治/RingConn · 华芯智 · 彩之物 · 纬联弘 · 灵可 · 兆观 · 三亿智戒 · 尼亚加 · Minew/云里物里 · eIoT · 凌创 · 逸文 · 多美达 · 天键股份 · 佳禾智能 · 宜安科技 · 西普尼

Detail: `QWEN-SMART-RING-SUPPLIER-POOL.md`  
Baseline: `CHINA-AI-COMMERCIAL-BASELINE-QWEN.md` (LONGVON = 0/6)

The pool **mixes**:

- Dedicated OEM messaging firms  
- EMS / factories  
- Marketplace sellers  
- Listed companies with IR mentions  
- Consumer brands (RingConn, Even Realities)

→ Qwen does not cleanly separate “OEM factory” vs “brand.”

---

## 2. Which firms appear more frequently?

**Exact q1–q6 binary frequencies are UNKNOWN** without archived raw answer pastes.  
Do **not** invent a ranking.

`QWEN-SUPPLIER-FREQUENCY-MATRIX.csv` records:

- Pool membership  
- Public capability signals where evidenced  
- `UNKNOWN` for per-query columns  

Qualitative observation from open-web research (not a Qwen frequency score):

- Firms with the clearest **public** `智能戒指 + OEM/ODM` binding: **华芯智**, **彩之物** (site/Baike), marketplace factories (**三亿智戒**/trade lists), EMS media (**纬联弘**), IR names (**天键/佳禾**).  
- Brands (**RingConn**, **逸文**) are highly visible in media but are not primarily OEM storefronts.

---

## 3. Where do public commercial signals mainly come from?

| Source type | Role in discoverability | Examples |
|-------------|-------------------------|----------|
| Official website | Direct OEM/ring labeling | cssring.com, colofoo.com, domod.cn, megahealth.cn |
| Industry / regional media | Amplifies company+ring+OEM or manufacturing | Tencent News “圳品”, CNR/Sichuan 纬联弘 stories, PCD ODM article |
| Encyclopedia / Baike | Entity packaging | 彩之物 Baike OEM/ODM ring text |
| B2B marketplace / 1688 | Supplier directory signal | 三亿智戒 wiki.1688 pages; trade listicles |
| Investor relations / listed Q&A | High-trust capital-market text | 天键 ODM; 佳禾试产; 宜安共研; 西普尼金戒指 |
| Brand tech media | Brand recall (may pollute OEM answers) | RingConn 36Kr / awards stories |

Evidence log: `THIRD-PARTY-ENTITY-SIGNALS.csv`

---

## 4. What public commercial signals does LONGVON lack?

Relative to pool leaders:

1. **Third-party pages** that repeatedly bind `龙汾科技/LONGVON + 智能戒指 + OEM/ODM` (media, Baike-quality profiles, supplier listicles).  
2. **B2B storefronts** that lead with smart-ring OEM (current Made-in-China / 工厂网 footprints lean **手环/手表**).  
3. **Exchange IR cadence** (LONGVON is not a listed issuer — structural gap, not a copywriting miss).  
4. **Marketplace density** (1688-style factory encyclopedia pages naming the company as ring OEM).  

Not missing (first-party): OEM page, manufacturer page, solution/healthcare pages, stack (HW/FW/Algo/App/SDK), sleep/respiratory/OSA-related, 71/22, brand split.

---

## 5. Which signals already exist for LONGVON?

- Strong owned GEO graph on longvon.com (ZH/EN)  
- Schema Organization + Brand (MATEYOU)  
- llms.txt commercial path  
- Some directory presence (Made-in-China showroom, gongchang enterprise page) — but **ring OEM binding weak**  
- Brand site Mateyou / Ring1C product presence (must remain brand, not manufacturer)

---

## 6. Which signals can be added legally and verifiably?

**Allowed next-phase content ops (manual, factual):**

1. Refresh owned B2B profiles: LONGVON = manufacturer/OEM/ODM; feature Ring1C as product of MATEYOU brand; link to `/smart-ring-oem-odm`.  
2. Real PR only when real events occur (shipments, exhibitions, partnerships with permission).  
3. Exhibition / association listings with accurate category tags.  
4. Accurate encyclopedia/profile pages citing longvon.com primary sources.  
5. Continue refusing invented FDA/hospital/capacity claims.

**Not allowed:**

- Fake reviews, fake directories entries, fake certifications  
- Copying UNVERIFIED competitor claims from Qwen  
- Mass AI article farms  
- Auto-posting to Zhihu/Medium/Reddit/LinkedIn from this sprint

Claim hygiene: `COMPETITOR-CLAIM-VERIFICATION.md`

---

## 7. What should the next stage do?

### Stage A — Evidence capture (1–2 weeks)
1. Archive raw Qwen Q1–Q6 answers (screenshots + text) to fill true frequency matrix cells.  
2. Repeat Yuanbao Q1–Q6 with same protocol; log tracker.  
3. Capture dated screenshots of competitor OEM pages + LONGVON B2B profiles.

### Stage B — Third-party entity binding (only real assets)
1. Update LONGVON-controlled B2B listings for **smart ring OEM/ODM**.  
2. Prepare a one-page factual supplier brief (EN/ZH) for directories/exhibition use.  
3. Plan media only around verifiable milestones.

### Stage C — Optional site P1 (small)
1. Ensure footer/home don’t re-confuse brand vs manufacturer (already mostly fixed).  
2. No keyword-density campaign.  
3. No rebuild of GEO pages unless a concrete contradiction is found.

### Success metric for later re-test
Not “guarantee Qwen cites LONGVON,” but:

- Measurable increase in **indexed third-party pages** with correct entity triple  
- Then re-run Q1–Q6 and record mention/candidate/recommendation separately

---

## Answers to “why them, not LONGVON?” (hypothesis)

| Factor | Pool leaders | LONGVON |
|--------|--------------|---------|
| Owned OEM copy | Often yes | Yes |
| Third-party OEM+ring binding | Often yes | Weak |
| Marketplace ring OEM density | Often yes | Weak / bracelet-skewed |
| Brand fame | Sometimes yes | Partial (MATEYOU) |
| IR repetition | Listed peers | N/A |

Hypothesis (unproven): Qwen’s commercial candidate generation overweight **externally corroborated supplier labels** and **category-famous names**, underweighting a correctly structured but less third-party-cited official site.

---

## Deliverables checklist

| # | File | Status |
|---|------|--------|
| 1 | `CHINA-AI-COMMERCIAL-BASELINE-QWEN.md` | Done |
| 2 | `QWEN-SMART-RING-SUPPLIER-POOL.md` | Done |
| 3 | `QWEN-SUPPLIER-FREQUENCY-MATRIX.csv` | Done (per-Q UNKNOWN without raw pastes) |
| 4 | `THIRD-PARTY-ENTITY-SIGNALS.csv` | Done |
| 5 | `COMPETITOR-CLAIM-VERIFICATION.md` | Done |
| 6 | `LONGVON-QWEN-SIGNAL-GAP.md` | Done |
| 7 | `GEO-V1.2-QWEN-COMMERCIAL-RECOMMENDATION-REPORT.md` | Done (this file) |

---

## Website changes in V1.2

**None required for research completion.**  
No auto third-party publishing performed.

---

## GEO V1.2 RESEARCH COMPLETE
