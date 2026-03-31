import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getSupabase, getVisitorId } from '../utils/supabase';
import { getSessionId } from '../utils/analytics';

/**
 * SPA route 변경을 감지하여 page_views 테이블에 기록하는 훅.
 * - 진입 시: entered_at 기록, 스크롤 추적 시작
 * - 이탈 시 (route 변경 or beforeunload): INSERT 1회
 * - 500ms 미만 방문은 노이즈로 무시
 */
export function usePageTracking(): void {
  const location = useLocation();
  const enteredAtRef = useRef<number>(Date.now());
  const maxScrollRef = useRef<number>(0);
  const prevPathRef = useRef<string | null>(null);
  const currentPathRef = useRef<string>(location.pathname);

  const flushPageView = useCallback((exitTrigger: string = 'navigation') => {
    const duration = Date.now() - enteredAtRef.current;
    if (duration < 500) return;

    const payload = {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      page_path: currentPathRef.current,
      entered_at: new Date(enteredAtRef.current).toISOString(),
      exited_at: new Date().toISOString(),
      duration_ms: duration,
      scroll_depth: maxScrollRef.current,
      referrer_page: prevPathRef.current,
      exit_trigger: exitTrigger,
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
    };

    if (exitTrigger === 'close') {
      // 탭 닫기 시 fetch keepalive로 전송 (unload 생존)
      const url = import.meta.env.VITE_SUPABASE_URL as string;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
      if (url && key) {
        fetch(`${url}/rest/v1/page_views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } else {
      const sb = getSupabase();
      if (sb) {
        sb.from('page_views').insert(payload).then(({ error }) => {
          if (error) console.warn('[PageTracking] insert error:', error.message);
        });
      }
    }
  }, []);

  // 스크롤 깊이 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.round((window.scrollY / scrollHeight) * 100);
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // route 변경 감지
  useEffect(() => {
    if (prevPathRef.current !== null) {
      flushPageView('navigation');
    }

    prevPathRef.current = currentPathRef.current;
    currentPathRef.current = location.pathname;
    enteredAtRef.current = Date.now();
    maxScrollRef.current = 0;
  }, [location.pathname, flushPageView]);

  // 탭 닫기 / 브라우저 종료
  useEffect(() => {
    const handleUnload = () => flushPageView('close');
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [flushPageView]);
}
