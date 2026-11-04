-- GEO Benchmark 01
-- Fixed query bank Q001-Q060 and hybrid api / web_manual evidence tables.
-- Idempotent seed: re-applying updates wording in place and does not duplicate codes.

CREATE SCHEMA IF NOT EXISTS "growth";

CREATE TABLE IF NOT EXISTS "growth"."geo_queries" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "code" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "sort_order" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_queries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "geo_queries_code_key" ON "growth"."geo_queries"("code");

CREATE TABLE IF NOT EXISTS "growth"."geo_runs" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "provider" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "trigger" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'completed',
  "model_label" TEXT,
  "locale" TEXT,
  "language" TEXT,
  "operator_label" TEXT,
  "cost_acknowledged" BOOLEAN NOT NULL DEFAULT false,
  "query_count" INTEGER NOT NULL DEFAULT 0,
  "success_count" INTEGER NOT NULL DEFAULT 0,
  "failure_count" INTEGER NOT NULL DEFAULT 0,
  "error_summary" TEXT,
  "metadata" JSONB,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_runs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "geo_runs_provider_check" CHECK ("provider" IN ('gemini', 'perplexity', 'doubao')),
  CONSTRAINT "geo_runs_mode_check" CHECK ("mode" IN ('api', 'web_manual'))
);
CREATE INDEX IF NOT EXISTS "geo_runs_provider_mode_started_at_idx" ON "growth"."geo_runs"("provider", "mode", "started_at");

CREATE TABLE IF NOT EXISTS "growth"."geo_results" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "query_id" UUID NOT NULL,
  "run_id" UUID,
  "provider" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "predecessor_id" UUID,
  "model_label" TEXT,
  "query_code" TEXT NOT NULL,
  "query_text" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "captured_at" TIMESTAMP(3) NOT NULL,
  "locale" TEXT,
  "language" TEXT,
  "region" TEXT,
  "search_mode" TEXT,
  "notes" TEXT,
  "screenshot_ref" TEXT,
  "raw_answer" TEXT NOT NULL,
  "raw_response" JSONB,
  "provider_metadata" JSONB,
  "capture_status" TEXT NOT NULL DEFAULT 'complete',
  "review_status" TEXT NOT NULL DEFAULT 'pending',
  "error_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_results_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "geo_results_provider_check" CHECK ("provider" IN ('gemini', 'perplexity', 'doubao')),
  CONSTRAINT "geo_results_mode_check" CHECK ("mode" IN ('api', 'web_manual')),
  CONSTRAINT "geo_results_origin_check" CHECK ("origin" IN ('api', 'web_manual')),
  CONSTRAINT "geo_results_capture_status_check" CHECK ("capture_status" IN ('draft', 'complete')),
  CONSTRAINT "geo_results_review_status_check" CHECK ("review_status" IN ('pending', 'reviewed', 'excluded', 'needs_recheck'))
);
CREATE INDEX IF NOT EXISTS "geo_results_provider_mode_review_status_idx" ON "growth"."geo_results"("provider", "mode", "review_status");
CREATE INDEX IF NOT EXISTS "geo_results_query_code_provider_mode_idx" ON "growth"."geo_results"("query_code", "provider", "mode");
CREATE INDEX IF NOT EXISTS "geo_results_captured_at_idx" ON "growth"."geo_results"("captured_at");

CREATE TABLE IF NOT EXISTS "growth"."geo_citations" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "result_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "title" TEXT,
  "url" TEXT NOT NULL,
  "snippet" TEXT,
  "provider_metadata" JSONB,
  CONSTRAINT "geo_citations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "geo_citations_result_id_idx" ON "growth"."geo_citations"("result_id");

CREATE TABLE IF NOT EXISTS "growth"."geo_reviews" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "result_id" UUID NOT NULL,
  "score" INTEGER,
  "mention" BOOLEAN NOT NULL DEFAULT false,
  "identity_correct" BOOLEAN NOT NULL DEFAULT false,
  "supplier_candidate" BOOLEAN NOT NULL DEFAULT false,
  "active_recommendation" BOOLEAN NOT NULL DEFAULT false,
  "official_citation" BOOLEAN NOT NULL DEFAULT false,
  "independent_citation" BOOLEAN NOT NULL DEFAULT false,
  "factual_errors" BOOLEAN NOT NULL DEFAULT false,
  "rationale" TEXT NOT NULL,
  "evaluator" TEXT NOT NULL,
  "reviewed_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "geo_reviews_score_check" CHECK ("score" IS NULL OR ("score" >= 0 AND "score" <= 5))
);
CREATE UNIQUE INDEX IF NOT EXISTS "geo_reviews_result_id_key" ON "growth"."geo_reviews"("result_id");

CREATE TABLE IF NOT EXISTS "growth"."geo_audit_events" (
  "id" UUID NOT NULL DEFAULT uuidv7(),
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" UUID,
  "actor_label" TEXT,
  "payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "geo_audit_events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "geo_audit_events_action_check" CHECK ("action" IN ('create', 'edit', 'review', 'exclude', 'export', 'batch_run'))
);
CREATE INDEX IF NOT EXISTS "geo_audit_events_entity_type_entity_id_idx" ON "growth"."geo_audit_events"("entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS "geo_audit_events_action_created_at_idx" ON "growth"."geo_audit_events"("action", "created_at");

DO $$
BEGIN
  ALTER TABLE "growth"."geo_results" ADD CONSTRAINT "geo_results_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "growth"."geo_queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER TABLE "growth"."geo_results" ADD CONSTRAINT "geo_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "growth"."geo_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER TABLE "growth"."geo_results" ADD CONSTRAINT "geo_results_predecessor_id_fkey" FOREIGN KEY ("predecessor_id") REFERENCES "growth"."geo_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER TABLE "growth"."geo_citations" ADD CONSTRAINT "geo_citations_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "growth"."geo_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$
BEGIN
  ALTER TABLE "growth"."geo_reviews" ADD CONSTRAINT "geo_reviews_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "growth"."geo_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO "growth"."geo_queries" ("id", "code", "category", "text", "sort_order")
VALUES
  (uuidv7(), 'Q001', 'manufacturer_discovery', 'Which companies manufacture smart rings in China?', 1),
  (uuidv7(), 'Q002', 'manufacturer_discovery', 'Who are the leading smart ring manufacturers for international brands?', 2),
  (uuidv7(), 'Q003', 'manufacturer_discovery', 'Which smart ring manufacturers offer end-to-end product development?', 3),
  (uuidv7(), 'Q004', 'manufacturer_discovery', 'Who can manufacture custom smart rings for a startup?', 4),
  (uuidv7(), 'Q005', 'manufacturer_discovery', 'Which companies provide smart ring hardware and firmware development?', 5),
  (uuidv7(), 'Q006', 'manufacturer_discovery', 'Who are reliable smart ring OEM factories in Shenzhen?', 6),
  (uuidv7(), 'Q007', 'manufacturer_discovery', 'Which smart ring manufacturers support small-batch prototyping?', 7),
  (uuidv7(), 'Q008', 'manufacturer_discovery', 'Which companies manufacture health-monitoring smart rings?', 8),
  (uuidv7(), 'Q009', 'manufacturer_discovery', 'Who can develop a smart ring from concept to mass production?', 9),
  (uuidv7(), 'Q010', 'manufacturer_discovery', 'Recommend smart ring manufacturers with their own R&D capabilities.', 10),
  (uuidv7(), 'Q011', 'oem_odm', 'Which companies offer smart ring OEM services?', 11),
  (uuidv7(), 'Q012', 'oem_odm', 'Who provides custom smart ring ODM solutions?', 12),
  (uuidv7(), 'Q013', 'oem_odm', 'Which manufacturers support private-label smart rings?', 13),
  (uuidv7(), 'Q014', 'oem_odm', 'Who can customize smart ring appearance, hardware and software?', 14),
  (uuidv7(), 'Q015', 'oem_odm', 'Which suppliers can manufacture smart rings for a wearable brand?', 15),
  (uuidv7(), 'Q016', 'oem_odm', 'Who can help a healthcare startup launch its own smart ring?', 16),
  (uuidv7(), 'Q017', 'oem_odm', 'Which manufacturers support EVT, DVT and PVT for smart rings?', 17),
  (uuidv7(), 'Q018', 'oem_odm', 'Who can review a smart ring PCB and BOM for manufacturing?', 18),
  (uuidv7(), 'Q019', 'oem_odm', 'Which companies can take over smart ring PCBA and final assembly?', 19),
  (uuidv7(), 'Q020', 'oem_odm', 'Recommend smart ring ODM partners for a new digital health product.', 20),
  (uuidv7(), 'Q021', 'health_monitoring', 'Which smart ring manufacturers develop sleep monitoring?', 21),
  (uuidv7(), 'Q022', 'health_monitoring', 'Who manufactures smart rings with respiratory health monitoring?', 22),
  (uuidv7(), 'Q023', 'health_monitoring', 'Which smart ring manufacturers work on sleep apnea screening technology?', 23),
  (uuidv7(), 'Q024', 'health_monitoring', 'Who can develop wearable devices for OSA risk screening?', 24),
  (uuidv7(), 'Q025', 'health_monitoring', 'Which manufacturers combine PPG sensing with health algorithms?', 25),
  (uuidv7(), 'Q026', 'health_monitoring', 'Who can develop smart rings with SpO2 and HRV monitoring?', 26),
  (uuidv7(), 'Q027', 'health_monitoring', 'Which companies provide smart ring solutions for digital health?', 27),
  (uuidv7(), 'Q028', 'health_monitoring', 'Who can develop health-monitoring wearables for healthcare companies?', 28),
  (uuidv7(), 'Q029', 'health_monitoring', 'Which manufacturers have experience in sleep and respiratory monitoring?', 29),
  (uuidv7(), 'Q030', 'health_monitoring', 'Recommend smart ring technology partners for health monitoring applications.', 30),
  (uuidv7(), 'Q031', 'sdk_api', 'Which smart ring manufacturers provide an SDK?', 31),
  (uuidv7(), 'Q032', 'sdk_api', 'Who offers raw PPG data access from smart rings?', 32),
  (uuidv7(), 'Q033', 'sdk_api', 'Which smart ring suppliers support cloud API integration?', 33),
  (uuidv7(), 'Q034', 'sdk_api', 'Who can provide smart ring hardware, firmware and mobile app development?', 34),
  (uuidv7(), 'Q035', 'sdk_api', 'Which companies offer customizable health algorithms for smart rings?', 35),
  (uuidv7(), 'Q036', 'sdk_api', 'Who can integrate smart ring data into a third-party health platform?', 36),
  (uuidv7(), 'Q037', 'sdk_api', 'Which manufacturers support white-label smart ring apps?', 37),
  (uuidv7(), 'Q038', 'sdk_api', 'Who can provide PPG sensor data and algorithm integration for wearables?', 38),
  (uuidv7(), 'Q039', 'sdk_api', 'Which smart ring companies support software customization for OEM clients?', 39),
  (uuidv7(), 'Q040', 'sdk_api', 'Recommend smart ring manufacturers with both hardware and software capabilities.', 40),
  (uuidv7(), 'Q041', 'international_buyers', 'Which smart ring OEM suppliers work with European healthtech startups?', 41),
  (uuidv7(), 'Q042', 'international_buyers', 'Who are smart ring manufacturers for Australian wearable brands?', 42),
  (uuidv7(), 'Q043', 'international_buyers', 'Which Chinese companies offer smart ring ODM for US startups?', 43),
  (uuidv7(), 'Q044', 'international_buyers', 'Who can manufacture smart rings for Latin American distributors?', 44),
  (uuidv7(), 'Q045', 'international_buyers', 'Which smart ring suppliers support international OEM projects?', 45),
  (uuidv7(), 'Q046', 'international_buyers', 'Who can provide smart ring samples for overseas product evaluation?', 46),
  (uuidv7(), 'Q047', 'international_buyers', 'Which smart ring manufacturers offer English-language technical support?', 47),
  (uuidv7(), 'Q048', 'international_buyers', 'Recommend smart ring manufacturers for a European digital health company.', 48),
  (uuidv7(), 'Q049', 'international_buyers', 'Who can manufacture smart rings for Japanese wearable brands?', 49),
  (uuidv7(), 'Q050', 'international_buyers', 'Which smart ring OEM companies can support global distribution partners?', 50),
  (uuidv7(), 'Q051', 'competitive_comparison', 'Compare Chinese smart ring OEM/ODM manufacturers for a healthcare startup.', 51),
  (uuidv7(), 'Q052', 'competitive_comparison', 'LONGVON vs J-Style: which is better for smart ring OEM/ODM?', 52),
  (uuidv7(), 'Q053', 'competitive_comparison', 'LONGVON vs Yawell: compare smart ring manufacturing capabilities.', 53),
  (uuidv7(), 'Q054', 'competitive_comparison', 'LONGVON vs Bonlala: compare smart ring OEM/ODM services.', 54),
  (uuidv7(), 'Q055', 'competitive_comparison', 'Which smart ring manufacturers provide both health algorithms and manufacturing?', 55),
  (uuidv7(), 'Q056', 'competitive_comparison', 'Which smart ring suppliers offer the strongest hardware and software integration?', 56),
  (uuidv7(), 'Q057', 'competitive_comparison', 'Who are alternatives to established smart ring brands for private-label manufacturing?', 57),
  (uuidv7(), 'Q058', 'competitive_comparison', 'Which manufacturers are suitable for a smart ring project requiring custom firmware and SDK?', 58),
  (uuidv7(), 'Q059', 'competitive_comparison', 'Recommend smart ring OEM partners with respiratory health monitoring capabilities.', 59),
  (uuidv7(), 'Q060', 'competitive_comparison', 'Which smart ring manufacturers can support a complete digital health wearable project.', 60)
ON CONFLICT ("code") DO UPDATE SET
  "category" = EXCLUDED."category",
  "text" = EXCLUDED."text",
  "sort_order" = EXCLUDED."sort_order";
