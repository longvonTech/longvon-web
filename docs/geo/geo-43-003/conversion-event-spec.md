# 商业转化事件规范（设计，尚未上线）

类型：geo_cta_click、rfq_start、rfq_submit_success、qualified_lead、sample_order_confirmed、odm_contract_signed、pilot_order_confirmed、production_order_confirmed。

每条包含event_id(UUID)、occurred_at(带时区)、event_type、source、landing_page(去除敏感查询参数)、rfq_id/customer_id(私有系统内不透明标识)、is_test、evidence_ref、recorded_by。点击/开始尚无RFQ时关联标识允许null，提交后由私有映射关联，不能虚构RFQ ID。公开分析不传姓名、电话、邮箱或客户内容；商业证据和映射仅留授权私有系统，仓库仅规范和合成样例。

- geo_cta_click：真实商业CTA点击，不能解释为询盘；PR24现用oem_cta_click，尚未合并。后续迁移需统一名称/去重，不同时统计两个事件。
- rfq_start：首次开始填写，按会话去重，不是合格线索。
- rfq_submit_success：服务端确认有效持久化的真实提交；honeypot假成功不得入统计。前端事件仅分析信号，服务端RFQ记录为统计权威，重复刷新/网络重发按event_id与RFQ ID去重。
- qualified_lead：授权人工审核，记录证据、人员、时间和判定；ODM按实际需求与cooperationType审核，不能靠CTA interest前缀自动认定。
- 后四个商业事件：分别须有已确认样品订单、已签ODM合同、已确认试产订单、已确认量产订单的业务证据。询价、提交、数量预测及未付款样品需求不能自动升级。

金额分别保存quoted/contracted/paid/forecast，带币种及证据；未取到为UNKNOWN，不将报价或预测计入回款。订单确认与付款分开，已确认不能默认为已付款。撤销/退款用追加更正记录，不删历史。

测试：is_test优先服从服务端及人工测试标记，前端缺失标记不能变成真实线索；测试域名、明确TEST标识和隔离环境均排除，历史原始记录不物理删除。商业汇总同时排除测试、重复、垃圾和已撤销项，并披露规则/分母。

本规范不声称完整事件管道已经实现；现有前端事件缺少唯一ID/服务端关联的差异需独立工程PR，不能只靠文档视为通过。
