# LONGVON 采购证据库（B2B 统一口径）

| 项 | 内容 |
|---|---|
| 用途 | 外发、销售、GEO、企微转发的**唯一事实源**；禁止另写冲突口径 |
| 更新日期 | 2026-10-31 |
| 原则 | 只写可核验事实；未知留空；不编客户名单、不编排名、不医疗承诺 |

---

## 1. 公司身份

| 字段 | 标准表述（ZH） | 标准表述（EN） | 证据位 |
|---|---|---|---|
| 法定主体 | 龙汾科技（深圳）有限公司 | LONGVON Technology (Shenzhen) Co., Ltd. | 营业执照 / 公司页 |
| 品牌关系 | LONGVON = 制造商与技术方案提供商；MATEYOU = 智能健康产品品牌 | LONGVON = manufacturer & OEM/ODM provider；MATEYOU = product brand | `/company/longvon` · `/en/company/longvon` |
| 定位一句 | 智能戒指制造商及 OEM/ODM 技术方案提供商 | Smart ring technology manufacturer and OEM/ODM provider | 站内实体句 |
| 官网 | https://www.longvon.com | 同左 | — |
| 差异化 | 不是单纯工厂，而是 Technology + OEM/ODM + Manufacturing | Not a pure contract factory — Technology + OEM/ODM + Manufacturing | 能力链 |

**禁止：** 自称「全球第一」「唯一」「医疗器械已取证可诊断」等无证据句。

---

## 2. 产品与参考机

| 字段 | 口径 | 注意 |
|---|---|---|
| Ring1C | 技术能力参考产品 / 消费级健康监测 | **非医疗器械诊断设备** |
| 健康参数公开口径 | 71 项健康监测参数，含 22 项睡眠相关参数 | 结果仅供健康参考，不构成医学诊断 |
| OSA 相关 | 「OSA 相关监测/筛查技术」 | 不诊断、不治疗、不替代 PSG |

---

## 3. 技术能力链（采购方检查清单）

可对外承诺「按项目范围讨论」的能力：

1. 硬件开发 / 传感器集成  
2. 固件开发  
3. 健康算法（项目范围）  
4. 移动 App  
5. SDK（合作伙伴按需开通）  
6. 云端 API / 数据接入（按项目沟通）  
7. OEM 制造  
8. ODM / 定制开发  
9. 白标 / 品牌定制沟通  
10. 生产制造与整机组装、量产交付沟通  

**能力链一句话：** 硬件 → 固件 → 健康算法 → 移动 App → SDK → 云端 API → 生产制造  

**SDK/API 边界：** 无公开自助门户；开通与对接按合作项目。

---

## 4. 制造与质量（可引用）

| 项 | 公开口径 | 详情页 |
|---|---|---|
| 洁净与环境 | Class 100,000 洁净室；温湿度控制 | EN/CN company trust |
| 质量体系取向 | ISO 13485–oriented / aligned practices | 同上（表述保持「取向/实践」，勿夸成已获证清单除非另有证书扫描件入库） |
| 产线隔离 | 医疗向与消费线物理隔离（按公司页证据） | 同上 |
| 资质 | 国家高新技术企业等（以公司页展示为准） | `/en/company/longvon#company-trust-heading` |

销售转发首选链接：  
`https://www.longvon.com/en/company/longvon#company-trust-heading`

---

## 5. 合作路径（商务）

| 模式 | 含义 |
|---|---|
| Standard OEM | 既有平台上的品牌/包装/项目级调整 |
| Small-batch / Evaluation | 样品、市场测试、技术评估 |
| Custom OEM/ODM | 硬件/固件/算法/App/SDK 等项目级定制 |
| End-to-end | 需求到量产讨论 |

**NPI（EN 采购常用）：** Intake & NDA → DFM → EVT → DVT → PVT → MP  

**公开站不公布：** 固定 MOQ、价目表、标准交期天数。一律 RFQ 后确认。

---

## 6. 买家类型（写进外发时用）

智能硬件 / 消费电子 / 可穿戴品牌；数字健康；医疗健康 / Digital Health；睡眠与呼吸健康项目；科研与产品验证；希望推出自有智能戒指品牌的企业。

---

## 7. 第三方证据登记（活页）

| 渠道 | URL | utm_campaign | 状态 | 日期 |
|---|---|---|---|---|
| 知乎·信任文 | https://zhuanlan.zhihu.com/p/2098191017249858038 | （历史；新链必须带 campaign） | PUBLISHED | 2026-10-26 |
| CSDN | （待发） | `csdn_oem_trust_202611` | DRAFT | — |
| 知乎·采购决策文 C5 | https://zhuanlan.zhihu.com/p/2100313917654315140 | `zhihu_oem_trust_202611` | PUBLISHED | 2026-11-01 |
| Wikidata | （评估中，非本期 KPI） | — | ASSESS | — |
| 目录纠错 | wulu → crm@huoge.com ；fwol → szggy@tom.com（2026-11-02 15:25，general@longvon.com） | `directory_correction_202611` | SENT | 2026-11-02 |
| EN 免费渠道文 | （草稿） | `linkedin_oem_evidence_202611` 或 `en_free_oem_202611` | DRAFT | — |

---

## 8. 口径冲突处理

1. 以本库 + 线上公司页为准。  
2. 外发前对照本节 1–5；冲突则改外发，不改口头夸大。  
3. 新增证书/客户案例须先入库再外发。
