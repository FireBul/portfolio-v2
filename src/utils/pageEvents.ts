import { getSupabase, getVisitorId } from './supabase';
import { getSessionId } from './analytics';

/**
 * 페이지 이벤트를 page_events 테이블에 기록 (fire-and-forget).
 *
 * @example
 * trackPageEvent('cta_click', 'hero_projects_cta', { variant: 'A' })
 * trackPageEvent('project_card_click', 'ads-result')
 * trackPageEvent('contact_form_submit')
 */
export async function trackPageEvent(
  eventType: string,
  eventTarget?: string,
  eventData?: Record<string, unknown>,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { error } = await sb.from('page_events').insert({
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_path: window.location.pathname,
      event_type: eventType,
      event_target: eventTarget,
      event_data: eventData ?? {},
    });
    if (error) console.warn('[PageEvent] insert error:', error.message);
  } catch (err) {
    console.warn('[PageEvent] network error:', err);
  }
}
