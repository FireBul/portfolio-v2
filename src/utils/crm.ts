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

  return leadRecord;
};
