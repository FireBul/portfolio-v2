/**
 * Chat notification via FormSubmit.co (free, no signup).
 *
 * First-time: FormSubmit sends a confirmation email to verify the address.
 * After verification, all subsequent notifications go through automatically.
 */

const NOTIFY_EMAIL = 'jarelrs@gmail.com';
const ENDPOINT = `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`;

export async function notifyChatMessage(userMessage: string, pagePath: string): Promise<void> {
  try {
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
