# LONGVON 固定制品发布与 Web 回滚

任务 `LV-CLOUD-DEPLOY-001`

**生产启用状态 BLOCKED。** 云端制品已验证。原 Mac 验收原件和生产健康版本的受控交接记录尚未收到，暂时无法确认两端制品完全一致，也无法确认生产 Web 可以通过现有恢复目录回滚。生产管理员完成下方审批清单前，应保持 `LONGVON_WEB_HANDOFF_READY` 未设置。

## 发布架构与安全机制

Codex 云端用于审阅代码、准备审批记录和核对证据。GitHub Actions 在 `main` 上手动执行。发布和回滚均经过既有 `production` 环境，复用 `deploy-production` 并发组、ECS SSH Secrets、固定 SSH 主机公钥和 ECS 恢复目录锁。管理员须确认环境要求独立 reviewer、禁止自审及管理员绕过，并限定 `main`。GitHub 审批记录和经批准的变更单编号均需保留。

发布工作流读取固定 artifact 的 REST 元数据，验证仓库、源 run、来源工作流、成功结果、main 和提交，再下载原始 ZIP。校验外层 SHA256、内层 SHA256 和 release manifest，在 runner 解包并仅传输 Web 与经审阅的控制脚本。ECS 复用现有静态资源事务，校验文件完整性，增量增加静态资源，保留旧 chunk。候选先在本机临时端口经 GET 验收，再切换 `mateyou-web`，验收直连和公开域名双语页面、BUILD_ID 及静态文件哈希，核对 API PID、脚本和只读存活端点后保存 PM2 并更新活动记录。失败时尝试切回原 Web。工作流没有构建步骤、API 切换、数据库命令或询盘 POST。

回滚工作流只接受环境批准的健康 release ID。目标必须同时匹配当次批准值和健康清单，在固定目录内具有历史记录、可校验的 Web 文件及已发布静态资源。预检和切换复用发布事务，回滚保留 API 进程和数据库。当前活动版本即便页面失效，也可在记录、磁盘和 API 进程检查通过后进入回滚。切换后如未通过验收，尝试恢复操作前 Web 并重新验收。如果自动恢复失败，由值班人员接管。

审计保存于 GitHub dispatch 和 environment 审批记录、Actions 日志与 ECS 私有 `host-audit.jsonl`。记录发起人、执行 SHA、审批编号、候选来源及哈希、切换和恢复结果。归档只包含脱敏审计和发布证据，生产 PM2 环境、客户信息、日志原件、SSH 密钥和数据库凭据留在既有保管系统。

## 固定候选与归档

| 字段 | 值 |
| --- | --- |
| Source SHA | `139ff275ac29920b1bb8d119ed2ad1d1262b3627` |
| Source run | `45741771535` |
| Artifact ID | `15081915933` |
| 原始 ZIP SHA256 | `168f9638bf1f8da7b2c1c51ad7c6916b1b23e3893bbf9ec9d9534a7200ffdef8` |
| 内层 tar.gz SHA256 | `16c14d7dc5dd8c848caee7e123b7fe4eb26d73d6be13d37821a1cfd9f34f5fe7` |
| Actions 到期 | 2026-12-10 02:22:43 UTC |
| 已提供的当前生产 BUILD_ID | `ZnlTrzgQe8jRRz-9KhnP_` |

到期前，用组织批准的私有版本化制品库保存原始 ZIP、原版 SHA256 清单、GitHub 来源元数据和验收证据。记录不可变对象版本和哈希，配置访问审计与保留期，并进行只读取回演练。归档目的地、保管负责人及保留期待批准。当前下载入口依赖 GitHub 保留期。到期后应停止发布，待单独评审已批准归档的取回入口。保留现有档案，避免用重跑产物替换。

## 遗留风险及审批清单

- [ ] 通过组织批准的私有交接渠道取得 Mac 的 `RELEASE-READINESS-REPORT.md`、原始 SHA256 清单、Web 发布手册、健康及回滚基线、前后验收清单。
- [ ] 对照同层级的 ZIP 或 tar.gz 哈希，确认原 Mac 验收制品和云端字节完全一致。如不一致，保持 BLOCKED，保留证据并复核来源。
- [ ] 持久归档固定 ZIP、已验证健康 Web 制品与验收记录，并演练取回。
- [ ] 由生产管理员确认环境审批和 SSH 账号权限、主机公钥、PM2 运行方式、预检端口，以及当前 BUILD_ID 对应的已验收 recovery release ID。若当前版本未纳入恢复目录，保持 BLOCKED，另行审批基线登记。
- [ ] 确认 PR 的无生产凭据 GitHub runner 核验可读原始 Actions ZIP，回滚清单中的记录真实对应已验收且仍可用的 Web。确认本机和外部路由验收、API PID 和只读健康检查、告警与值班恢复流程。
- [ ] 在代表性非生产 ECS/PM2 环境演练完整 SSH、静态发布、Web 切换、超时/强制终止后锁处理与人工恢复。运行中断或主机崩溃可能需要管理员核对实际 PM2 状态与活动记录。
- [ ] 经独立评审后在 `production` 环境填入 `LONGVON_WEB_EXPECTED_ACTIVE_BUILD`、`LONGVON_WEB_HEALTHY_RELEASES`（JSON ID 数组）。每次变更前设置对应的 `LONGVON_WEB_RELEASE_APPROVAL` 或 `LONGVON_WEB_ROLLBACK_APPROVAL`，回滚同时设置 `LONGVON_WEB_ROLLBACK_TARGET`。以上完成后单独批准启用 `LONGVON_WEB_HANDOFF_READY=true`。

## 手机端操作手册

1. 通过已登录 GitHub 的手机浏览器打开仓库 **Actions**。如移动布局隐藏 **Run workflow** 或审批按钮，切换桌面版站点。执行人员与 reviewer 按组织权限分离。
2. 发布时选 **Publish fixed Web artifact**，选 `main`，填表中 Artifact ID、Commit SHA、原始 ZIP SHA256 及当次已批准变更编号。提交后由独立 reviewer 在该 run 的环境审批页核对这些值和证据，再审批。
3. 回滚时选 **Rollback healthy Web release**，选 `main`，填当次批准的健康 release ID 与批准编号。reviewer 核对当前 BUILD_ID、回滚目标及其验收记录，再审批。
4. 在 run 中确认 `committed`，查看双语 Web 页面、静态资源、BUILD_ID 和 API 保持情况。遇到 `recovered` 记录失败并复查原 Web，遇到 `recovery-failed` 或中断交由值班人员核对，不直接重试。留存 GitHub run URL 和脱敏验收记录。业务写入验收需另行批准。

## 自动化测试记录

- 使用云端下载的真实 ZIP 运行 archive verifier，验证 ZIP、tar.gz 和 release manifest，成功提取 Web。用 GitHub REST 实际元数据运行 source verifier，通过。使用仅允许回环网络的 standalone 进程核验真实制品，6 条双语页面均返回 200，并包含候选 BUILD_ID。
- `python3 scripts/recovery/test_fixed_candidate.py` 覆盖错误 ZIP 哈希、错误源仓库/源 run 和合法来源。2 项通过。
- `node scripts/recovery/web-switch.test.cjs` 覆盖交接未批准、批准编号不匹配、非法回滚标识、发布健康失败回切、独立回滚及 API PID 漂移阻断。5 项通过。模拟事务只注入 Web、PM2 保存和只读进程检查，未使用 API 管理命令或数据库连接。
- `node scripts/rfq/release/static-transaction.test.cjs` 的 6 项增量、冲突和文件校验测试通过。
- Codex 连接器可以下载原始 ZIP，云端 shell 的直连下载进入制品存储时返回 403。PR 包含无生产凭据的 GitHub runner 下载验证，生产启用须确认该检查通过。
- 既有激活事务测试使用获准的云端回环网络权限运行，7 项通过。新入口的 Actions 审批、实际 ECS/PM2 和生产外部请求未执行。

## LV-DUAL-ENV-001 follow-up

The Mac verified the original ZIP against the private longvon-ops Release archive and retained its release-readiness report. Internal operations/handover/recovery documents now live in that PRIVATE repository, not duplicated here. The repository above remains PUBLIC. Candidate metadata is loaded from a separately reviewed private JSON policy and pinned by SHA256; its artifact-verification approval does not authorize production deployment. Retrieval supports the original Actions path or the pinned private Release asset plus frozen provenance, so archival retrieval survives original Actions retention.

PR tests generate independent synthetic archives rather than downloading expiring historical artifacts on every run. Python3.9-compatible strict decoding and extraction verify ZIP, tar and both manifests; traversal/duplicate/non-file entries fail closed. Real PM2 rehearsals run with dedicated PM2_HOME and loopback-only endpoints in /tmp/lv-dual-*; this is not production ECS or Codex Cloud verification. Interrupted transaction reconciliation requires a dead same-host lock owner, an approved baseline, recognized actual and recorded Web versions, stable API PID and preserved static files. Live/unknown locks fail closed. The private transaction journal contains the PM2 environment and must never be exported.

Production remains BLOCKED: read-only environment verification returned no required reviewers and no branch restriction. New publish/rollback workflows now check independent-review settings before the production job can obtain credentials. Do not enable HANDOFF_READY or configure new credentials without a separately approved administrator operation. An actual Codex Cloud executor/checkout is not attached to the Mac chat; a remote connector and a GitHub Linux runner are separate capabilities and cannot be labeled CLOUD READY. Keep Draft; no production operation performed.
