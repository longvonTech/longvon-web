# LONGVON_OEM_ODM_CONVERSION_SPEC.md

Generated: 2026-11-10T13:00:47Z
Status: REVIEW

## Funnel
Visit → Manufacturer/OEM/SDK page → RFQ (`/en/partner/oem`) → Qualification → Sample → Quote → Order

## Four cooperation models
1. **Existing Product OEM** — brand/packaging/project adjustments on current platform
2. **Small Batch / Pilot** — samples, EVT/DVT-style evaluation
3. **Customized ODM** — hardware/firmware/algorithm/app customization
4. **Full Technology Solution** — end-to-end technology + manufacturing discussion

Map to live form `projectType` values where possible (OEM, ODM, Private Label, Technology Integration, Healthcare, Research/Pilot).

## Live form inheritance
Existing `OemRfqForm.tsx` already captures: name, company, email, phone, project type, product interest, stage, quantity bands, capabilities, market, timeline, message + G5 attribution.

## Gaps vs desired RFQ (do not silently change prod form)
- Country (explicit) — PARTIAL via market region
- Target retail price — **missing**
- Certification requirements — **missing**
- Explicit SDK/API requirement flag — PARTIAL via capabilities multi-select
Recommend: spec-only now; production form change needs separate approval.
