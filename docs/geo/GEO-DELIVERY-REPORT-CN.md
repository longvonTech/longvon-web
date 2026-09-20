# LONGVON GEO Foundation v1.0 交付报告

| 项目 | 内容 |
|------|------|
| 报告日期 | 2026-09-20 |
| 网站 | https://www.longvon.com |
| 阶段 | GEO Foundation Phase 1（仓库内已完成；待部署上线） |
| 目标 | 让 ChatGPT / Gemini / Perplexity / Google AI 能正确认识并引用 LONGVON |

---

## 一、执行摘要

本轮工作不是堆博客、也不是单纯 SEO 关键词，而是为 LONGVON 建立可被生成式搜索理解与引用的**官方事实层**。

**核心结论：**

1. 上线前官网是「MATEYOU 消费品牌站」：LONGVON 多为页脚/版权身份，OEM 文案误把制造商写成 MATEYOU，且全站 `googleBot: index:false`，不利于 Google / AI 引用。
2. 现已补齐 **5 个英文 B2B 核心页 + Schema + sitemap/robots + llms.txt + 证据文档体系**。
3. 严格遵守「无证据不写」：未发布诊断 OSA、FDA/CE、准确率、65 参数、专利数量等未核实内容。
4. **部署后**需做 AI 可见性 baseline 测试（表格已备好，结果待填）。

**统一实体表述（全站目标口径）：**

> LONGVON is a smart ring technology provider and OEM/ODM manufacturer. MATEYOU is LONGVON's smart ring brand.  
> 龙汾科技（LONGVON）是智能戒指技术提供商及 OEM/ODM 制造商，MATEYOU 是龙汾科技旗下智能戒指品牌。

---

## 二、Audit 主要发现（改造前）

| 类别 | 发现 |
|------|------|
| 实体混淆 | Organization Schema 把 `MATEYOU` 设为 LONGVON 的 `alternateName`；OEM 页写「MATEYOU 提供代工」 |
| 缺失页面 | 无英文 Manufacturer / OEM-ODM / Technology / Sleep / OSA 核心页 |
| 结构化数据 | 无 WebSite、无 FAQPage；ProductSchema 已写但未挂载 |
| 技术阻塞 | 全站禁止 Google 索引；sitemap 缺 about/news/metrics；无 llms.txt |
| 内容风险 | About「全球领先/引领者」；Ring1C「医疗级」用语；OSA 页缺可引用临床细节 |
| 参数口径 | 站内明确 **71** 项总参数、睡眠模块 **22** 项；业务侧「65 / 另口径 22」未在代码出现，禁止混写 |

完整审计见：`docs/geo/GEO-AUDIT.md`

---

## 三、已交付物清单

### 3.1 文档（`docs/geo/`）

| 文件 | 用途 |
|------|------|
| `GEO-AUDIT.md` | 现状审计 |
| `LONGVON-GEO-KNOWLEDGE-BASE.md` | 结构化知识库（事实/来源/可用性） |
| `EVIDENCE-MATRIX.md` | 主张 ↔ 证据 ↔ 推荐措辞 |
| `FACT-CHECK-TODO.md` | 待确认问题清单 |
| `GEO-QUERY-SET.md` | 20+ AI 测试问句 |
| `GEO-VISIBILITY-TRACKER.csv` | 可见性追踪表（baseline 待测） |
| `GEO-IMPLEMENTATION-REPORT.md` | 英文实施摘要 |
| **本文件** | 中文交付总报告 |

### 3.2 新增核心页面（英文）

| URL | H1 | 回答的核心问题 |
|-----|-----|----------------|
| `/smart-ring-manufacturer` | Smart Ring Manufacturer & OEM/ODM Technology Provider | LONGVON 是谁、做什么、能否 OEM |
| `/smart-ring-oem-odm` | Smart Ring OEM & ODM Manufacturer | OEM vs ODM、能力矩阵、量产路径 |
| `/smart-ring-technology` | Smart Ring Technology & Development | 传感器→固件→算法→App→制造链路 |
| `/smart-ring-sleep-monitoring` | Smart Ring Sleep Monitoring Technology | 睡眠 / SpO₂ / HR / 指标目录 |
| `/smart-ring-osa` | Smart Ring OSA & Sleep Respiratory Monitoring Technology | OSA 相关技术边界 + 研究合作口径 |

每页均含：明确 H1、Metadata、FAQ、Breadcrumb、OEM CTA、相关内链。

### 3.3 技术与 Schema

| 项 | 状态 |
|----|------|
| Organization Schema | 已修正：公司名 + `brand: MATEYOU`（不再把品牌当 alternateName） |
| WebSite Schema | 已新增（首页） |
| FAQPage Schema | 5 个 GEO 页 |
| BreadcrumbList | 5 个 GEO 页 |
| Product Schema | Ring1C 页已挂载，manufacturer = LONGVON |
| sitemap.xml | 已纳入 5 核心页 + about/news/metrics/assessment 路径 |
| robots.txt | 允许核心路径；允许常见 AI crawler；不主动屏蔽 Google |
| `googleBot` | 由 `index:false` 改为允许索引 |
| `/llms.txt` | 已新增（`apps/web/public/llms.txt`） |

### 3.4 实体一致性（软修正，非全站暴力替换）

- `/partner/oem`：主体改为龙汾科技（LONGVON）提供 OEM；标明 MATEYOU 为品牌  
- Footer：LONGVON 身份 + GEO 技术页链接  
- About：补充公司/品牌关系句  
- Ring1C：Product Schema + 链向 Manufacturer / Technology  

---

## 四、可公开使用的事实 vs 未发布内容

### 4.1 已确认可写（有官网/代码依据）

- 公司：龙汾科技（深圳）有限公司；2017 年成立；国高企 / 专精特新 / 创新型（以 About 表述为准）  
- 关系：MATEYOU = LONGVON 旗下智能戒指 / AI 健康品牌  
- OEM：产能说明、质量体系资料、报价、外观/包装/部分模块定制  
- 产品：MATEYOU Ring1C；PPG + 温感 + 六轴；公开参数目录 **71** 项  
- 睡眠模块 **22** 项；OSA 相关模块含 AHI、ODI、SpO₂ 相关项等  
- 医院合作页明确：**非医疗器械、消费级健康监测**；可提供临床研究合作资料（详情未上网）

### 4.2 明确未发布（避免错误 GEO）

| 内容 | 原因 |
|------|------|
| 诊断 / 治疗 / 预防 OSA | 无法规与临床公开依据 |
| 准确率、替代 PSG | 无证据 |
| 「65 项监测参数」 | 代码库未出现，待确认 |
| 把业务「22 项」与睡眠「22 维」强行等同 | 口径冲突风险 |
| 对外保证提供公开 SDK / Cloud API | 无文档；仅写「按项目沟通」 |
| 专利数量、医院具名、FDA/CE/FCC 编号 | 未找到可引用材料 |
| 「中国唯一 / 全球领先」等绝对化 | 证据不足；GEO 页未沿用 |

---

## 五、内链结构（已形成）

```
/smart-ring-manufacturer
        ↓
/smart-ring-oem-odm
        ↓
/smart-ring-technology
        ↓
/smart-ring-sleep-monitoring
        ↓
/smart-ring-osa

MATEYOU Ring1C  →  Manufacturer / Technology
Footer Technology 栏 → 上述 5 页
B2B CTA → /partner/oem（OEM/ODM 咨询，非商城导购）
```

---

## 六、验收对照

| 验收项 | 结果 |
|--------|------|
| AI 可理解 LONGVON 是技术提供商 / OEM-ODM | ✅ 页面与 Schema 已写清 |
| AI 可理解 MATEYOU 是品牌 | ✅ |
| 5 个核心页存在 | ✅（待部署） |
| 明确 H1 / Metadata / FAQ | ✅ |
| Organization / WebSite / Breadcrumb / FAQ Schema | ✅ |
| 内链 + OEM CTA | ✅ |
| sitemap / robots / llms.txt | ✅ |
| 无虚假医疗宣传、无未证实绝对化表述 | ✅（新 GEO 页） |
| 22/65 未错误处理 | ✅ |
| AI 平台是否已提及 LONGVON | ⏳ 部署并索引后手工测 |

---

## 七、下一步建议（按优先级）

1. **部署上线**，确认 5 页与 `/llms.txt` 返回 200；向搜索引擎提交 sitemap。  
2. **手工跑 20 条 Query**（ChatGPT / Gemini / Perplexity / Google AI），填写 `GEO-VISIBILITY-TRACKER.csv` 作为 baseline。  
3. **优先关闭 Fact-Check**：FC-01（22 口径）、FC-02（65）、FC-06（临床数据可否公开）、FC-13/14（SDK/API）。  
4. 后续软清理 About「全球领先/引领者」、Ring1C「医疗级」等历史营销用语。  
5. 第二阶段再考虑：证据型文章、目录站、英文 About——**禁止**大批量低质 AI 博客。

---

## 八、关键文件路径（开发侧）

**新增页面**

- `apps/web/app/smart-ring-manufacturer/page.tsx`
- `apps/web/app/smart-ring-oem-odm/page.tsx`
- `apps/web/app/smart-ring-technology/page.tsx`
- `apps/web/app/smart-ring-sleep-monitoring/page.tsx`
- `apps/web/app/smart-ring-osa/page.tsx`
- `apps/web/components/GeoPageLayout.tsx`
- `apps/web/public/llms.txt`

**关键修改**

- `apps/web/components/StructuredData.tsx`
- `apps/web/app/layout.tsx` / `robots.ts` / `sitemap.ts`
- `apps/web/app/partner/oem/page.tsx`
- `apps/web/components/GlobalFooter.tsx`
- `apps/web/app/about/page.tsx`
- `apps/web/app/products/ring1c/page.tsx`

---

## 九、总结

LONGVON GEO Foundation v1.0 已在代码与文档层完成：从「只有消费品牌叙事」转向「可引用的智能戒指技术商 / OEM-ODM 制造商叙事」，并建立证据边界，避免医疗与参数口径翻车。

**当前卡点只有运营动作：部署 → 抓取 → AI 可见性实测。** 仓库内建设项已闭环。
