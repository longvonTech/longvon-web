-- ============================================================
-- MATEYOU Platform — Initial Database Migration
-- 权威依据: /docs/engineering/database/logical-erd-v1.md (v1.1)
--          /docs/database/physical-database-freeze-v1.md
--
-- 重要说明（必读）：
-- 本文件为手写迁移脚本，原因：当前开发沙箱无网络访问，无法执行
-- `prisma migrate dev` 连接真实数据库自动生成迁移。本文件已尽量与
-- packages/database/prisma/schema.prisma 保持字段级一致，但以下两类内容
-- Prisma 无法原生表达，只能在此手写：
--   1) CHECK 约束（枚举值与跨列业务规则）
--   2) 表分区（PARTITION BY）与 Row Level Security（RLS）策略
-- 已知的 Prisma <-> 手写DDL 不完全对齐之处（必须在团队首次真正联网执行
-- `prisma migrate dev` 时人工核对，不能假设两者会自动保持同步）：
--   - 6张分区表（events / health.health_metrics / analytics /
--     conversation_messages / audit.audit_logs / audit.security_events）
--     在 PostgreSQL 中分区表的主键必须包含分区键列，因此这些表的主键是
--     (id, <分区列>) 复合主键，而 schema.prisma 中声明的是单列 `id @id`。
--     这是 PostgreSQL 分区机制的硬性要求，Prisma 目前不原生支持表分区，
--     使用 Prisma Client 读写这些表的应用代码不受影响（按id查询依然可行，
--     只是数据库层面的唯一性约束颗粒度变化），但运行 `prisma db pull` 时
--     会发现schema差异，需要团队成员了解这一已知差异，不要尝试"修复"它。
-- ============================================================

-- ============================================================
-- 0. 扩展与Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- uuidv7() 函数：优先尝试 pg_uuidv7 扩展（PG16/17环境），
-- 若不可用则使用下方手写实现作为后备（PG18+原生支持uuidv7()，无需任何操作）。
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_uuidv7;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_uuidv7 扩展不可用，将使用手写uuidv7()函数作为后备实现';
END $$;

CREATE OR REPLACE FUNCTION uuidv7() RETURNS uuid AS $$
DECLARE
  unix_ts_ms bytea;
  rand_bytes bytea := gen_random_bytes(10);
BEGIN
  -- 若pg_uuidv7扩展已提供同名函数，本定义不会被使用（CREATE OR REPLACE仅在未冲突时生效，
  -- 实际以扩展安装顺序为准，此处仅作沙箱环境的自洽后备实现，生产环境以运维确认的实际可用方式为准）
  unix_ts_ms := substring(int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint) FROM 3 FOR 6);
  RETURN encode(
    unix_ts_ms ||
    set_bit(set_bit(substring(rand_bytes FROM 1 FOR 2), 7, 0)::bytea, 6, 1) ||
    substring(rand_bytes FROM 3 FOR 8),
    'hex'
  )::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE SCHEMA IF NOT EXISTS health;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics_pii;

-- ============================================================
-- 1. User Domain
-- ============================================================

CREATE TABLE public.roles (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL UNIQUE,
  permissions jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.users (
  id            uuid PRIMARY KEY DEFAULT uuidv7(),
  username      text NOT NULL UNIQUE,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id       uuid NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','disabled')),
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

CREATE TABLE public.customers (
  id             uuid PRIMARY KEY DEFAULT uuidv7(),
  phone          text UNIQUE,
  email          text UNIQUE,
  nickname       text,
  avatar         text,
  device_id      text,
  source_channel text,
  registered_at  timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz
);
CREATE INDEX idx_customers_device_id ON public.customers(device_id);

-- ============================================================
-- 2. Knowledge Domain 基础引用表（先于Membership/CRM创建，因后续表会引用Users/Articles等）
-- ============================================================

CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  parent_id   uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  description text,
  sort_order  int NOT NULL DEFAULT 0
);

CREATE TABLE public.tags (
  id   uuid PRIMARY KEY DEFAULT uuidv7(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE
);

CREATE TABLE public.topics (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text,
  cover_image text
);

CREATE TABLE public.authors (
  id      uuid PRIMARY KEY DEFAULT uuidv7(),
  name    text NOT NULL,
  bio     text,
  avatar  text,
  title   text,
  user_id uuid REFERENCES public.users(id) ON DELETE RESTRICT
);

CREATE TABLE public.medical_reviewers (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL,
  credentials text NOT NULL,
  license_no  text,
  bio         text,
  avatar      text
);

CREATE TABLE public.agent_tasks (
  id                  uuid PRIMARY KEY DEFAULT uuidv7(),
  agent_type          text NOT NULL CHECK (agent_type IN ('seo_research','content_writer','medical_review','growth_analyst')),
  input_params        jsonb NOT NULL,
  output_result       jsonb,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
  related_entity_type text,
  related_entity_id   uuid,
  error_log           text,
  started_at          timestamptz,
  finished_at         timestamptz
);

CREATE TABLE public.keyword_clusters (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  root_keyword text NOT NULL,
  hub_topic_id uuid REFERENCES public.topics(id) ON DELETE RESTRICT,
  description  text
);

CREATE TABLE public.articles (
  id                   uuid PRIMARY KEY DEFAULT uuidv7(),
  title                text NOT NULL,
  slug                 text NOT NULL UNIQUE,
  category_id          uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  summary              text,
  content              text NOT NULL,
  cover_image          text,
  seo_title            text,
  seo_keywords         text,
  seo_description      text,
  "references"           jsonb,
  status               text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_review','published','archived')),
  author_id            uuid REFERENCES public.authors(id) ON DELETE RESTRICT,
  reviewer_id          uuid REFERENCES public.medical_reviewers(id) ON DELETE RESTRICT,
  reviewed_at          timestamptz,
  published_at         timestamptz,
  view_count           int NOT NULL DEFAULT 0,
  source_agent_task_id uuid REFERENCES public.agent_tasks(id) ON DELETE RESTRICT,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  deleted_at           timestamptz
);
CREATE INDEX idx_articles_status_published ON public.articles(status, published_at);
CREATE INDEX idx_articles_category ON public.articles(category_id);

CREATE TABLE public.article_tags (
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE RESTRICT,
  tag_id     uuid NOT NULL REFERENCES public.tags(id) ON DELETE RESTRICT,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE public.topic_articles (
  topic_id   uuid NOT NULL REFERENCES public.topics(id) ON DELETE RESTRICT,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE RESTRICT,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (topic_id, article_id)
);

CREATE TABLE public.news (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  title        text NOT NULL,
  slug         text NOT NULL UNIQUE,
  summary      text,
  content      text NOT NULL,
  cover_image  text,
  published_at timestamptz,
  status       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published'))
);

CREATE TABLE public.knowledge_chunks (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  source_article_id uuid REFERENCES public.articles(id) ON DELETE RESTRICT,
  source_type       text NOT NULL,
  content_chunk     text NOT NULL,
  embedding         vector(1536),
  created_at        timestamptz NOT NULL DEFAULT now()
);
-- 向量索引留待实际数据量确定后按index-strategy-v1.md第3部分建HNSW索引，初始迁移不预先创建

CREATE TABLE public.knowledge_graph_nodes (
  id                 uuid PRIMARY KEY DEFAULT uuidv7(),
  type               text NOT NULL CHECK (type IN ('topic','symptom','risk_factor','product','assessment')),
  name               text NOT NULL,
  related_cluster_id uuid REFERENCES public.keyword_clusters(id) ON DELETE RESTRICT
);

CREATE TABLE public.knowledge_graph_edges (
  id             uuid PRIMARY KEY DEFAULT uuidv7(),
  source_node_id uuid NOT NULL REFERENCES public.knowledge_graph_nodes(id) ON DELETE RESTRICT,
  target_node_id uuid NOT NULL REFERENCES public.knowledge_graph_nodes(id) ON DELETE RESTRICT,
  relation_type  text NOT NULL CHECK (relation_type IN ('part_of','risk_factor_for','overlaps_with','related_to')),
  weight         numeric(5,2) NOT NULL DEFAULT 1.0
);
CREATE INDEX idx_kge_source ON public.knowledge_graph_edges(source_node_id);
CREATE INDEX idx_kge_target ON public.knowledge_graph_edges(target_node_id);

CREATE TABLE public.seo_keywords (
  id                    uuid PRIMARY KEY DEFAULT uuidv7(),
  keyword               text NOT NULL,
  search_volume         int,
  competition_score     numeric(5,2),
  trend                 text CHECK (trend IN ('rising','stable','declining')),
  recommendation_level  text CHECK (recommendation_level IN ('high','medium','low')),
  status                text NOT NULL DEFAULT 'discovered' CHECK (status IN ('discovered','in_use','rejected')),
  linked_article_id     uuid REFERENCES public.articles(id) ON DELETE RESTRICT,
  cluster_id            uuid REFERENCES public.keyword_clusters(id) ON DELETE RESTRICT,
  discovered_by_task_id uuid REFERENCES public.agent_tasks(id) ON DELETE RESTRICT,
  created_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_keywords_rec_status ON public.seo_keywords(recommendation_level, status);
CREATE INDEX idx_seo_keywords_cluster ON public.seo_keywords(cluster_id);

CREATE TABLE public.products (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  model       text,
  description text,
  spec        jsonb,
  images      jsonb,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active','discontinued'))
);

-- ============================================================
-- 3. Membership / Assessment / AI / CRM Domain
--    (assessment_results 与 conversations 必须先于 leads 创建；
--     conversations.converted_lead_id 的外键约束延后到 leads 创建后再 ALTER 添加，
--     以解决 conversations <-> leads 的循环引用)
-- ============================================================

CREATE TABLE public.memberships (
  id             uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id    uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  tier           text NOT NULL DEFAULT 'free' CHECK (tier IN ('free','premium','pro','enterprise')),
  started_at     timestamptz NOT NULL,
  expires_at     timestamptz,
  payment_status text NOT NULL DEFAULT 'none' CHECK (payment_status IN ('current','past_due','none')),
  auto_renew     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_memberships_customer ON public.memberships(customer_id);

CREATE TABLE public.assessments (
  id                   uuid PRIMARY KEY DEFAULT uuidv7(),
  type                 text NOT NULL CHECK (type IN ('osa','sleep','stress','weight_loss','diabetes','altitude')),
  questionnaire_schema jsonb NOT NULL,
  scoring_rule         jsonb NOT NULL,
  result_template      jsonb NOT NULL,
  version              text NOT NULL,
  reviewed_by          uuid REFERENCES public.medical_reviewers(id) ON DELETE RESTRICT,
  reviewed_at          timestamptz
);

CREATE TABLE public.assessment_results (
  id                  uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id         uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  assessment_type     text NOT NULL CHECK (assessment_type IN ('osa','sleep','stress','weight_loss','diabetes','altitude')),
  channel             text NOT NULL CHECK (channel IN ('web','app','ai_chat')),
  answers             jsonb NOT NULL,
  score                numeric(6,2),
  risk_level           text CHECK (risk_level IN ('low','moderate','high','very_high')),
  status               text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  definition_version   text,
  recommendations      jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_assessment_results_customer ON public.assessment_results(customer_id, assessment_type, created_at);
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversations (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id       uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  guest_session_id  uuid,
  channel           text NOT NULL,
  started_at        timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,
  resolved_intent   text,
  converted_lead_id uuid, -- 外键约束在leads表创建后通过ALTER TABLE补充
  deleted_at        timestamptz,
  CONSTRAINT chk_conversation_identity_anchor CHECK (customer_id IS NOT NULL OR guest_session_id IS NOT NULL)
);
CREATE INDEX idx_conversations_customer ON public.conversations(customer_id, started_at);
CREATE INDEX idx_conversations_guest ON public.conversations(guest_session_id) WHERE customer_id IS NULL;
CREATE UNIQUE INDEX uq_conversations_converted_lead ON public.conversations(converted_lead_id) WHERE converted_lead_id IS NOT NULL;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.leads (
  id                   uuid PRIMARY KEY DEFAULT uuidv7(),
  company_name         text,
  contact_name         text NOT NULL,
  phone                text NOT NULL,
  email                text,
  position             text,
  cooperation_type     text NOT NULL CHECK (cooperation_type IN ('hospital','pharmacy','oem','odm','distributor','enterprise')),
  remark               text,
  source_page          text,
  source_keyword       text,
  utm_source           text,
  utm_medium           text,
  utm_campaign         text,
  status               text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','converted','lost')),
  assigned_to          uuid REFERENCES public.users(id) ON DELETE RESTRICT,
  conversation_id      uuid REFERENCES public.conversations(id) ON DELETE RESTRICT,
  assessment_result_id uuid REFERENCES public.assessment_results(id) ON DELETE RESTRICT,
  customer_id          uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  deleted_at           timestamptz
);
CREATE INDEX idx_leads_status_created ON public.leads(status, created_at);
CREATE INDEX idx_leads_assigned ON public.leads(assigned_to);

-- LeadNote：TASK-104新增表，仅追加写入，不提供UPDATE/DELETE接口（与AuditLogs同一设计哲学）
CREATE TABLE public.lead_notes (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  lead_id    uuid NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
  author_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lead_notes_lead ON public.lead_notes(lead_id, created_at);

ALTER TABLE public.conversations
  ADD CONSTRAINT fk_conversations_converted_lead
  FOREIGN KEY (converted_lead_id) REFERENCES public.leads(id) ON DELETE RESTRICT;

CREATE TABLE public.partners (
  id                     uuid PRIMARY KEY DEFAULT uuidv7(),
  company_name           text NOT NULL,
  type                   text NOT NULL CHECK (type IN ('hospital','pharmacy','oem','odm','distributor','enterprise')),
  contact_info           jsonb NOT NULL,
  region                 text,
  contract_status        text NOT NULL DEFAULT 'pending' CHECK (contract_status IN ('pending','active','terminated')),
  converted_from_lead_id uuid UNIQUE REFERENCES public.leads(id) ON DELETE RESTRICT,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscriptions (
  id                   uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id          uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  membership_id        uuid NOT NULL REFERENCES public.memberships(id) ON DELETE RESTRICT,
  plan_tier            text NOT NULL,
  billing_cycle        text NOT NULL CHECK (billing_cycle IN ('monthly','yearly')),
  amount               numeric(12,2) NOT NULL,
  currency             text NOT NULL DEFAULT 'CNY',
  status               text NOT NULL DEFAULT 'active' CHECK (status IN ('active','past_due','canceled','expired')),
  current_period_start timestamptz NOT NULL,
  current_period_end   timestamptz NOT NULL,
  payment_gateway_ref  text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subscriptions_customer_status ON public.subscriptions(customer_id, status);
CREATE INDEX idx_subscriptions_period_end ON public.subscriptions(current_period_end);
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.orders (
  id               uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id      uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  order_no         text NOT NULL UNIQUE,
  product_id       uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity         int NOT NULL DEFAULT 1,
  unit_price       numeric(12,2) NOT NULL,
  currency         text NOT NULL DEFAULT 'CNY',
  total_amount     numeric(12,2) NOT NULL,
  payment_status   text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded','canceled')),
  payment_method   text,
  shipping_address jsonb,
  placed_at        timestamptz NOT NULL DEFAULT now(),
  fulfilled_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.conversation_messages (
  id                  uuid NOT NULL DEFAULT uuidv7(),
  conversation_id     uuid NOT NULL REFERENCES public.conversations(id) ON DELETE RESTRICT,
  role                text NOT NULL CHECK (role IN ('user','assistant','system')),
  content             text NOT NULL,
  retrieved_chunk_ids jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);
CREATE INDEX idx_conversation_messages_conv ON public.conversation_messages(conversation_id, created_at);
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversation_feedback (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  conversation_id uuid NOT NULL UNIQUE REFERENCES public.conversations(id) ON DELETE RESTRICT,
  rating          int NOT NULL,
  comment         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. Analytics Domain
-- ============================================================

CREATE TABLE public.events (
  id             uuid NOT NULL DEFAULT uuidv7(),
  customer_id    uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  session_id     text,
  event_type     text NOT NULL,
  event_category text CHECK (event_category IN ('website','ai','membership','commerce','assessment')),
  channel        text,
  properties     jsonb,
  occurred_at    timestamptz NOT NULL,
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);
CREATE INDEX idx_events_customer ON public.events(customer_id, occurred_at);
CREATE INDEX idx_events_type ON public.events(event_type, occurred_at);

CREATE TABLE public.analytics (
  id                      uuid NOT NULL DEFAULT uuidv7(),
  date                    date NOT NULL,
  page_path               text NOT NULL,
  pv                      int NOT NULL DEFAULT 0,
  uv                      int NOT NULL DEFAULT 0,
  traffic_source          text,
  matched_keyword         text,
  baidu_ranking_position  int,
  baidu_index_status      text,
  conversion_count        int NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, date)
) PARTITION BY RANGE (date);
CREATE INDEX idx_analytics_date_path ON public.analytics(date, page_path);

CREATE TABLE public.data_source_connections (
  id             uuid PRIMARY KEY DEFAULT uuidv7(),
  source_type    text NOT NULL CHECK (source_type IN ('baidu_tongji','baidu_ziyuan','baidu_push')),
  credentials    jsonb NOT NULL,
  status         text NOT NULL DEFAULT 'active' CHECK (status IN ('active','error','disabled')),
  last_synced_at timestamptz
);

CREATE TABLE analytics_pii.customer_profiles (
  customer_id        uuid PRIMARY KEY REFERENCES public.customers(id) ON DELETE RESTRICT,
  device_id          text,
  membership_level   text,
  risk_profile       jsonb,
  assessment_history jsonb,
  chat_history       jsonb,
  crm_status         text,
  lifetime_value     numeric(12,2),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE analytics_pii.customer_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. Health Domain（独立schema）
-- ============================================================

CREATE TABLE health.health_metrics (
  id            uuid NOT NULL DEFAULT uuidv7(),
  customer_id   uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  device_id     text,
  metric_type   text NOT NULL, -- 不加CHECK，应用层白名单校验（兼容未来设备类型扩展）
  value         numeric(12,4) NOT NULL, -- 冻结裁定：本列需pgcrypto列级加密，见本文件末尾加密设置
  unit          text,
  recorded_at   timestamptz NOT NULL,
  sync_batch_id uuid,
  PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);
CREATE INDEX idx_health_metrics_customer ON health.health_metrics(customer_id, metric_type, recorded_at);
ALTER TABLE health.health_metrics ENABLE ROW LEVEL SECURITY;

CREATE TABLE health.health_risk_profiles (
  id                          uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id                 uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  risk_type                   text NOT NULL,
  risk_level                  text NOT NULL CHECK (risk_level IN ('low','moderate','high','very_high')),
  basis                       text,
  computed_at                 timestamptz NOT NULL,
  related_assessment_result_id uuid REFERENCES public.assessment_results(id) ON DELETE RESTRICT
);
CREATE INDEX idx_health_risk_profiles_customer ON health.health_risk_profiles(customer_id, risk_type, computed_at);
ALTER TABLE health.health_risk_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. Notification Domain
-- ============================================================

CREATE TABLE public.notification_logs (
  id                  uuid PRIMARY KEY DEFAULT uuidv7(),
  customer_id         uuid NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  channel             text NOT NULL CHECK (channel IN ('email','sms','push','in_app')),
  template_code       text NOT NULL,
  status              text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','read')),
  related_entity_type text,
  related_entity_id   uuid,
  sent_at             timestamptz,
  read_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notification_logs_customer ON public.notification_logs(customer_id, created_at);
CREATE INDEX idx_notification_logs_status ON public.notification_logs(status);
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. 安全/审计（独立schema）
-- ============================================================

CREATE TABLE audit.audit_logs (
  id          uuid NOT NULL DEFAULT uuidv7(),
  user_id     uuid REFERENCES public.users(id) ON DELETE RESTRICT,
  action      text NOT NULL,
  target_type text,
  target_id   uuid,
  ip_address  inet,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE audit.security_events (
  id          uuid NOT NULL DEFAULT uuidv7(),
  event_type  text NOT NULL,
  severity    text NOT NULL CHECK (severity IN ('low','medium','high')),
  actor_type  text NOT NULL CHECK (actor_type IN ('customer','user','ai_service','system')),
  actor_id    uuid,
  target_type text,
  target_id   uuid,
  ip_address  inet,
  metadata    jsonb,
  occurred_at timestamptz NOT NULL,
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);
CREATE INDEX idx_security_events_severity ON audit.security_events(severity, occurred_at);
CREATE INDEX idx_security_events_actor ON audit.security_events(actor_id, occurred_at);
CREATE INDEX idx_security_events_type ON audit.security_events(event_type, occurred_at);

-- ============================================================
-- 8. 初始分区创建（六张分区表各建当月+次月分区，运维需配置pg_partman或定时任务持续追加未来分区）
-- ============================================================

DO $$
DECLARE
  this_month date := date_trunc('month', now());
  next_month date := date_trunc('month', now()) + interval '1 month';
  month_after date := date_trunc('month', now()) + interval '2 month';
BEGIN
  EXECUTE format('CREATE TABLE public.events_%s PARTITION OF public.events FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE public.events_%s PARTITION OF public.events FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);

  EXECUTE format('CREATE TABLE health.health_metrics_%s PARTITION OF health.health_metrics FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE health.health_metrics_%s PARTITION OF health.health_metrics FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);

  EXECUTE format('CREATE TABLE public.analytics_%s PARTITION OF public.analytics FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE public.analytics_%s PARTITION OF public.analytics FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);

  EXECUTE format('CREATE TABLE public.conversation_messages_%s PARTITION OF public.conversation_messages FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE public.conversation_messages_%s PARTITION OF public.conversation_messages FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);

  EXECUTE format('CREATE TABLE audit.audit_logs_%s PARTITION OF audit.audit_logs FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE audit.audit_logs_%s PARTITION OF audit.audit_logs FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);

  EXECUTE format('CREATE TABLE audit.security_events_%s PARTITION OF audit.security_events FOR VALUES FROM (%L) TO (%L)', to_char(this_month,'YYYYMM'), this_month, next_month);
  EXECUTE format('CREATE TABLE audit.security_events_%s PARTITION OF audit.security_events FOR VALUES FROM (%L) TO (%L)', to_char(next_month,'YYYYMM'), next_month, month_after);
END $$;

-- 生产环境务必尽快接入pg_partman或等价定时任务自动维护未来分区，
-- 否则超出已创建分区范围的INSERT会直接报错（这是声明式分区表的已知行为，非bug）。

-- ============================================================
-- 9. Row Level Security 策略（对应 /docs/security/rls-policy-v1.md，8表范围）
--    会话变量由应用层在每次连接/事务开始时通过 SET LOCAL 注入，
--    具体注入时机见 apps/api/src/database/prisma.service.ts
-- ============================================================

-- Memberships
CREATE POLICY membership_isolation ON public.memberships
  USING (
    customer_id = current_setting('app.current_customer_id', true)::uuid
    OR current_setting('app.current_role', true) IN ('crm_operator','administrator','super_administrator')
  );

-- AssessmentResults
CREATE POLICY assessment_result_isolation ON public.assessment_results
  USING (
    customer_id = current_setting('app.current_customer_id', true)::uuid
    OR current_setting('app.current_role', true) = 'medical_reviewer'
  );
-- 注：Medical Reviewer的"仅限分配给自己的审核队列"约束属于业务语义，
-- RLS层面先放宽到角色级别，精确到具体审核队列的过滤在应用层Service完成
-- （呼应rls-policy-v1.md第2部分已说明的"RLS兜底+应用层叠加业务过滤"分工）。

-- HealthMetrics / HealthRiskProfiles（无内部角色例外，含SuperAdministrator）
CREATE POLICY health_metrics_isolation ON health.health_metrics
  USING (customer_id = current_setting('app.current_customer_id', true)::uuid);

CREATE POLICY health_risk_profiles_isolation ON health.health_risk_profiles
  USING (customer_id = current_setting('app.current_customer_id', true)::uuid);

-- Conversations / ConversationMessages（含匿名会话规则，TASK-030F修订）
CREATE POLICY conversation_isolation ON public.conversations
  USING (
    customer_id = current_setting('app.current_customer_id', true)::uuid
    OR (customer_id IS NULL AND guest_session_id = current_setting('app.current_guest_session_id', true)::uuid)
    OR (current_setting('app.current_role', true) = 'customer_support'
        AND id = current_setting('app.support_authorized_conversation_id', true)::uuid)
  );

CREATE POLICY conversation_message_isolation ON public.conversation_messages
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE
        customer_id = current_setting('app.current_customer_id', true)::uuid
        OR (customer_id IS NULL AND guest_session_id = current_setting('app.current_guest_session_id', true)::uuid)
        OR (current_setting('app.current_role', true) = 'customer_support'
            AND id = current_setting('app.support_authorized_conversation_id', true)::uuid)
    )
  );

-- CustomerProfiles（默认拒绝一切直接查询，仅elevated_access_token例外）
CREATE POLICY customer_profile_isolation ON analytics_pii.customer_profiles
  USING (
    current_setting('app.elevated_access_token', true) IS NOT NULL
    AND current_setting('app.elevated_access_token', true) <> ''
  );

-- NotificationLogs（本次TASK-031冻结新增纳入RLS范围）
CREATE POLICY notification_log_isolation ON public.notification_logs
  USING (customer_id = current_setting('app.current_customer_id', true)::uuid);

-- ============================================================
-- 10. 字段级加密（health.health_metrics.value，冻结裁定为强制要求）
-- ============================================================

-- 说明：本初始迁移暂不直接将value列改为bytea+pgcrypto加密存储，
-- 原因：该改动涉及应用层加解密逻辑同步开发（NestJS服务需要在写入前加密、读取后解密），
-- 属于Health Data Service模块编码范围而非建表脚本范围，已在Phase E Sprint 1 Review中
-- 登记为Sprint 2的明确待办，本迁移仅创建明文numeric列作为占位，
-- **不应被理解为"放弃加密要求"，而是"加密实现时机延后到对应模块编码时"**。
