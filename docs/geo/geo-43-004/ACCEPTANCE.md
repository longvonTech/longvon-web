# GEO-43-004 验收报告

日期：2026-11-24，Asia/Shanghai。Draft PR：[29](https://github.com/longvonTech/longvon-web/pull/29)；关联Issue25/PR28。实现代码SHA：`33af66403d5f5dfdaa308576dc133ed24f526055`；基线PR24头`ff789513e7afac9b632225c2eecde70cd5515f1e`。本候选未合并、未部署。

## 结果

- PASS：中英文Manufacturer实际网页代码及SDK/API五模块；明确标准OEM和定制ODM、受限MOQ及SDK/BLE/云算法/API边界。来源与逐项修改说明见[CHANGES-AND-SOURCES.md](CHANGES-AND-SOURCES.md)。
- PASS：TypeScript `npx tsc -p apps/web/tsconfig.json --noEmit`；Web lint；完整Web生产构建及standalone启动。Next build内部类型检查亦通过。运行日志见evidence/typecheck.txt、web-lint.txt、web-build.txt。两项已有admin React Hook lint警告保留，不扩大修改范围。
- PASS：29项合同测试，命令`node --test scripts/geo/procurement-pages.test.cjs scripts/geo/oem-journey.test.cjs scripts/geo/raw-ppg.test.cjs scripts/rfq/client-contract.test.cjs scripts/rfq/attribution-contract.test.cjs`。新增5项含13文件保护指纹；原24项覆盖保留。PR24的unit/browser两处旧“禁止1000数字”断言改为已批准的型号/平台/标准OEM限定断言，继续禁止500及虚构商务条件。
- PASS：`node --experimental-strip-types --test apps/web/lib/i18n-routes.spec.mjs`，5/5。
- PASS：`node scripts/geo/procurement-pages-browser.cjs`，4条中英文Manufacturer/SDK入口。canonical/hreflang/HTML语言、单H1、可见FAQ与Schema、14条正文内部链接、5模块顺序、原始锚点、sitemap及390宽无横向溢出均通过。每条以合成的首次ChatGPT及最近Perplexity不同UTM进入，验证first/latest来源、campaign/content/term、首落地页、AI后缀和原始国际电话。400/429/500/502错误及general@longvon.com回退通过，内部错误不显示。
- PASS：保留`raw-ppg-browser.cjs`两条路径和`oem-journey-browser.cjs`六条样品/试产/量产路径全部通过；表单选项、可选资料remark、超长限制、失败不计成功、合成数据不进入商业统计不回归。三个验证JSON见evidence/candidate、retained-ppg、retained-oem。
- PASS：13个受保护源码文件与ff789513哈希一致，含Company、Sleep Respiratory、OEM两页、RFQ处理器、归因、API客户端、商业政策源、现有重定向和Prisma schema。没有数据库迁移、API改动或生产统计写入。
- PASS：专项及第二轮所有实际LONGVON引用去重26 URL，只读GET逐跳检查全部最终200，canonical/语言匹配；旧respiratory地址308到sleep-respiratory。完整原始结果见evidence/production-reference-url-audit.json。没有发现URL代码缺陷，不提交无必要的重定向补丁。
- PASS：四对真实浏览器修改前后截图及DOM已保存；新候选另有桌面/手机与失败截图。人工抽查英文Manufacturer桌面、中文SDK手机：正文和CTA可读、无水平裁切。截图中的导航logo缺失为基线已有问题，未宣称整个站点视觉零缺陷。
- ISSUE（既有）：仓库基线缺少`public/images/longvon-logo.png`，before/after本地均404；未纳入本任务修改。已有英文信任条与中英文全站导航/页脚差异保留，不扩写或重新认证历史企业证据。
- UNKNOWN：真实生产转化增益、询盘数据库/企业微信端到端结果，本轮不做生产POST，不能由本地拦截测试推断写库成功。技术资料缺失部分继续按项目评估，不升级PARTIAL知识等级。

## 执行环境与证据

本地Node26.0.0/npm11.12.1，Next15.5.19；CI使用原工作流Node22。构建API仅指向127.0.0.1:34672的只读fixture；Web在127.0.0.1:34673。浏览器测试拦截本机所有lead POST并拒绝外部请求，email为example.invalid，名称带TEST/SYNTHETIC，无生产询盘、写库或通知。本地测试并不等于生产业务验收。

before截图为本任务编辑前ff789513本地dev；after为本地standalone候选。生产页面只读GET另行标识，不混用。所有本批次证据SHA256见evidence/manifest.json。首轮/第二轮记录保留在原独立分支，不复制改写它们。

CI工作流保留原PPG/OEM浏览器套件，并增加本次unit、TypeScript和新入口套件。PR以PR24分支为base，所以主仓库仅main目标的通用CI不会被伪报为已运行；实际相关CI结果与运行链接将在CI-RESULTS.md记录，最终证据提交的最新Checks以PR页面为准。未触发部署工作流。

## 回滚与审核建议

代码可进入独立采购/技术审核；不能据此发布。PR24须先完成其独立审批，本PR作为stacked候选只审核新增差异，之后重新核对main集成及全部相关CI。

如果负责人日后批准发布，回滚仅还原本任务的页面/共享组件/文案和测试变更至ff789513，不回滚已修复API、不更换Prisma客户端、不执行迁移、不删除询盘。采用既有健康门禁、增量静态、可保留询盘正常的Web回切方案；本PR不修改发布脚本，也不批准部署。具体候选构建必须使用生产批准配置重建，本地localhost制品不可上传生产。

代码撤回可在评审分支对33af664做revert，保持PR24基线不动。生产回滚另以发布前实测且记录校验和的健康Web release目录/制品为目标，不把Git源码SHA当作现网制品身份：先保留旧Web与旧hash静态资源，候选就绪及只读页面/资源健康门禁通过后才允许经单独批准切换；切换后失败自动/按既有发布脚本回到健康Web，并再次GET验收。始终保留修复后的API、Prisma客户端及数据库，静态资源增量发布不能先删除旧引用资源。本轮未做ECS发布或生产回滚演练，实际现网release ID及制品校验和须在日后批准发布前记录，不能虚构为本轮已验收。

PR28在本实现审核通过后再决定关闭；本轮不关闭、不修改其分支。Issue25继续跟踪；不得把技术采购页面优化假设写成已实现询盘增长。
