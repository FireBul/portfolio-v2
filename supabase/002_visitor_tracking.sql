-- ============================================================
-- 방문자 행동 추적 확장: page_views + page_events + visitors IP/ASN
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. visitors 테이블에 IP/ASN 컬럼 추가
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS asn text;

-- 2. page_views 테이블 (페이지별 체류/스크롤 추적)
CREATE TABLE page_views (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    timestamptz NOT NULL DEFAULT now(),
  visitor_id    text        NOT NULL,
  session_id    text        NOT NULL,
  page_path     text        NOT NULL,
  entered_at    timestamptz NOT NULL DEFAULT now(),
  exited_at     timestamptz,
  duration_ms   integer,
  scroll_depth  integer     DEFAULT 0 CHECK (scroll_depth >= 0 AND scroll_depth <= 100),
  referrer_page text,
  exit_trigger  text,
  viewport_w    integer,
  viewport_h    integer
);

CREATE INDEX idx_pv_visitor   ON page_views (visitor_id);
CREATE INDEX idx_pv_session   ON page_views (session_id);
CREATE INDEX idx_pv_page_path ON page_views (page_path);
CREATE INDEX idx_pv_entered   ON page_views (entered_at);

-- 3. page_events 테이블 (CTA 클릭, 폼 제출 등 이벤트)
CREATE TABLE page_events (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  visitor_id   text        NOT NULL,
  session_id   text        NOT NULL,
  page_path    text        NOT NULL,
  event_type   text        NOT NULL,
  event_target text,
  event_data   jsonb       DEFAULT '{}'
);

CREATE INDEX idx_pe_visitor ON page_events (visitor_id);
CREATE INDEX idx_pe_session ON page_events (session_id);
CREATE INDEX idx_pe_type    ON page_events (event_type);

-- 4. RLS: page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON page_views
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_read" ON page_views
  FOR SELECT TO anon USING (true);

CREATE POLICY "block_update" ON page_views
  FOR UPDATE TO anon USING (false);

CREATE POLICY "block_delete" ON page_views
  FOR DELETE TO anon USING (false);

-- 5. RLS: page_events
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON page_events
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_read" ON page_events
  FOR SELECT TO anon USING (true);

CREATE POLICY "block_update" ON page_events
  FOR UPDATE TO anon USING (false);

CREATE POLICY "block_delete" ON page_events
  FOR DELETE TO anon USING (false);

-- 6. 집계 뷰: 페이지별 요약
CREATE OR REPLACE VIEW page_view_summary AS
SELECT
  page_path,
  COUNT(*)                                    AS total_views,
  COUNT(DISTINCT visitor_id)                  AS unique_visitors,
  ROUND(AVG(duration_ms) / 1000.0, 1)        AS avg_duration_sec,
  ROUND(AVG(scroll_depth)::numeric, 0)       AS avg_scroll_depth,
  COUNT(*) FILTER (WHERE scroll_depth >= 75)  AS deep_readers
FROM page_views
WHERE duration_ms IS NOT NULL
GROUP BY page_path
ORDER BY total_views DESC;
