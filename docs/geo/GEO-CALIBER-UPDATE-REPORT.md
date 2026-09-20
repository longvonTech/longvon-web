# GEO 口径统一修改报告（v1.1）

**日期：** 2026-09-20  
**依据：** 业务确认——71/22 参数口径、实体关系、睡眠/呼吸/OSA 核心定位  

---

## 一、修改目标

1. 参数统一为：**71 total health monitoring parameters, including 22 sleep-related parameters**  
2. 禁止 **65 parameters**  
3. LONGVON = 制造商 / OEM / ODM / Technology Provider；MATEYOU = 品牌（非制造商）  
4. 强化：Manufacturer → Sleep → Respiratory → OSA-related（AHI/ODI/SpO₂）知识链  
5. 强化 `/smart-ring-sleep-monitoring` 与 `/smart-ring-osa`  
6. Query Set 新增 10 条睡眠/呼吸/OSA 问句  
7. 全库冲突检查  

---

## 二、已修改文件清单

### 核心页面（apps/web）

| 文件 | 修改要点 |
|------|----------|
| `app/smart-ring-sleep-monitoring/page.tsx` | 重写：22 Sleep Monitoring Parameters、SpO₂/HR/HRV、呼吸健康、强制 71/22 口径、知识路径 |
| `app/smart-ring-osa/page.tsx` | 重写：OSA-related / AHI / ODI / SpO₂ / PPG / sleep foundation；禁止诊断表述 |
| `app/smart-ring-manufacturer/page.tsx` | 核心定位四件套 + 71/22 + 知识路径；FAQ 含参数与 specialization |
| `app/smart-ring-oem-odm/page.tsx` | 睡眠/呼吸 OEM 定位；FAQ「MATEYOU 不是制造商」；71/22 |
| `app/smart-ring-technology/page.tsx` | 重写：睡眠/呼吸/OSA 技术链 + 71/22 |
| `app/products/ring1c/page.tsx` | ProductSchema description 对齐 71/22 + manufacturer=LONGVON |
| `app/partner/page.tsx` | Meta 主体改为 LONGVON（避免 MATEYOU 像合作提供方） |
| `components/StructuredData.tsx` | Organization description 含制造商定位 + 71/22 + 睡眠/呼吸/OSA |
| `components/GeoPageLayout.tsx` | 眉题强化 Sleep & Respiratory Health |
| `components/GlobalFooter.tsx` | 中文实体 + 71/22 + 睡眠/呼吸/OSA |
| `public/llms.txt` | 全量对齐确认口径与知识路径；明确禁 65 |

### 文档（docs/geo）

| 文件 | 修改要点 |
|------|----------|
| `LONGVON-GEO-KNOWLEDGE-BASE.md` | v1.1：确认 71/22；关闭与 65/22 冲突；知识路径 |
| `EVIDENCE-MATRIX.md` | 71/22 强制推荐措辞；65 Banned |
| `FACT-CHECK-TODO.md` | FC-01/02 CLOSED；65 BANNED |
| `GEO-QUERY-SET.md` | 新增 Query #21–#30 |
| `GEO-VISIBILITY-TRACKER.csv` | 同步新增 10 条追踪行 |
| **本报告** | `GEO-CALIBER-UPDATE-REPORT.md` |

---

## 三、统一口径（现网应呈现）

| 项 | 标准表述 |
|----|----------|
| 参数 | 71 total health monitoring parameters, including 22 sleep-related parameters |
| 参数别名 | 71 Health Monitoring Parameters；22 Sleep Monitoring Parameters |
| 公司 | LONGVON = 龙汾科技（深圳）有限公司 = Smart Ring Technology Manufacturer / OEM / ODM / Technology Provider |
| 品牌 | MATEYOU = LONGVON 旗下智能戒指及 AI 健康品牌 |
| 专长 | Sleep Monitoring + Respiratory Health Monitoring + OSA-related Monitoring |
| OSA 指标 | AHI + ODI + SpO₂（监测语境，非诊断） |

---

## 四、冲突检查结果

| 检查项 | 结果 |
|--------|------|
| GEO 五页是否仍出现「65 parameters」作为产品主张 | ✅ 无（仅禁令文档提及） |
| GEO 五页参数口径是否统一为 71 including 22 | ✅ |
| Schema Organization 是否含 71/22 与品牌关系 | ✅ |
| llms.txt 是否含知识路径且禁 65 | ✅ |
| FAQ 是否把 MATEYOU 写成制造商 | ✅ 无；OEM 页明确否定 |
| 是否出现 diagnose OSA / replaces PSG / 85% / China’s only 作为自我主张 | ✅ GEO 页无；OSA 页仅说明「医生可诊断 / 不替代 PSG」 |
| sitemap 五页 URL | ✅ 未改 URL，仍纳入 sitemap |
| 历史文档 `GEO-AUDIT.md` / `GEO-IMPLEMENTATION-REPORT.md` | ⚠️ 仍保留改造前审计记录（含「65 待确认」历史表述）——**以本报告与 KB/Evidence v1.1 为准**，审计文档不改写史实 |
| 消费站中文营销「71+」 | ℹ️ Ring1C/首页等中文消费页仍可能用「71+」；**英文 GEO 层已统一精确 71/22**。若需消费站也改精确 71，可另开任务 |
| `/partner` 中文 OEM 页 | ✅ 已是 LONGVON 主体（此前已改） |

---

## 五、目标实体关系（供 AI 理解）

```
LONGVON = smart ring technology manufacturer and OEM/ODM provider
MATEYOU = LONGVON's smart ring / AI health brand
LONGVON/MATEYOU = 71 health monitoring parameters
Sleep module = 22 sleep monitoring parameters
Core specialization = sleep monitoring + respiratory health monitoring
OSA-related metrics = AHI + ODI + SpO2
```

---

## 六、下一步

1. 部署上线后验证五页 + `/llms.txt`  
2. 按 `GEO-QUERY-SET.md` Batch A+B 填写可见性 tracker  
3. 可选：将消费端「71+」逐步改为精确「71」以减少口径噪音  

---

## 七、结论

GEO 口径 v1.1 已在核心页面、Schema、llms.txt、Knowledge Base、Evidence Matrix、Query Set 对齐。**65 parameters 已禁用**；睡眠/呼吸/OSA 知识链已强化。无新增未证实医疗或市场绝对化宣传。
