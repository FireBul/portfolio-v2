import { pushToDataLayer } from './analytics';

export interface LeadData {
  name: string;
  email: string;
  inquiryType: string;
  budget: string;
  message: string;
}

export const calculateLeadScore = (data: LeadData): number => {
  let score = 10; // Base score

  // Score based on inquiry type
  if (data.inquiryType === 'project') score += 20;
  if (data.inquiryType === 'recruiting') score += 30;
  if (data.inquiryType === 'consulting') score += 15;

  // Score based on budget
  if (data.budget === '10k+') score += 30;
  if (data.budget === '5k-10k') score += 20;
  if (data.budget === 'under-5k') score += 10;

  // Score based on message length
  if (data.message.length > 100) score += 10;

  return score;
};

export const submitLead = (data: LeadData) => {
  const score = calculateLeadScore(data);
  const leadRecord = {
    ...data,
    score,
    submittedAt: new Date().toISOString(),
    id: 'lead_' + Math.random().toString(36).substring(2, 9)
  };

  // Save to localStorage
  const existingLeads = JSON.parse(localStorage.getItem('portfolio_leads') || '[]');
  existingLeads.push(leadRecord);
  localStorage.setItem('portfolio_leads', JSON.stringify(existingLeads));

  // Push to dataLayer
  pushToDataLayer('portfolio_crm_submit', {
    lead_id: leadRecord.id,
    lead_score: score,
    inquiry_type: data.inquiryType,
    budget_range: data.budget
  });

  // FormSubmit.co로 실제 이메일 전송
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('_subject', `[포트폴리오 문의] ${data.inquiryType} — ${data.name}`);
  formData.append('inquiryType', data.inquiryType);
  formData.append('budget', data.budget);
  formData.append('message', data.message);
  formData.append('leadScore', String(score));
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');

  fetch('https://formsubmit.co/ajax/jarelrs@gmail.com', {
    method: 'POST',
    body: formData
  }).catch(() => {
    // 실패 시 mailto 폴백
    const body = encodeURIComponent(`이름: ${data.name}\n이메일: ${data.email}\n유형: ${data.inquiryType}\n예산: ${data.budget}\n\n${data.message}`);
    const subject = encodeURIComponent(`[포트폴리오 문의] ${data.inquiryType} — ${data.name}`);
    window.open(`mailto:jarelrs@gmail.com?subject=${subject}&body=${body}`, '_blank');
  });

  return leadRecord;
};
