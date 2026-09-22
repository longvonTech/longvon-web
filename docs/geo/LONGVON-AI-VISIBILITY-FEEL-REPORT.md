# LONGVON GEO — AI 可理解性抽样报告（第四步）

**Task:** TASK-GEO-001 后续 · Phase 1 验收补充  
**报告类型:** 人工可见性 / AI 可理解性「感受」基线  
**日期:** 2026-09-22  
**站点:** https://www.longvon.com  

**重要声明:**  
本报告**不宣称** ChatGPT、Gemini、Perplexity、豆包、通义或其他任何 AI 平台已经稳定收录或正确引用 LONGVON。  
本报告只记录：官网侧是否就绪、公开检索基线、以及推荐的人工感受方法与判定标准。

---

## 1. 结论（先看这个）

| 维度 | 状态 | 说明 |
|------|------|------|
| 官网 Entity 内容 | **就绪** | 中英文 GEO、llms.txt、hreflang、sitemap 已上线 |
| HTTPS / 证书 | **就绪** | Let's Encrypt 已续签（此前 TrustAsia 过期导致无法抓取） |
| 中文界面语言 | **就绪** | 中文 GEO 页与页脚已中文化；英文在 `/en/*` |
| 搜索引擎收录新 GEO 页 | **未确认 / 偏滞后** | `site:www.longvon.com/company/longvon` 抽样无结果 |
| 公开检索中的旧画像 | **仍存在** | 第三方目录与旧外贸/手表内容仍占主导 |
| AI「直接问」正确率 | **预期偏低（正常）** | 新页上线不久，模型/检索尚未充分消化 |
| AI「贴官网再问」可理解性 | **可测 / 预期可通过** | Entity 文案对人类与模型均清晰，建议人工贴链验证 |
| 是否进入「AI 已认识 LONGVON」 | **否** | 仅完成发现地基；引用需时间与持续一致性 |

**阶段判定:**

> **AI Entity Foundation Ready · Visibility Sampling Baseline Recorded**  
> **NOT:** AI Citation Achieved / AI Ranking Approved

---

## 2. 第四步测什么

目标不是流量，也不是监测系统，而是感受：

```text
AI 能否发现 LONGVON？
        ↓
AI 能否确认 LONGVON 是谁？
        ↓
AI 能否理解 LONGVON 做什么？
        ↓
AI 能否理解能力边界（OEM/ODM、睡眠/呼吸/OSA 相关）？
        ↓
AI 是否引用 longvon.com？
```

对照口径（官网已统一）：

- **LONGVON** = 智能戒指技术制造商及 OEM/ODM 服务商  
- **MATEYOU** = LONGVON 的智能戒指产品品牌（不是制造商）  
- 参数：71 项健康监测参数，含 22 项睡眠相关参数  
- OSA：仅「OSA 相关监测」，不诊断、不替代 PSG  

查询清单见：`docs/geo/LONGVON-AI-QUERIES.md`

---

## 3. 官网侧就绪证据（2026-09-22 前已部署）

| 检查项 | 结果 |
|--------|------|
| `/company/longvon` 等 7 个中文 GEO | 生产可访问，中文为主 |
| `/en/company/longvon` 等 7 个英文 GEO | 生产可访问 |
| `/llms.txt` | 200；含中英文 Entity 与页面入口 |
| `/sitemap.xml` | 含中英文 GEO URL |
| `/robots.txt` | 允许公开 GEO 与 `/en/` |
| hreflang / canonical | 双语互指，各自 self-canonical |
| SSL | 有效（Let's Encrypt，约至 2026-12-19） |
| production smoke | 部署后曾通过（中英文 GEO + SEO 文件） |

**结论:** 第四步「贴官网再问」所需的官方事实源已具备。

---

## 4. 公开检索基线（抽样，非全网）

抽样时间约：**2026-09-22**。

### 4.1 新 GEO 页收录

| 查询 | 结果 |
|------|------|
| `site:www.longvon.com/company/longvon` | **无结果**（当时抽样） |
| 新英文 `/en/company/longvon` | **未见稳定收录证据** |

→ 搜索引擎对新 Entity 页的收录**尚未确认**。  
→ AI 若依赖网页检索，**直接问**时很难稳定引用新页。

### 4.2 旧画像仍占公开检索

公开结果中仍可见：

- 第三方供应商目录将 LONGVON 描述为消费电子 / OEM·ODM（部分正确）  
- 旧站/外贸内容偏**智能手表、手环**，而非当前官网强调的**智能戒指制造商 Entity**  
- 部分历史 URL / 产品页与当前 GEO 叙事不一致  

→ 这会拉低「直接问 AI」的正确率，属预期噪音，不应用「改口号」假装解决。

### 4.3 官网事实源抽查

| URL | 结果 |
|-----|------|
| https://www.longvon.com/llms.txt | **可读**；Entity / MATEYOU 关系 / 71·22 / 中英文核心页齐全 |

---

## 5. 推荐人工感受协议（已可执行）

### 5.1 平台（任选 ≥3）

| 区域 | 建议 |
|------|------|
| 全球 | ChatGPT、Perplexity、Gemini |
| 中国 | 豆包、通义、文心/元宝（任选） |

### 5.2 两段测法

**A. 直接问（测「脑子里有没有」）**

- 中：LONGVON 是什么公司？ / 龙汾科技是什么公司？ / LONGVON 是智能戒指制造商吗？  
- 英：Who is LONGVON? / Is LONGVON a smart ring manufacturer?

**B. 贴官网再问（测「读不读得懂」）**

> 请阅读 https://www.longvon.com/company/longvon  
> 用三句话说明：LONGVON 是谁、做什么、和 MATEYOU 什么关系。

英文对照：https://www.longvon.com/en/company/longvon

### 5.3 打分（简单）

| 分 | 含义 |
|----|------|
| 2 | 制造商 + OEM/ODM + 智能戒指；MATEYOU 关系正确；最好有官网引用 |
| 1 | 部分正确（如只说深圳 OEM，或混入手表） |
| 0 | 不知道 / 严重错误 / 把 MATEYOU 当制造商 |

**当前阶段成功标准（建议）:**

- **B（贴官网）平均 ≥ 1.5** → Entity 文案对 AI 可理解  
- **A（直接问）** 允许偏低 → 等待收录，不视为官网失败  

---

## 6. 记录表（可复制填写）

| 日期 | 平台 | 问题 | A直接问(0-2) | B贴官网(0-2) | 是否引用 longvon.com | 备注 |
|------|------|------|--------------|--------------|----------------------|------|
| 2026-09-22 | | LONGVON是什么公司？ | | | | |
| 2026-09-22 | | Who is LONGVON? | | | | |
| 2026-09-22 | | 谁提供智能戒指OEM？ | | | | |
| | | | | | | |

建议每 1–2 周复测同一组问题，观察 A 分是否上升。

---

## 7. 风险与解释

| 风险 | 影响 | 应对 |
|------|------|------|
| 新页未收录 | 直接问答错 | 保持 sitemap/robots；持续稳定上线；耐心等待 |
| 旧手表/外贸内容 | AI 答成手表厂 | 官网坚持戒指 Entity；勿大规模矛盾内容 |
| 证书曾过期 | 抓取中断 | 已 Let's Encrypt + 自动续期 |
| GitHub 未 push | 远端仓库落后 | 网络恢复后 `git push origin main` |
| 误以为「测过就收录了」 | 错误决策 | 本报告明确：Foundation ≠ Citation |

---

## 8. 下一步建议（仍不做监测系统）

1. **按第 5 节完成一轮人工打分**，填第 6 节表（可截图存档）。  
2. **2–4 周后复测**同一问题，对比 A 分是否改善。  
3. 若贴官网仍答错 → 再改 Entity 文案；若贴官网答对、直接问答错 → **优先等收录，不堆文章**。  
4. 中国站侧重百度/国内大模型；英文站侧重 Perplexity/ChatGPT 带引用场景。  
5. **禁止本阶段建设：** GEO Dashboard、Citation Tracker、自动爬 AI、大规模内容工厂。

---

## 9. 验收清单（第四步）

| 项 | 状态 |
|----|------|
| 有可执行的 AI 感受协议 | **Done**（本报告 §5） |
| 有查询清单 | **Done**（`LONGVON-AI-QUERIES.md`） |
| 官网事实源可被 AI 阅读 | **Done**（GEO + llms.txt） |
| 公开检索基线已记录 | **Done**（本报告 §4） |
| 已证明主流 AI 稳定正确引用 LONGVON | **NOT VERIFIED** |
| 已证明新 GEO 页已被 Google/百度收录 | **NOT VERIFIED** |

---

## 10. 一句话总结

> **官网已经把 LONGVON 说清楚了；AI「贴链接能读懂」是现在该验证的；「不贴链接也能答对」要等收录，现在不能写成已成功。**

---

**Related docs**

- `docs/geo/LONGVON-ENTITY.md`  
- `docs/geo/LONGVON-AI-QUERIES.md`  
- `docs/geo/LONGVON-ENTITY-CONSISTENCY.md`  
- `docs/geo/GEO-AI-TEST-PROTOCOL.md`  
- `docs/reports/phase-g-production-verification-report.md`  
