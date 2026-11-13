# OSA Medical Claims Final Review — WP07-DECISION-001 (D-01)

## Owner choice
**D-01 = A:** Retain **medical-oriented**; add clear disclaimer; do **not** elevate medical-grade into H1.

## Placement
- EN: `apps/web/app/en/osa-smart-ring-technology/page.tsx` — `<aside>` immediately after positioning paragraphs, before H2 §1.
- ZH: `apps/web/app/osa-smart-ring-technology/page.tsx` — same structural placement.
- Visual: bordered notice with left accent (not footer fine print); `aria-label` for accessibility.

## Full EN disclaimer (as implemented)
**Title:** Important notice — regulatory & clinical boundaries  

“Medical-oriented” describes LONGVON’s engineering and quality direction for smart ring programs. It does **not** mean that Ring1C—or any product described on this page—is an approved medical device, or that LONGVON holds FDA, CE Medical Device, NMPA, or other product clearances unless certificates are separately on file.

**Ring1C is a consumer electronics / health-monitoring reference product, not a medical device.** OSA-related outputs (including AHI, ODI, SpO₂ statistics, and OSA screening labels) are for health reference or research contexts only — not medical diagnosis, treatment, or a substitute for polysomnography (PSG). Any questionnaire-based risk tools elsewhere on this site are separate from ring algorithms and are **not** clinical validation of those algorithms.

## Full ZH disclaimer (as implemented)
**标题：** 重要说明 — 监管与临床边界  

「医疗向 / medical-oriented」描述的是 LONGVON 在智能戒指项目上的工程与质量取向，**不**表示 Ring1C 或本页所述任何产品已获医疗器械批准，也不表示 LONGVON 已取得 FDA、CE 医疗器械或 NMPA 等相关产品批准或认证。具体产品的监管状态应以适用市场的正式监管文件为准。

**Ring1C 是消费电子 / 健康监测参考产品，不是医疗器械。** OSA 相关输出（包括 AHI、ODI、SpO₂ 统计与 OSA 初筛标签）仅供健康参考或研究场景使用 — 不构成医学诊断、治疗，也不替代多导睡眠监测（PSG）。本站其他问卷类风险评估工具（如有）与戒指算法相互独立，**不**构成对戒指算法的临床验证。

**WP07-FINAL-001-A:** ZH sentence above updated for clarity; EN disclaimer unchanged (no substantive error found). Meaning remains aligned: no implied FDA/CE/NMPA product approvals without formal market documentation.

## Checklist vs owner rules

| Rule | Status |
|---|---|
| Keep medical-oriented | **PASS** |
| No medical-grade H1 | **PASS** (H1 remains Technology & OEM/ODM) |
| Ring1C not medical device | **PASS** |
| No invented FDA/CE/NMPA | **PASS** |
| OSA screening ≠ diagnosis | **PASS** |
| AHI ≠ PSG | **PASS** |
| STOP-BANG ≠ ring clinical validation | **PASS** (stated; tool not shown on page) |

## Verdict
**PASS** for D-01 implementation on branch tip after this commit. Production publish still requires owner release approval (D-02).
