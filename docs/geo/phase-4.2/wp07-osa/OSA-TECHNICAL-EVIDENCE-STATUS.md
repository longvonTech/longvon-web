# OSA Technical Evidence Status — WP07-DECISION-001-D

Statuses: `VERIFIED` · `PARTIALLY_VERIFIED` · `NOT_VERIFIED` · `OWNER_CONFIRMATION_REQUIRED`

| Item | Status | Decision handling |
|---|---|---|
| Multi-wavelength PPG (generic) | **VERIFIED** | Publish generic only |
| Exact nm 525/630/880 | **OWNER_CONFIRMATION_REQUIRED** / **NOT_VERIFIED** in repo | **D-03:** do not publish specific nm (pages comply) |
| 100Hz PPG partner pathway | **PARTIALLY_VERIFIED** | **D-04:** cautious wording retained; missing fields below |
| 100Hz — sampling rate claim | **PARTIALLY_VERIFIED** (partner soft) | No invented buffer/protocol |
| 100Hz — data types / channels / format | **OWNER_CONFIRMATION_REQUIRED** | Marked pending in one-pager gap |
| 100Hz — license / SOW scope | **OWNER_CONFIRMATION_REQUIRED** | Project-scoped language only |
| Cloud algorithm dependency | **VERIFIED** (boundary disclosed) | Keep disclosed |
| SpO₂ monitoring metrics | **VERIFIED** (published names) | Non-diagnostic |
| ODI metric name | **PARTIALLY_VERIFIED** | **D-05:** no unconfirmed formula published |
| AHI metric name | **PARTIALLY_VERIFIED** | **D-06:** monitoring/research only; not PSG-equivalent |
| Respiratory event taxonomy | **NOT_VERIFIED** | No invented classes |
| OSA risk / 初筛 labels | **PARTIALLY_VERIFIED** | Non-diagnostic |
| PSG clinical validation | **NOT_VERIFIED** | **D-07:** `NO CLINICAL VALIDATION EVIDENCE PROVIDED` |
| STOP-BANG questionnaire UX | **VERIFIED** as separate web tool | **D-09:** not on OSA B2B page |
| Ring1 registration | **OWNER_CONFIRMATION_REQUIRED** | **D-08:** no public status claim |
| Ring1C not medical device | **VERIFIED** | Mandatory |

### D-04 100Hz technical note (evidence-bounded)

| Field | Public status |
|---|---|
| Sampling rate | Discussed as **100Hz PPG raw data pathways** for qualified OEM/ODM partners |
| Data types / channels / wire format | **OWNER_CONFIRMATION_REQUIRED** — not in public repo |
| SDK availability | Project-scoped partner SDK; **no** public download |
| Authorization | Under OEM/ODM or technology partnership SOW |
| Cloud dependency | Many health metrics via LONGVON cloud; on-device vs cloud per project |

### Clinical line
**NO CLINICAL VALIDATION EVIDENCE PROVIDED** in repository for PSG comparison, sensitivity/specificity, or sample sizes.
