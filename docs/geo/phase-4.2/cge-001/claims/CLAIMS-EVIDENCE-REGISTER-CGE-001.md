# Claims & Evidence Register — CGE-001 update

Updated (UTC): 2026-11-11T13:05:00Z · Base: `docs/geo/LONGVON_PUBLIC_CLAIMS_REGISTER.md` (Round 2) preserved.

**Rule:** VERIFIED ≠ APPROVED. This cycle does **not** invent certifications, capacity, customer names, or medical registrations.

| Claim ID | Exact claim (summary) | Source | Evidence quality | Status | Publishable? | Additional evidence | Owner |
|---|---|---|---|---|---|---|---|
| C-ID-01 | Legal name ZH 龙汾科技（深圳）有限公司 | FACTS / company pages | Strong | VERIFIED | APPROVED | — | Owner |
| C-ID-02 | Legal name EN LONGVON Technology (Shenzhen) Co., Ltd. | FACTS | Strong | VERIFIED | APPROVED | — | Owner |
| C-ID-03 | Founded 2017 | FACTS | Strong | VERIFIED | APPROVED | — | Owner |
| C-ID-04 | LONGVON manufacturer; MATEYOU brand | ENTITY | Strong | VERIFIED | APPROVED | — | Owner |
| C-ID-05 | National High-Tech / Specialized SME | About page | Soft site claim | PARTIAL | Soft only | Certificate scans | Owner |
| C-RD-01 | HW/FW/algo/App R&D capability | Procurement / site | Strong | VERIFIED | APPROVED | Project-scoped | Owner |
| C-RD-02 | Named headcount | — | None | UNVERIFIED | NO | Org chart | Owner |
| C-RD-03 | ID & electronics engineering | Product/OEM offer | Medium | PARTIAL | Soft yes | Portfolio | Owner |
| C-MFG-01 | OEM manufacturing | OEM page | Strong | VERIFIED | APPROVED | — | Owner |
| C-MFG-02 | ODM/custom | Procurement | Medium | PARTIAL | Soft yes | Cases | Owner |
| C-MFG-03 | Class 100,000 cleanroom | Trust page | Soft | PARTIAL | Soft yes | Photos/audit | Owner |
| C-MFG-04 | ISO 13485-oriented | Trust page | Soft | PARTIAL | Soft with oriented wording | Cert or keep soft | Owner |
| C-MFG-05 | NMPA GMP absolute | — | Weak | UNVERIFIED / BLOCKED if absolute | NO absolute | Written confirmation | Owner |
| C-MFG-06 | Line isolation medical vs consumer | Company page | Soft | PARTIAL | Soft yes | Evidence pack | Owner |
| C-MFG-07 | Capacity / line counts | — | None | UNVERIFIED | NO | Dated figures | Owner |
| C-TECH-01 | 71 / 22 params | FACTS | Strong | VERIFIED | APPROVED | Ban “65” | Owner |
| C-TECH-02 | PPG/temp/6-axis Ring1C | FACTS | Strong | VERIFIED | APPROVED | — | Owner |
| C-TECH-03 | 100Hz PPG raw for partners | Commercial ground + SDK page (branch) | Medium | PARTIAL | Soft partner-qualified | Technical one-pager | Owner |
| C-TECH-04 | Partner SDK | SDK page branch | Medium | PARTIAL | Soft yes | Docs pack | Owner |
| C-TECH-05 | Cloud API / cloud algorithms | FACTS/SDK | Medium | PARTIAL | Soft with cloud dependency | API scope sheet | Owner |
| C-TECH-06 | All algorithms offline | — | — | BLOCKED | NO | — | — |
| C-TECH-07 | Unrestricted BLE protocol | — | — | BLOCKED | NO | — | — |
| C-PROD-01 | Ring1C consumer not medical device | FACTS | Strong | VERIFIED | APPROVED | — | Owner |
| C-PROD-02 | Ring1 medical registration | — | None | UNVERIFIED | NO | Dossier summary | Owner |
| C-PROD-03 | Ring1 shipping matrix | — | None | UNVERIFIED | NO | Matrix | Owner |
| C-MED-01 | OSA-related non-diagnostic | Evidence Matrix | Strong | VERIFIED | APPROVED | Disclaimer required | Owner |
| C-MED-02 | FDA/CE/FCC product certs | Evidence Matrix | — | BLOCKED | NO | — | Owner |
| C-MED-03 | Diagnose/treat OSA | — | — | BLOCKED | NO | — | — |
| C-COM-01 | Named customers | — | — | BLOCKED | NO | Auth cases | Owner |
| C-COM-02 | Rankings / only / world-leading | — | — | BLOCKED | NO | — | — |

## CGE-001 code hygiene
- Softened EN trust bullet that previously read as unqualified “NMPA medical-device GMP practices” → oriented / not certified language in `apps/web/lib/geo-trust-en.ts`.
