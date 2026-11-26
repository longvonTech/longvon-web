# 准备阶段验证（2026-11-22）

基线代码main62ae62ef31e7a3cd239302c53c11c359304d0ca7；独立Issue25分支。未混入PR24（远端最新ff78951，与此前记录cb1bc6c存在漂移，仍Draft）。

本机Python观测记录器测试8/8通过：拒绝覆盖、不可用不冒充未出现、证据篡改/路径越界、固定Query漂移、矛盾排名、不同环境错误比较、额外字段。
命令：`python3 -W error::ResourceWarning -m unittest discover -s scripts/geo/monitoring -p 'test_*.py' -v`。

原有PPG与RFQ合同测试14/14通过：`node --test scripts/geo/raw-ppg.test.cjs scripts/rfq/client-contract.test.cjs scripts/rfq/attribution-contract.test.cjs`。新worktree未安装依赖，首次执行因缺typescript失败；随后明确使用原隔离checkout的node_modules作为NODE_PATH重跑通过。未修改依赖锁文件。该结果不是端到端写库/通知证明。

公开HTTP GET记录28次，含两个探查路径404，详见technical-audit.md及结构化证据；不是28个唯一页面。未进行任何POST、迁移、合并、部署、DNS/Nginx或生产数据变更。

待办：完整浏览器与数据库RFQ回归、移动端/性能、搜索基线、第三方统计和业务数据、四周复测/报告。CI在PR创建后以实际记录为准，本文件不预称完整CI通过。
