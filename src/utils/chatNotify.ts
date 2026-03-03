/**
 * Chat notification via FormSubmit.co (free, no signup).
 *
 * First-time: FormSubmit sends a confirmation email to verify the address.
 * After verification, all subsequent notifications go through automatically.
 */

const NOTIFY_EMAIL = 'jarelrs@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;
const COOLDOWN_KEY = 'portfolio_chat_notified_at';
const COOLDOWN_MS = 1000 * 60 * 60 * 6; // 6시간 쿨다운

export async function notifyChatMessage(userMessage: string, pagePath: string): Promise<void> {
  try {
    // 같은 방문자 6시간 내 중복 알림 방지
    const lastNotified = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0');
    if (Date.now() - lastNotified < COOLDOWN_MS) return;
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const referrer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;

    // Detect device type
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
    const device = isMobile ? '📱 모바일' : '💻 데스크톱';

    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `💬 포트폴리오 챗봇 새 대화 — "${userMessage.slice(0, 50)}"`,
        _template: 'table',
        _captcha: 'false',

        '메시지': userMessage,
        '페이지': pagePath,
        '시간': timestamp,
        '디바이스': device,
        '유입 경로': referrer,
        '사이트': window.location.origin,
      }),
    });
  } catch (err) {
    // Silently fail — notification is non-critical
    console.warn('Chat notification failed:', err);
  }
}
