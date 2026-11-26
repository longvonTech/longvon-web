# 统一搜索观测结构

执行入口：`python3 scripts/geo/monitoring/record.py <reviewed-observation.json>`。仅保存人工核对后的实际观测，不发起搜索、模型请求或自动重试，不使用付费服务。失败以非零退出，不覆盖历史记录。

字段必须完整且不能增加未声明字段：

- record_id：UUID；query_id/query：严格匹配query-set.csv原文。
- platform：Google / ChatGPT / Perplexity；mode：实际搜索/模型模式，不可见UNKNOWN。
- observed_at：带时区ISO8601实际过去时间；country：实际验证国家或UNKNOWN；language：en；environment：浏览器、登录状态、模型可见版本、位置核实方式等非敏感说明。
- availability：COMPLETED或UNAVAILABLE。NOT_RUN不创建虚假观测。UNAVAILABLE的出现/排名/正文/引用字段为null，不是false。
- longvon_present：bool或null；organic_rank：Google自然结果正整数或null，广告/AI不得混排；ai_body_recommended：bool或null；source_cited：bool或null。正文中仅提名而无推荐时，appearance可true，recommendation需人工判断并附证据。
- cited_urls：实际HTTPS来源URL数组；competitors：最多5项，每项name/url/position/evidence_quote，以实际原文留证。
- evidence：至少1项path/sha256；文件必须在本目录evidence内，哈希逐项校验。公开仓库只收脱敏结果或公开截图，不能保存账号、私聊、客户或Cookie。可核验的原始结果文件可替代截图，但不能只有分析者结论。
- previous_record_id：上一可比UUID或null；change_note：变化、不可比原因或首次记录说明。引用上一记录时固定Query/平台/模式/国家/语言/环境且时间必须递增。

观测文件排他创建为observations/<UUID>.json。工具拒绝同ID覆盖；仓库本身不提供不可变存储权限，代码审查须拒绝修改历史证据。补正用新UUID并在change_note标明更正关系。不得把合成单测数据放入正式observations。

指标：完成覆盖=有效完成观测/计划36条，并单列UNAVAILABLE。出现率=出现的完成观测/有效完成观测；AI正文推荐率只用适用AI模式且有明确判定的完成观测；引用率同理。未观测/未知模式不入成功或失败分母，报告须披露缺失。跨期环境变更不可直接计算排名提升。
