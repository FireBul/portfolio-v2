-- ============================================================
-- A/B 테스트 이벤트 테이블 + RLS + 집계 뷰
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. 이벤트 테이블
CREATE TABLE ab_events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  visitor_id  text        NOT NULL,
  session_id  text        NOT NULL,
  test_name   text        NOT NULL DEFAULT 'cta_text_v1',
  variant     text        NOT NULL CHECK (variant IN ('A', 'B')),
  event_type  text        NOT NULL CHECK (event_type IN ('assignment', 'impression', 'click')),
  page_path   text,
  metadata    jsonb       DEFAULT '{}'
);

CREATE INDEX idx_ab_test_variant_type ON ab_events (test_name, variant, event_type);
CREATE INDEX idx_ab_visitor_test_type ON ab_events (visitor_id, test_name, event_type);

-- 2. Row Level Security
ALTER TABLE ab_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON ab_events
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_read" ON ab_events
  FOR SELECT TO anon USING (true);

CREATE POLICY "block_update" ON ab_events
  FOR UPDATE TO anon USING (false);

CREATE POLICY "block_delete" ON ab_events
  FOR DELETE TO anon USING (false);

-- 3. 집계 뷰 (ABTestReveal 패널에서 사용)
CREATE OR REPLACE VIEW ab_test_summary AS
SELECT
  test_name,
  variant,
  COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'impression')  AS unique_visitors,
  COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'click')       AS unique_clickers,
  CASE
    WHEN COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'impression') = 0 THEN 0
    ELSE ROUND(
      COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'click')::numeric /
      COUNT(DISTINCT visitor_id) FILTER (WHERE event_type = 'impression')::numeric * 100,
      1
    )
  END AS click_rate
FROM ab_events
GROUP BY test_name, variant;
