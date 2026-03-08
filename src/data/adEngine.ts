// Ad Engine Core — 캠페인, RTB 경매, 트래킹, 통계

import { type UserSegment, SEGMENT_AD_PRIORITY } from './adSdk';

// ── Types ──

export type AdSlotType = 'display' | 'search' | 'reward';

export interface Campaign {
  id: string;
  name: string;
  type: AdSlotType;
  keywords: string[];
  bidCPC: number;        // ₩
  dailyBudget: number;   // ₩
  spent: number;
  projectId: string;
  active: boolean;
  qualityScore: number;  // 0-10
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: number;
}

export interface BidParticipant {
  campaignId: string;
  campaignName: string;
  bidAmount: number;
  qualityScore: number;
  relevanceScore: number;
  effectiveBid: number;
  isWinner: boolean;
}

export interface AuctionResult {
  slotId: string;
  slotType: AdSlotType;
  timestamp: number;
  participants: BidParticipant[];
  winningBid: number;
  secondPrice: number;
  floorPrice: number;
  auctionDuration: number;
  winnerId: string | null;
  winnerProjectId: string | null;
}

export interface AdEvent {
  type: 'impression' | 'click' | 'conversion';
  campaignId: string;
  slotId: string;
  timestamp: number;
  revenue: number;
}

export interface SlotInventory {
  id: string;
  name: string;
  type: AdSlotType;
  floorPrice: number;
  totalAuctions: number;
  filledAuctions: number;
  totalRevenue: number;
}

// ── Constants ──

const FLOOR_PRICES: Record<AdSlotType, number> = {
  display: 80,
  search: 120,
  reward: 200,
};

const SEGMENT_RELEVANCE: Record<UserSegment, Record<string, number>> = {
  recruiter: { 'ads-result': 9.5, 'seller-admin': 9.0, 'crm-campaign': 8.5, 'viral-ads': 8.0, 'coupon-flow': 7.0, 'external-channel': 7.5, 'data-structure': 6.5, 'settlement-logic': 6.0 },
  developer: { 'coupon-flow': 9.0, 'data-structure': 9.5, 'viral-ads': 7.5, 'settlement-logic': 7.0, 'ads-result': 6.5, 'seller-admin': 6.0, 'crm-campaign': 5.5, 'external-channel': 7.0 },
  mobile_user: { 'crm-campaign': 9.0, 'ads-result': 8.5, 'external-channel': 7.5, 'viral-ads': 7.0, 'coupon-flow': 6.5, 'seller-admin': 6.0, 'data-structure': 5.5, 'settlement-logic': 5.0 },
  casual: { 'ads-result': 8.0, 'coupon-flow': 8.0, 'viral-ads': 7.5, 'crm-campaign': 7.0, 'external-channel': 6.5, 'seller-admin': 6.0, 'data-structure': 5.5, 'settlement-logic': 5.0 },
};

// ── State ──

let campaigns: Campaign[] = [];
let auctionHistory: AuctionResult[] = [];
let eventLog: AdEvent[] = [];
let slots: SlotInventory[] = [
  { id: 'home_banner', name: 'Home 배너', type: 'display', floorPrice: FLOOR_PRICES.display, totalAuctions: 0, filledAuctions: 0, totalRevenue: 0 },
  { id: 'search_sponsored', name: '검색 스폰서드', type: 'search', floorPrice: FLOOR_PRICES.search, totalAuctions: 0, filledAuctions: 0, totalRevenue: 0 },
  { id: 'reward_interstitial', name: '리워드 인터스티셜', type: 'reward', floorPrice: FLOOR_PRICES.reward, totalAuctions: 0, filledAuctions: 0, totalRevenue: 0 },
];

const STORAGE_KEY = 'wh_ad_engine';

// ── Default Campaigns ──

function createDefaultCampaigns(): Campaign[] {
  return [
    { id: 'c1', name: '광고 지면 개선 프로젝트 홍보', type: 'display', keywords: ['광고', 'A/B', 'CTR', '지면'], bidCPC: 150, dailyBudget: 5000, spent: 0, projectId: 'ads-result', active: true, qualityScore: 8.5, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c2', name: '쿠폰 자동화 검색 광고', type: 'search', keywords: ['쿠폰', '자동화', '네이버', 'EP', 'Kafka'], bidCPC: 200, dailyBudget: 4000, spent: 0, projectId: 'coupon-flow', active: true, qualityScore: 7.5, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c3', name: '바이럴 CPS 리워드 광고', type: 'reward', keywords: ['CPS', '바이럴', '제휴', '정산'], bidCPC: 300, dailyBudget: 3000, spent: 0, projectId: 'viral-ads', active: true, qualityScore: 7.0, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c4', name: 'CRM 개인화 배너', type: 'display', keywords: ['CRM', 'Braze', '개인화', '푸시'], bidCPC: 120, dailyBudget: 3500, spent: 0, projectId: 'crm-campaign', active: true, qualityScore: 8.0, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c5', name: '광고센터 ADMIN 검색 광고', type: 'search', keywords: ['ADMIN', '운영', 'RTB', '과금', '정책'], bidCPC: 180, dailyBudget: 3000, spent: 0, projectId: 'seller-admin', active: true, qualityScore: 7.0, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c6', name: '데이터 구조 개선 디스플레이', type: 'display', keywords: ['Kafka', '데이터', '파이프라인', 'topic'], bidCPC: 130, dailyBudget: 2500, spent: 0, projectId: 'data-structure', active: true, qualityScore: 7.5, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c7', name: '외부 채널 확장 광고', type: 'search', keywords: ['채널', '연동', '매체', '노티플러스'], bidCPC: 100, dailyBudget: 2000, spent: 0, projectId: 'external-channel', active: true, qualityScore: 6.5, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
    { id: 'c8', name: '정산 로직 리워드', type: 'reward', keywords: ['정산', '수수료', '공정', '할인'], bidCPC: 250, dailyBudget: 2000, spent: 0, projectId: 'settlement-logic', active: true, qualityScore: 6.0, impressions: 0, clicks: 0, conversions: 0, createdAt: Date.now() },
  ];
}

// ── Init / Persist ──

export function initEngine() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      campaigns = data.campaigns || createDefaultCampaigns();
      auctionHistory = data.auctionHistory || [];
      eventLog = data.eventLog || [];
      if (data.slots) slots = data.slots;
    } catch {
      campaigns = createDefaultCampaigns();
    }
  } else {
    campaigns = createDefaultCampaigns();
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ campaigns, auctionHistory, eventLog, slots }));
}

export function resetEngine() {
  campaigns = createDefaultCampaigns();
  auctionHistory = [];
  eventLog = [];
  slots = slots.map((s) => ({ ...s, totalAuctions: 0, filledAuctions: 0, totalRevenue: 0 }));
  localStorage.removeItem(STORAGE_KEY);
}

// ── Campaign CRUD ──

export function getCampaigns(): Campaign[] {
  return [...campaigns];
}

export function addCampaign(c: Omit<Campaign, 'id' | 'spent' | 'impressions' | 'clicks' | 'conversions' | 'createdAt'>): Campaign {
  const newCampaign: Campaign = {
    ...c,
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    createdAt: Date.now(),
  };
  campaigns.push(newCampaign);
  persist();
  return newCampaign;
}

export function toggleCampaign(id: string) {
  const c = campaigns.find((x) => x.id === id);
  if (c) {
    c.active = !c.active;
    persist();
  }
}

// ── RTB Auction ──

export function runAuction(
  slotId: string,
  slotType: AdSlotType,
  searchQuery?: string,
  userSegment?: UserSegment
): AuctionResult {
  const segment = userSegment || 'casual';
  const floor = FLOOR_PRICES[slotType];

  // 슬롯 업데이트
  const slot = slots.find((s) => s.id === slotId);
  if (slot) slot.totalAuctions++;

  // 후보 필터
  let candidates = campaigns.filter(
    (c) => c.active && c.type === slotType && c.spent < c.dailyBudget
  );

  // 검색 키워드 매칭
  if (slotType === 'search' && searchQuery) {
    const q = searchQuery.toLowerCase();
    candidates = candidates.filter((c) =>
      c.keywords.some((kw) => q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q))
    );
  }

  // effectiveBid 계산
  const participants: BidParticipant[] = candidates.map((c) => {
    const relevance = SEGMENT_RELEVANCE[segment]?.[c.projectId] ?? 5.0;
    const effectiveBid = Math.round((c.bidCPC * c.qualityScore * relevance) / 100);
    return {
      campaignId: c.id,
      campaignName: c.name,
      bidAmount: c.bidCPC,
      qualityScore: c.qualityScore,
      relevanceScore: relevance,
      effectiveBid,
      isWinner: false,
    };
  });

  // effectiveBid 내림차순 정렬
  participants.sort((a, b) => b.effectiveBid - a.effectiveBid);

  let winningBid = 0;
  let secondPrice = 0;
  let winnerId: string | null = null;
  let winnerProjectId: string | null = null;

  if (participants.length > 0 && participants[0].effectiveBid >= floor) {
    participants[0].isWinner = true;
    winnerId = participants[0].campaignId;
    winningBid = participants[0].effectiveBid;
    secondPrice = participants.length > 1
      ? Math.max(participants[1].effectiveBid, floor) + 1
      : floor + 1;

    // 과금 처리
    const winner = campaigns.find((c) => c.id === winnerId);
    if (winner) {
      winner.spent += secondPrice;
      winner.impressions++;
      winnerProjectId = winner.projectId;
    }

    if (slot) {
      slot.filledAuctions++;
      slot.totalRevenue += secondPrice;
    }
  }

  const result: AuctionResult = {
    slotId,
    slotType,
    timestamp: Date.now(),
    participants,
    winningBid,
    secondPrice,
    floorPrice: floor,
    auctionDuration: Math.floor(Math.random() * 300 + 200),
    winnerId,
    winnerProjectId,
  };

  auctionHistory.push(result);
  persist();
  return result;
}

// ── Event Tracking ──

export function trackAdEvent(type: AdEvent['type'], campaignId: string, slotId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) return;

  let revenue = 0;
  if (type === 'click') {
    campaign.clicks++;
    revenue = campaign.bidCPC;
  } else if (type === 'conversion') {
    campaign.conversions++;
  }

  const event: AdEvent = { type, campaignId, slotId, timestamp: Date.now(), revenue };
  eventLog.push(event);
  persist();
}

// ── Statistics / Dashboard ──

export function getSlots(): SlotInventory[] {
  return [...slots];
}

export function getAuctionHistory(): AuctionResult[] {
  return [...auctionHistory];
}

export function getEventLog(): AdEvent[] {
  return [...eventLog];
}

export function getDspStats() {
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cvr = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  return { totalSpent, totalImpressions, totalClicks, totalConversions, ctr, cvr, activeCampaigns: campaigns.filter((c) => c.active).length };
}

export function getSspStats() {
  const totalAuctions = slots.reduce((s, sl) => s + sl.totalAuctions, 0);
  const filledAuctions = slots.reduce((s, sl) => s + sl.filledAuctions, 0);
  const totalRevenue = slots.reduce((s, sl) => s + sl.totalRevenue, 0);
  const fillRate = totalAuctions > 0 ? (filledAuctions / totalAuctions) * 100 : 0;
  const eCPM = filledAuctions > 0 ? (totalRevenue / filledAuctions) * 1000 : 0;
  return { totalAuctions, filledAuctions, fillRate, totalRevenue, eCPM, slots: [...slots] };
}

export function getMmpStats() {
  const impressions = eventLog.filter((e) => e.type === 'impression').length;
  const clicks = eventLog.filter((e) => e.type === 'click').length;
  const conversions = eventLog.filter((e) => e.type === 'conversion').length;
  const totalRevenue = eventLog.reduce((s, e) => s + e.revenue, 0);
  return {
    funnel: { impressions, clicks, conversions },
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    cvr: clicks > 0 ? (conversions / clicks) * 100 : 0,
    totalRevenue,
    roas: totalRevenue > 0 ? ((conversions * 500) / totalRevenue) * 100 : 0,
  };
}

/** 세그먼트 기반 추천 프로젝트에서 캠페인 찾기 */
export function getPersonalizedCampaigns(segment: UserSegment, slotType: AdSlotType): Campaign[] {
  const priority = SEGMENT_AD_PRIORITY[segment];
  return campaigns
    .filter((c) => c.active && c.type === slotType && c.spent < c.dailyBudget)
    .sort((a, b) => {
      const aIdx = priority.indexOf(a.projectId);
      const bIdx = priority.indexOf(b.projectId);
      const aPri = aIdx >= 0 ? aIdx : 99;
      const bPri = bIdx >= 0 ? bIdx : 99;
      return aPri - bPri;
    });
}
