# GEO-43-004 修改、来源与采购价值

实现基线：PR #24 最新头 `ff789513e7afac9b632225c2eecde70cd5515f1e`；main当时为`62ae62e`。独立实现分支，不修改PR24。Draft PR #29以PR24分支为base，使审核差异只包含本任务；不应跳过PR24的独立审核。

## Manufacturer：中英文同步

- 修改前：首屏反复描述制造商/OEM/ODM身份，没有直接询盘按钮；正文以12项能力、客户类型、合作模式与多个技术链接展开，OEM与ODM区别较晚且不突出。
- 修改后：H1明确深圳制造商身份；首屏给出项目询盘和技术采购路径；正文先区分Ring1/Ring1C现有平台标准OEM与定制ODM，再用7项职责组织硬件/传感器、固件、健康算法、App、SDK、云端API与制造支持。保留PR24的样品至量产路径链接，不再复制其完整阶段模块。
- MOQ：直接复用`OEM_JOURNEY_COPY[locale].moq`，不维护第二份数字政策；1,000件仅限Ring1/Ring1C现有平台标准OEM。定制ODM单独评估，配置/报价另行确认，不公开500件试产数量。共享试产简介删除“全站不公开固定MOQ”的旧泛化措辞，改为试产按项目评估、OEM/ODM条件分开；该短句也被现有OEM、RFQ和OSA合作方式使用，不改变这些页面的标题、URL、阶段功能或表单。
- 对应Query：Q01–Q05为制造商/私牌/定制与固件ODM；Q06为SDK/API制造合作。商业价值假设：让采购方更早选择现有平台或工程定制并提交有用项目资料。不是排名、有效询盘或订单增长的已验证结论。
- 来源：既有`geo.ts`实体定义、`geo-commercial.ts`基线能力、PR24的`oem-journey.ts`与`docs/geo/geo-43-002/CLAIM-SOURCES.md`。深圳身份亦为本次负责人任务的明确要求。没有新增工厂证据、产能、客户、认证、费用或交期断言。英文原有EnTrustStrip保留，未扩写其历史证据声明。
- FAQ：将重复的泛化厂家问题替换为中英文一致的3项：主体位置、受限MOQ、技术链职责；可见FAQ与JSON-LD共用同一数据。

## SDK/API：五个技术模块

- 修改前：SDK概览、100Hz长段、传感器、集成、SDK/API、客户App、算法、合作流程、授权、边界及咨询交叉重复。
- 修改后：100Hz Raw PPG Data → Smart Ring SDK → Cloud Health Algorithms → Cloud API Integration → Technical Evaluation；中英文同顺序、同锚点，页首可跳转。原100Hz锚点`#100hz-raw-ppg`和`keyword=100hz-raw-ppg`入口保持，原10项FAQ保持。
- Q07/Q08：100Hz是每秒100次采样；不自动代表连续记录、持续BLE传输、固定延迟、缓存时长或API刷新率。保留GEO-43-001原始解释及条件性接入说明；未宣称所有型号支持或已经完成临床验证。
- Q06：SDK负责约定的设备连接及数据通路；BLE是设备通信层，项目SDK接口不等于开放无限制协议。
- Q11：许多指标依赖LONGVON云端算法；设备/App/云端分工、算法授权、数据输出与Cloud API范围分别确认。未公开端点清单、认证协议、每指标API、云部署承诺或费用。
- 技术评估：将既有4项SOW范围检查和3步沟通流程移至第五模块；新增技术评估入口只传`keyword=sdk-api-evaluation`，复用现有RFQ，不编造UTM/AI获客来源、不新增字段/接口。研究用途是买方评估场景，不是医疗用途批准。
- 来源：`docs/geo/geo-43-001/CLAIM-SOURCES.md` C01–C09、main `62ae62e`的`raw-ppg.ts`、原中英文SDK页及PR24应用基线。原技术资料的PARTIAL/REVIEW等级没有升级；有条件讨论路径仍不等于正式规格或默认权益。
- 商业价值假设：原始信号研发、客户App和数字健康平台采购可分辨所需数据/授权/集成范围，减少“下载SDK即拥有全部数据或离线算法”的误解，并提交可评估项目资料。

## 保护范围、URL和风险

- Sleep Respiratory中英文源文件、标题和URL不改；Company中英文源文件不改；OEM两个页面、PR24的政策数据及RFQ处理器不改。13项受保护文件哈希门禁见`scripts/geo/procurement-protected-files.json`。
- GeoPageLayout仅新增可选heroActions；未传入的现有页面继续使用原结构。原100Hz组件只在SDK两页调用，范围/流程内容移至技术评估模块，没有另建相似SEO页。
- 第二轮实际引用与专项清单去重后26个完整URL全部只读GET核验PASS，含308别名跳转、最终200、canonical和语言；未发现需修复URL错误，未改重定向/Nginx/DNS。首次Python3.9请求未自动跟随308的原始记录保留，curl及显式逐跳读取确认正常，不能当作生产故障。
- 基线`/images/longvon-logo.png`本地缺失，两组截图都可见；本次未改导航、品牌素材或引入该缺陷，不把它写成已修复。源码/本地构建验收不证明生产询盘写库，本轮生产POST为0。
- 依据首轮e495e41和第二轮893a78e选择采购意图，不把跨轮方法变化当作排名增长，不以这些观测证明商业转化效果。

## 修改前后截图

同一Chrome默认视口、同一本机站点，before为ff789513本地dev，after为33af664本地standalone；开发指示器及打包模式差异不作视觉增长结论。额外Playwright图为1440×1100桌面、390×844手机，用于溢出与路径验收。

- 英文Manufacturer：[修改前](evidence/before-en-manufacturer.jpg) → [修改后](evidence/after-en-manufacturer.jpg)
- 中文Manufacturer：[修改前](evidence/before-zh-manufacturer.jpg) → [修改后](evidence/after-zh-manufacturer.jpg)
- 英文SDK/API：[修改前](evidence/before-en-sdk.jpg) → [修改后](evidence/after-en-sdk.jpg)
- 中文SDK/API：[修改前](evidence/before-zh-sdk.jpg) → [修改后](evidence/after-zh-sdk.jpg)
- [中文SDK手机截图](evidence/candidate/zh-sdk-after-mobile.png)、[英文Manufacturer桌面截图](evidence/candidate/en-manufacturer-after-desktop.png)；其余见candidate目录。

PR28只部分被本实现替代：Manufacturer/SDK候选由实际代码承接，Sleep/Company受本次保护不实施。建议在本PR独立审核通过后，由负责人确认PR28剩余项是明确延期还是取消，再关闭草稿；本次不擅自关闭PR28。
