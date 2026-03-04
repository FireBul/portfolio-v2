import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSessionId } from './analytics';

/* ── Supabase Client (lazy singleton) ── */

let client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}

/* ── Anonymous Visitor ID ── */

const VISITOR_KEY = 'ab_visitor_id';

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/* ── Event Tracking ── */

const TEST_NAME = 'cta_text_v1';

type EventType = 'assignment' | 'impression' | 'click';

/**
 * Fire-and-forget A/B event tracker.
 * - assignment / impression: localStorage로 중복 방지 (visitor당 1회)
 * - click: 매 클릭 기록
 */
export async function trackABEvent(
  variant: 'A' | 'B',
  eventType: EventType,
  pagePath?: string,
): Promise<void> {
  // assignment, impression은 visitor당 1회만
  if (eventType !== 'click') {
    const dedupeKey = `ab_sent_${TEST_NAME}_${eventType}`;
    if (localStorage.getItem(dedupeKey)) return;
    localStorage.setItem(dedupeKey, '1');
  }

  const sb = getSupabase();
  if (!sb) return; // 환경변수 없으면 silent no-op

  try {
    const { error } = await sb.from('ab_events').insert({
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      test_name: TEST_NAME,
      variant,
      event_type: eventType,
      page_path: pagePath ?? window.location.pathname,
    });
    if (error) console.warn('[AB] insert error:', error.message);
  } catch (err) {
    console.warn('[AB] network error (non-blocking):', err);
  }
}

/* ── Aggregation ── */

export interface ABStats {
  a: { visitors: number; clicks: number; rate: number };
  b: { visitors: number; clicks: number; rate: number };
  total: number;
  winner: 'A' | 'B';
  lift: number;
  significance: string;
}

/**
 * ab_test_summary 뷰에서 실시간 통계 fetch.
 * Supabase 미설정/오프라인이면 null 반환.
 */
export async function fetchABStats(): Promise<ABStats | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('ab_test_summary')
      .select('*')
      .eq('test_name', TEST_NAME);

    if (error || !data) {
      console.warn('[AB] fetch stats error:', error?.message);
      return null;
    }

    const rowA = data.find((r: Record<string, unknown>) => r.variant === 'A');
    const rowB = data.find((r: Record<string, unknown>) => r.variant === 'B');

    const aVisitors = Number(rowA?.unique_visitors ?? 0);
    const bVisitors = Number(rowB?.unique_visitors ?? 0);
    const aClicks = Number(rowA?.unique_clickers ?? 0);
    const bClicks = Number(rowB?.unique_clickers ?? 0);
    const aRate = Number(rowA?.click_rate ?? 0);
    const bRate = Number(rowB?.click_rate ?? 0);
    const total = aVisitors + bVisitors;
    const winner: 'A' | 'B' = aRate >= bRate ? 'A' : 'B';
    const lift = Math.abs(aRate - bRate);

    let significance: string;
    if (total < 30) significance = '데이터 수집 중...';
    else if (lift > 15) significance = '~95%';
    else if (lift > 8) significance = '~80%';
    else significance = '아직 불확실';

    return {
      a: { visitors: aVisitors, clicks: aClicks, rate: aRate },
      b: { visitors: bVisitors, clicks: bClicks, rate: bRate },
      total,
      winner,
      lift,
      significance,
    };
  } catch (err) {
    console.warn('[AB] fetchABStats network error:', err);
    return null;
  }
}
