export interface CampaignData {
  day: string;
  campaignName: string;
  adSetName: string;
  adName: string;
  amountSpent: number;
  adId: string;
  results: number;
  costPerResult: number;
  reach: number;
  impressions: number;
  frequency: number;
  ctr: number;
  cpm: number;
  linkClicks: number;
  cpcLinkClick: number;
  clicksAll: number;
  cpcAll: number;
  landingPageViews: number;
  costPerLandingPageView: number;
  thruPlays: number;
  costPerThruPlay: number;
  videoWatches25: number;
  videoWatches50: number;
  videoWatches75: number;
  inViewImpressions100: number;
  addsToCart: number;
  checkoutsInitiated: number;
  purchaseRoas: number;
  costPerPurchase: number;
  leads: number;
  costPerLead: number;
  conversaoPagCaptura: number;
  connectRate: number;
  hookRate: number;
  hookSuccessfulRate: number;
  avgVideoCompleteRate: number;
  videoCompleteRate: number;
}

// Dados de venda da planilha Ticto
export interface SaleData {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  produto: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  valor: number;
  data: string; // DD/MM/YYYY HH:MM:SS
  dataFormatted: string; // YYYY-MM-DD para correlação
}

export interface DailyMetrics {
  date: string;
  // Meta Ads
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalLandingPageViews: number;
  totalCheckouts: number;
  avgCTR: number;
  avgCPM: number;
  avgCPC: number;
  // Ticto (vendas reais)
  totalPurchases: number;
  totalRevenue: number;
  costPerPurchase: number;
  roas: number;
  // Taxas do funil
  loadRate: number; // Landing Page Views / Clicks
  checkoutRate: number; // Checkouts / Landing Page Views
  conversionRate: number; // Purchases / Checkouts
}

export interface CampaignSummary {
  name: string;
  // Meta Ads
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalLandingPageViews: number;
  totalCheckouts: number;
  avgCTR: number;
  avgCPC: number;
  // Ticto (vendas reais)
  totalPurchases: number;
  totalRevenue: number;
  costPerPurchase: number;
  roas: number;
  conversionRate: number;
  // Extras
  stopRate: number;
  retentionRate: number;
}

export interface AdSetSummary {
  name: string;
  totalSpent: number;
  totalPurchases: number;
  costPerPurchase: number;
  stopRate: number;
  retentionRate: number;
  avgCTR: number;
  avgCPC: number;
  conversionRate: number;
}

export interface CreativeSummary {
  name: string;
  totalSpent: number;
  totalPurchases: number;
  costPerPurchase: number;
  stopRate: number;
  retentionRate: number;
  avgCTR: number;
  avgCPC: number;
  conversionRate: number;
}

export interface KPIData {
  // Principal
  totalPurchases: number;        // Compras (Ticto)
  costPerPurchase: number;       // Custo por Compra
  roas: number;                  // ROAS real
  totalSpent: number;            // Valor Investido (Meta)
  totalRevenue: number;          // Valor Retornado (Ticto)
  avgTicket: number;             // Ticket Médio (Ticto)
  // Funil
  totalImpressions: number;
  totalClicks: number;
  totalLandingPageViews: number;
  totalCheckouts: number;
  // Taxas
  avgCTR: number;
  avgCPM: number;
  avgCPC: number;
  loadRate: number;              // Taxa de Carregamento
  checkoutRate: number;          // Taxa de Checkout
  conversionRate: number;        // Taxa de Conversão (checkout -> compra)
  pvToConversionRate: number;    // Taxa PV -> Compra
}

export interface FunnelData {
  impressions: number;
  clicks: number;
  landingPageViews: number;
  checkouts: number;
  purchases: number;
  // Taxas entre etapas
  ctr: number;                   // Impressões -> Cliques
  loadRate: number;              // Cliques -> Landing Page
  checkoutRate: number;          // Landing Page -> Checkout
  conversionRate: number;        // Checkout -> Compra
  // Custos
  cpm: number;
  cpc: number;
  costPerPurchase: number;
}
