# PR #24 最终验收修复 — 2026-11-25

修复基线：`ff789513e7afac9b632225c2eecde70cd5515f1e`。保持Draft，仅供审核，不合并、不部署、不修改生产系统。

## 根因与完整失败证据

已读取失败buyer-path Job `137027686947`的完整419行解码日志，见[evidence/pr24-final-20261125/buyer-path-137027686947-full.txt](evidence/pr24-final-20261125/buyer-path-137027686947-full.txt)。原运行：[44963638003](https://github.com/longvonTech/longvon-web/actions/runs/44963638003/job/137027686947)，源头ff789513，GitHub测试用合成merge为0bfeefd；原日志时间是2026-11-21 UTC，不以本轮读取日期替换历史时间。

失败位于`oem-journey.test.cjs:6`：旧规则把100、500、1000、1,000一概视为未经批准数字。ff789513已经按负责人决定更新为Ring1/Ring1C现有平台标准OEM MOQ为1,000件，因此该旧断言失败，24项中23通过、1失败，命令exit1。后续构建、PPG与OEM浏览器步骤没有运行；“没有制品”是提前失败的结果，不是独立根因。npm弃用/运行器Node提示也不是此次断言失败原因。

同样的旧数字禁令还存在`oem-journey-browser.cjs`，即使仅修unit也会在OEM阶段再次失败。因此同时修复这两处，未改政策或业务页面。

## 修复与测试标准

直接复用PR29已通过提交`4cf44ff47e90cbf241114cddfa4ac747addcc32b`的两个测试文件，两文件字节一致：

- 单元断言不再把已批准的1,000视为禁词，而是要求Ring1/Ring1C、existing-platform standard OEM上下文，确认custom ODM数量/条件单独评估；含该数字的FAQ也必须具备型号及OEM/ODM语境。
- 继续禁止未批准的100/500数字和虚构价格/交期，未把内部试产数量公开到页面。
- 浏览器保留三阶段/两语言共6条实际点击路径，要求政策段出现1,000、Ring1/Ring1C、ODM且不出现500。FAQ/Schema、canonical/hreflang、可选资料、电话、UTM/AI、错误邮件和统计排除断言全部保留。
- 原2条PPG采购路径保留。无skip、only、删套件、放宽必填、降低测试数量或工作流跳过。24项合同测试数量不变。

## 新隔离验证

- PASS：24合同；5 i18n；完整Web构建（Next内部类型检查/lint通过，原admin hook警告保留）。
- PASS：EN/ZH样品、试产、量产6条OEM路径；两语言PPG路径2条；实际处理器发送的合成POST全部本机拦截。
- PASS：国际电话原文、first/latest UTM content/term与AI后缀、可选remark资料、无新增DTO字段；超长说明0 POST；模拟500显示general@longvon.com且不计成功；QA/TEST/localhost不进入商业统计。
- PASS：SSR、可见FAQ与JSON-LD、单H1、canonical、hreflang、sitemap、上下文链接、桌面/手机无横向溢出。

新证据位于`evidence/pr24-final-20261125/{contracts.txt,i18n.txt,web-build.txt,oem,ppg}`；原证据未覆盖。新测试使用127.0.0.1:34712只读fixture及34713 standalone，Node26本地；远端原工作流仍使用既定Node20/22，不更改依赖/工作流来绕过失败。无生产GET/POST、DB/通知、DNS/Nginx操作。

## 商业政策与描述清理

数字发布范围已批准，不再写SOURCE/APPLICABILITY PENDING：1,000件仅限Ring1/Ring1C现有平台标准OEM，配置/报价另行确认，定制ODM单独评估。样品、试产、预测不等于已接受或已付款订单。README/VALIDATION与PR描述按此清理；来源矩阵与2026-11-22负责人决策保留，不升级为部署许可。

## PR29兼容性

PR29当前头为4cf44ff，两处复用测试与其字节一致。使用`git merge-tree --write-tree`在本机对象库对新修复树与PR29做三方合并仿真，检查退出码/冲突及代码差异；不切换或修改PR29分支，不合并任何GitHub PR。结果详见[evidence/pr24-final-20261125/pr29-compatibility.json](evidence/pr24-final-20261125/pr29-compatibility.json)。

集成树的应用、packages、scripts、CI工作流与PR29已通过代码完全一致，只有本次验收文档/证据不同。PR29原有已通过运行与本轮PR24独立回归共同支持兼容结论；未把静态合并检查冒称新的整套集成运行。PR29的采购页面优化不回灌进PR24，不扩大本次修复范围。

## 远端最终门禁

必须在同一最新PR24头上同时通过buyer-path、linux-web、contract、lint-build-test。最新实际SHA、四项状态与run链接随本报告记录在[PR24描述与最终验收评论](https://github.com/longvonTech/longvon-web/pull/24)，[Checks](https://github.com/longvonTech/longvon-web/pull/24/checks)可直接核验；不引用旧cb1bc6c绿灯证明本轮通过，也不把PR29的绿灯当作PR24结果。

回滚仅撤回本次测试/文档修复，不撤销ff789513已批准商业政策，不改API、Prisma或任何生产系统。最终结果仅允许进入独立审核；维持Draft。
