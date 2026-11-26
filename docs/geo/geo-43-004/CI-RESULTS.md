# GEO-43-004 CI结果

实现代码头：`33af66403d5f5dfdaa308576dc133ed24f526055`。Draft PR #29基于PR24头ff789513；无main合并或部署。

- PASS — [GEO buyer-path](https://github.com/longvonTech/longvon-web/actions/runs/45410029019)：Node22/Linux。29项合同、5项i18n、生产Web构建、显式TypeScript、standalone启动、保留2条PPG路径、保留6条OEM阶段路径、新增4条采购路径、制品上传均成功。
- PASS — [RFQ contract及Linux Web](https://github.com/longvonTech/longvon-web/actions/runs/45410028843)：两个job `contract`、`linux-web`均成功。包含现有RFQ发布门禁/静态事务/切换事务测试，以及Linux原生Web打包、平台测试和standalone smoke；不是生产部署。
- 通用`CI/lint-build-test`只对main目标PR触发，本stacked PR不触发，未把它写成已经运行或通过。

Linux实际浏览器制品已下载核验，非仅依据job绿灯：artifact ID14927606260，10582214字节。归档摘要和三份原始verification JSON见[evidence/linux-artifact-review.json](evidence/linux-artifact-review.json)、linux-procurement-verification.json、linux-oem-verification.json、linux-verification.json，分别4/6/2条路径PASS。下载临时签名URL未保存/上传。完整job及步骤状态见ci-buyer-path-run.json、ci-rfq-run.json，三项Checks快照见ci-code-33af664.json。

随后提交的验收文档/截图/证据不改变上述实现代码。最终证据提交的最新Checks以PR #29页面及Issue25的最终交付更新为准，不能将已通过的旧SHA运行偷换成新SHA运行。本轮只申请审核，不申请合并或上线。
