# PR27 最终验收 — 2026-11-23

执行时间（UTC）：2026-11-23T01:08:22.286270+00:00；本地时区Asia/Shanghai。基准127ebbf0a500808db34488e9eb9cf60cc98a1703，分支fix/geo-43-003-observation-reliability。历史验收见ACCEPTANCE.md，本次仅更新本PR。

## 各项结论

- PASS：Mac现有已登录Chrome，读取既有已完成会话`https://www.perplexity.ai/session/44e23b10-9e87-425e-9061-f7073e242f01`，Query为100Hz raw PPG smart ring SDK；没有重新提交查询、没有新建未登录会话。实际调用collectVisibleCitationTargets，引用根区域由可见“来源”按钮的父元素确定，该区域实际有10个链接。
- PASS：取得10个去重完整HTTPS目标，逐一检查协议、主机、无URL凭据、与保存DOM逐字对应。两个指定URL均在实际输出中；指定值仅用于验收断言，没有写入提取器或代替DOM输出。
- PASS：Python13项、Node8项通过；首轮36条观测保留，原manifest148项哈希全部一致。未覆盖原始截图或记录。
- PASS（自动一致性）：原两张ChatGPT图对应的DOM字节完全一致，原图及DOM的SHA256记录于verification.json；自动检查不能判定人类可读性。
- PASS（代理视觉复核）：本次实际打开原1000高度及1600高度图片。两图相互覆盖固定输入栏遮挡，结合可读全文（介绍、选项表、其他SDK、建议清单、问题控件及结尾），横向无裁切；可见文字与完整DOM一致。负责人视觉审核仍PENDING_REVIEW；不是程序自动判定通过。
- UNKNOWN：来源URL可达性/内容真实性、地区、平台模型未独立核实；不影响本次“可见DOM正确提取”验收，也不将第三方技术声明当LONGVON政策。
- BLOCKED：本次已登录Perplexity提取无环境阻塞；前次未登录IAB的BLOCKED_LOCAL_ENV已由本次实际验收关闭。FAIL：本次未发现失败项。

## 测试命令

`python3 -W error::ResourceWarning -m unittest discover -s scripts/geo/monitoring -p 'test_*.py' -v`

`node --test scripts/geo/monitoring/browser-capture.test.mjs`

实际执行时间、stdout/stderr与退出码见本次证据目录python-tests.txt、node-tests.txt。

## 实际提取目标（不是硬编码程序输出）

- https://sensorbio.com/science/
- https://www.longvon.com/en/smart-ring-technology
- https://www.tuckstechs.com/catalog/oemodm-heart-rate-monitoring-ring-manufacturer-supplier/
- https://github.com/josearruticuanda/smart-ring/blob/main/README.md
- https://www.nature.com/articles/s41597-026-07289-x?error=cookies_not_supported&code=03576bea-ef72-4334-832f-589a91e23fd0
- https://sensorbio.com/the-signal/smart-ring-vs-smartwatch-ppg/
- https://sensorbio.com/comparison/sensor-bio-v2-vs-ultrahuman/
- https://github.com/josearruticuanda/smart-ring
- https://ar5iv.labs.arxiv.org/html/2505.04172
- https://github.com/Sense-Ring/Sense-Ring-1.0

## 证据与哈希

路径相对docs/geo/geo-43-003，保存截图/DOM/JSON时未读取密码、Cookie或Session Token；环境为既有登录浏览器，模型和国家UNKNOWN。页面账户显示标签从文本中省略，未保存其他历史会话。

- `reliability/acceptance-2026-11-23/node-tests.txt` — SHA256 `76d6b3346563ef85134c51e66dc6d883404dafa432c66a5ebd29d4dba781fa61`
- `reliability/acceptance-2026-11-23/perplexity-dom.txt` — SHA256 `41703c4f84a28453c5d52fda66e4e86b09416b3df05136c72b29d0a0119424d5`
- `reliability/acceptance-2026-11-23/perplexity-targets.json` — SHA256 `74101db3e183f7b8ba3c671f6cf039b339d1b9e4b2b186db49ec44591683299d`
- `reliability/acceptance-2026-11-23/perplexity.jpg` — SHA256 `2d5316947f69be9781c83793ff25e3428a3bf1dea42b0d0ac2621f509352cbf2`
- `reliability/acceptance-2026-11-23/python-tests.txt` — SHA256 `d4d31169afb999d4f9dde1efa50d979a181998402946a0599f2cecaed343b2bd`
- `reliability/browser-evidence/chatgpt-default-qa.txt` — SHA256 `82fadd7000b44cb6b525e7739f6d5ab4c818805d394e4b4ab9c2bad9e8dda425`
- `reliability/browser-evidence/chatgpt-default-qa.jpg` — SHA256 `ff41804546cc9b6cc3805aed694d3d451d1c6936647c45a2807fff45128b1557`
- `reliability/browser-evidence/chatgpt-default-qa-tall.txt` — SHA256 `82fadd7000b44cb6b525e7739f6d5ab4c818805d394e4b4ab9c2bad9e8dda425`
- `reliability/browser-evidence/chatgpt-default-qa-tall.jpg` — SHA256 `f78b95c99e5d73d2fd19ba65a78a8ba6e68416560a229f622e49a42885db69ac`

## Ready for review

功能/证据条件满足；最终Ready for review以本次新提交GitHub CI成功为最后门禁。保持Draft等待负责人独立审核，本报告不自动调用Ready按钮，不表示合并或部署批准。CI记录于Issue25本次验收评论及PR27 Checks，避免将旧头的CI冒充新头结果。

本次没有新增业务代码，没有修改其他PR，没有迁移、合并、部署、改生产数据库/DNS/Nginx或提交生产询盘。网站内容PR28的制造/测试原始资料缺口属于另一PR，不作为本PR的引用采集阻塞。
