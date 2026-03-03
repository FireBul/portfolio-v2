declare global {
  interface Window {
    dataLayer: any[];
  }
}

window.dataLayer = window.dataLayer || [];

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

export const getTrafficSource = () => {
  if (!sessionStorage.getItem('portfolio_traffic_source')) {
    const source = document.referrer ? new URL(document.referrer).hostname : 'direct';
    sessionStorage.setItem('portfolio_traffic_source', source);
  }
  return sessionStorage.getItem('portfolio_traffic_source');
};

export const pushToDataLayer = (eventName: string, data: any = {}) => {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    traffic_source: getTrafficSource(),
    ...data
  };
  window.dataLayer.push(payload);
  console.log('[Analytics DataLayer Push]', payload); // For demo visibility
};

export const trackPageView = (pagePath: string) => {
  pushToDataLayer('page_view', { page_path: pagePath });
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  pushToDataLayer('custom_event', {
    event_category: category,
    event_action: action,
    event_label: label,
    event_value: value
  });
};

// Scroll tracking
let maxScroll = 0;
export const initScrollTracking = () => {
  const handleScroll = () => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll >= 75 && !sessionStorage.getItem('scroll_75_tracked')) {
        trackEvent('engagement', 'scroll_depth', '75_percent');
        sessionStorage.setItem('scroll_75_tracked', 'true');
      }
    }
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};
