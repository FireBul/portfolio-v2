import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSessionId } from './analytics';

/* ── Supabase Client (lazy singleton) ── */

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
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

/* ── A/B Event Tracking ── */

const TEST_NAME = 'cta_text_v1';

type EventType = 'assignment' | 'impression' | 'click';

export async function trackABEvent(
  variant: 'A' | 'B',
  eventType: EventType,
  pagePath?: string,
): Promise<void> {
  if (eventType !== 'click') {
    const dedupeKey = `ab_sent_${TEST_NAME}_${eventType}`;
    if (localStorage.getItem(dedupeKey)) return;
    localStorage.setItem(dedupeKey, '1');
  }

  const sb = getSupabase();
  if (!sb) return;

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

/* ── Visitor Tracking ── */

function parseUserAgent(): { os: string; browser: string; deviceType: string } {
  const ua = navigator.userAgent;

  // OS
  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';

  // Browser
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  // Device type
  let deviceType = 'Desktop';
  if (/Mobi|Android/i.test(ua) && !/iPad/i.test(ua)) deviceType = 'Mobile';
  else if (/iPad|Tablet/i.test(ua) || (screen.width >= 768 && screen.width <= 1024 && 'ontouchstart' in window)) deviceType = 'Tablet';

  return { os, browser, deviceType };
}

export async function trackVisitor(): Promise<void> {
  const dedupeKey = 'visitor_tracked';
  if (localStorage.getItem(dedupeKey)) return;
  localStorage.setItem(dedupeKey, '1');

  const sb = getSupabase();
  if (!sb) return;

  const { os, browser, deviceType } = parseUserAgent();
  const screenRes = `${screen.width}x${screen.height}`;
  const language = navigator.language || 'unknown';
  const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';

  // IP geolocation (fire-and-forget, non-blocking)
  let country = 'unknown';
  let city = 'unknown';
  try {
    const geo = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (geo.ok) {
      const data = await geo.json();
      country = data.country_name || 'unknown';
      city = data.city || 'unknown';
    }
  } catch {
    // geolocation 실패해도 무시
  }

  try {
    const { error } = await sb.from('visitors').upsert({
      visitor_id: getVisitorId(),
      os,
      browser,
      device_type: deviceType,
      screen_res: screenRes,
      language,
      referrer,
      country,
      city,
      timezone,
    }, { onConflict: 'visitor_id' });
    if (error) console.warn('[Visitor] upsert error:', error.message);
  } catch (err) {
    console.warn('[Visitor] network error:', err);
  }
}

/* ── A/B Stats Aggregation ── */

export interface ABStats {
  a: { visitors: number; clicks: number; rate: number };
  b: { visitors: number; clicks: number; rate: number };
  total: number;
  winner: 'A' | 'B';
  lift: number;
  significance: string;
}

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

/* ── Visitor Analytics ── */

export interface VisitorStats {
  total: number;
  os: Record<string, number>;
  browser: Record<string, number>;
  device: Record<string, number>;
  country: Record<string, number>;
  topReferrers: Record<string, number>;
}

export async function fetchVisitorStats(): Promise<VisitorStats | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb.from('visitors').select('os, browser, device_type, country, referrer');
    if (error || !data) return null;

    const os: Record<string, number> = {};
    const browser: Record<string, number> = {};
    const device: Record<string, number> = {};
    const country: Record<string, number> = {};
    const referrer: Record<string, number> = {};

    for (const row of data) {
      os[row.os || 'Unknown'] = (os[row.os || 'Unknown'] || 0) + 1;
      browser[row.browser || 'Unknown'] = (browser[row.browser || 'Unknown'] || 0) + 1;
      device[row.device_type || 'Unknown'] = (device[row.device_type || 'Unknown'] || 0) + 1;
      country[row.country || 'Unknown'] = (country[row.country || 'Unknown'] || 0) + 1;
      referrer[row.referrer || 'direct'] = (referrer[row.referrer || 'direct'] || 0) + 1;
    }

    return { total: data.length, os, browser, device, country, topReferrers: referrer };
  } catch {
    return null;
  }
}
