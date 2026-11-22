# 公开技术审查（首批，只读）

观测日期2026-11-22；证据 `evidence/public-http-audit.json`，含实际UTC时间、URL、状态、canonical/hreflang/metadata、JSON-LD解析结果、正文指纹及跳转链。使用Python HTTP GET，国家UNKNOWN；不是浏览器渲染或搜索索引结果。

- `https://www.longvon.com/` → 200；canonical ['https://www.longvon.com']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en` → 200；canonical ['https://www.longvon.com/en']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/smart-ring-manufacturer` → 200；canonical ['https://www.longvon.com/smart-ring-manufacturer']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/smart-ring-manufacturer` → 200；canonical ['https://www.longvon.com/en/smart-ring-manufacturer']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/smart-ring-oem-odm` → 200；canonical ['https://www.longvon.com/smart-ring-oem-odm']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/smart-ring-oem-odm` → 200；canonical ['https://www.longvon.com/en/smart-ring-oem-odm']；hreflang 3；JSON-LD ['PARSES', 'PARSES', 'PARSES']。
- `https://www.longvon.com/smart-ring-sdk-api` → 200；canonical ['https://www.longvon.com/smart-ring-sdk-api']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/smart-ring-sdk-api` → 200；canonical ['https://www.longvon.com/en/smart-ring-sdk-api']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/smart-ring-sleep-respiratory` → 200；canonical ['https://www.longvon.com/smart-ring-sleep-respiratory']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/smart-ring-sleep-respiratory` → 200；canonical ['https://www.longvon.com/en/smart-ring-sleep-respiratory']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/company` → HTTP Error 404: Not Found；canonical []；hreflang 0；JSON-LD []。
- `https://www.longvon.com/en/company` → HTTP Error 404: Not Found；canonical []；hreflang 0；JSON-LD []。
- `https://www.longvon.com/robots.txt` → 200；canonical []；hreflang 0；JSON-LD []。
- `https://www.longvon.com/sitemap.xml` → 200；canonical []；hreflang 0；JSON-LD []。
- `https://new.longvon.com/` → 200；canonical ['https://www.longvon.com']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://new.longvon.com/robots.txt` → 200；canonical []；hreflang 0；JSON-LD []。
- `https://new.longvon.com/smart-ring-oem-odm` → 200；canonical ['https://www.longvon.com/smart-ring-oem-odm']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/company/longvon` → 200；canonical ['https://www.longvon.com/company/longvon']；hreflang 3；JSON-LD ['PARSES', 'PARSES', 'PARSES']。
- `https://www.longvon.com/en/company/longvon` → 200；canonical ['https://www.longvon.com/en/company/longvon']；hreflang 3；JSON-LD ['PARSES', 'PARSES', 'PARSES']。
- `https://www.longvon.com/about` → 200；canonical ['https://www.longvon.com/about']；hreflang 3；JSON-LD []。
- `https://www.longvon.com/en/about` → 200；canonical ['https://www.longvon.com/en/about']；hreflang 3；JSON-LD []。
- `https://www.longvon.com/smart-ring-sleep-monitoring` → 200；canonical ['https://www.longvon.com/smart-ring-sleep-monitoring']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/smart-ring-sleep-monitoring` → 200；canonical ['https://www.longvon.com/en/smart-ring-sleep-monitoring']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/osa-smart-ring-technology` → 200；canonical ['https://www.longvon.com/osa-smart-ring-technology']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://www.longvon.com/en/osa-smart-ring-technology` → 200；canonical ['https://www.longvon.com/en/osa-smart-ring-technology']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://new.longvon.com/` → 200；canonical ['https://www.longvon.com']；hreflang 3；JSON-LD ['PARSES', 'PARSES']。
- `https://new.longvon.com/en/smart-ring-oem-odm` → 200；canonical ['https://www.longvon.com/en/smart-ring-oem-odm']；hreflang 3；JSON-LD ['PARSES', 'PARSES', 'PARSES']。
- `https://new.longvon.com/robots.txt` → 200；canonical []；hreflang 0；JSON-LD []。

## 问题及限制

`/company`和`/en/company`为探查路径，返回404；实际公司页为`/company/longvon`及英文对应页，不能仅因猜测路径404判定线上导航损坏。

new.longvon.com按证据中的实际跳转状态逐路径判断；域名已有跳转不等于搜索引擎已去重或清除旧索引。当前仅测试列出路径，不能声称全路径覆盖；旧页面索引、历史RFQ和商业内容需搜索留证及更多路径抽查。未改DNS/Nginx/生产配置，暂不提出重复配置变更。

HTTP200和可解析JSON-LD不代表完整SEO验收。尚待检查：sitemap逐URL覆盖、hreflang互返、结构化数据语义/事实、内部链接可达性、移动端布局/CTA交互、性能实测、旧商业声明逐项核对、旧域名未测路径及外部索引。RFQ未提交，不以GET通过替代提交/写库/通知验证。必要修复另建分支/PR。
