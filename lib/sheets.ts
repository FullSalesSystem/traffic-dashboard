import {
  CampaignData,
  SaleData,
  DailyMetrics,
  CampaignSummary,
  AdSetSummary,
  CreativeSummary,
  KPIData,
  FunnelData,
} from '@/types/campaign';

// Planilha Meta Ads
const META_SHEET_ID = '18OPaSCl-lAJEs1ukCLEJawpKiLjhoTyXtNecsAny9Wg';
const META_GID = '559199034';

// Planilha Ticto (Vendas reais)
const TICTO_SHEET_ID = '1ookCRdQLBr9VWnf_-9qKrK_fxfweUTc4VTZIHrkrvIg';
const TICTO_SHEET_NAME = 'Vendas - Ticto';

// ============================================
// FETCH DATA
// ============================================

export async function fetchMetaData(): Promise<CampaignData[]> {
  const url = `https://docs.google.com/spreadsheets/d/${META_SHEET_ID}/export?format=csv&gid=${META_GID}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Falha ao carregar dados do Meta Ads');
  const csvText = await response.text();
  return parseMetaCSV(csvText);
}

export async function fetchTictoData(): Promise<SaleData[]> {
  const url = `https://docs.google.com/spreadsheets/d/${TICTO_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TICTO_SHEET_NAME)}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Falha ao carregar dados do Ticto');
  const csvText = await response.text();
  return parseTictoCSV(csvText);
}

export async function fetchAllData(): Promise<{ meta: CampaignData[]; ticto: SaleData[] }> {
  const [meta, ticto] = await Promise.all([fetchMetaData(), fetchTictoData()]);
  return { meta, ticto };
}

// ============================================
// PARSE CSV
// ============================================

function parseMetaCSV(csvText: string): CampaignData[] {
  const lines = csvText.split('\n');
  const data: CampaignData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);

    // Colunas da planilha Meta Ads (ordem baseada no CSV)
    const row: CampaignData = {
      day: values[0] || '',                              // A: Day
      campaignName: values[1] || '',                     // B: Campaign Name
      adSetName: values[2] || '',                        // C: Ad Set Name
      adName: values[3] || '',                           // D: Ad Name
      amountSpent: parseNumber(values[4]),               // E: Amount Spent
      adId: values[5] || '',                             // F: Ad ID
      results: parseNumber(values[6]),                   // G: Results
      costPerResult: parseNumber(values[7]),             // H: Cost per Result
      reach: parseNumber(values[8]),                     // I: Reach
      impressions: parseNumber(values[9]),               // J: Impressions
      frequency: parseNumber(values[10]),                // K: Frequency
      ctr: parseNumber(values[11]),                      // L: CTR
      cpm: parseNumber(values[12]),                      // M: CPM
      linkClicks: parseNumber(values[13]),               // N: Link Clicks
      cpcLinkClick: parseNumber(values[14]),             // O: CPC (Link Click)
      clicksAll: parseNumber(values[15]),                // P: Clicks (All)
      cpcAll: parseNumber(values[16]),                   // Q: CPC (All)
      landingPageViews: parseNumber(values[17]),         // R: Landing Page Views
      costPerLandingPageView: parseNumber(values[18]),   // S: Cost per Landing Page View
      thruPlays: parseNumber(values[19]),                // T: ThruPlays
      costPerThruPlay: parseNumber(values[20]),          // U: Cost per ThruPlay
      videoWatches25: parseNumber(values[21]),           // V: Video Watches at 25%
      videoWatches50: parseNumber(values[22]),           // W: Video Watches at 50%
      videoWatches75: parseNumber(values[23]),           // X: Video Watches at 75%
      inViewImpressions100: parseNumber(values[24]),     // Y: 100% In-View Impressions
      addsToCart: parseNumber(values[25]),               // Z: Adds to Cart
      checkoutsInitiated: parseNumber(values[26]),       // AA: Checkouts Initiated
      purchaseRoas: parseNumber(values[27]),             // AB: Purchase ROAS
      costPerPurchase: parseNumber(values[28]),          // AC: Cost per Purchase
      leads: parseNumber(values[29]),                    // AD: Leads
      costPerLead: parseNumber(values[30]),              // AE: Cost per Lead
      conversaoPagCaptura: parseNumber(values[31]),      // AF: Conversão pag captura
      connectRate: parseNumber(values[32]),              // AG: Connect Rate
      hookRate: parseNumber(values[33]),                 // AH: Hook Rate
      hookSuccessfulRate: parseNumber(values[34]),       // AI: Hook Sucessfull Rate
      avgVideoCompleteRate: parseNumber(values[35]),     // AJ: Average Video Complete Rate
      videoCompleteRate: parseNumber(values[36]),        // AK: Video Complete Rate
    };

    data.push(row);
  }

  return data;
}

function parseTictoCSV(csvText: string): SaleData[] {
  const lines = csvText.split('\n');
  const data: SaleData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);

    // Colunas da planilha Ticto (ordem baseada no CSV)
    const dataOriginal = values[11] || '';  // L: Data (DD/MM/YYYY HH:MM:SS)

    const row: SaleData = {
      nome: values[0] || '',                // A: Nome
      email: values[1] || '',               // B: Email
      telefone: values[2] || '',            // C: Telefone
      documento: values[3] || '',           // D: Documento
      produto: values[4] || '',             // E: Produto
      utmSource: values[5] || '',           // F: UTM Source
      utmMedium: values[6] || '',           // G: UTM Medium
      utmCampaign: values[7] || '',         // H: UTM Campaign
      utmTerm: values[8] || '',             // I: UTM Term
      utmContent: values[9] || '',          // J: UTM Content
      valor: parseNumber(values[10]),       // K: Valor
      data: dataOriginal,
      dataFormatted: convertDateToISO(dataOriginal), // YYYY-MM-DD
    };

    // Só adiciona se tiver valor > 0 (venda efetiva)
    if (row.valor > 0) {
      data.push(row);
    }
  }

  return data;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseNumber(value: string | undefined): number {
  if (!value || value.trim() === '' || value === '-' || value === '—') return 0;

  let cleaned = value.trim().replace(/[R$\s]/g, '');
  cleaned = cleaned.replace(/%/g, '');

  // Formato brasileiro: 1.234,56 -> 1234.56
  if (cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function convertDateToISO(dateStr: string): string {
  // DD/MM/YYYY HH:MM:SS -> YYYY-MM-DD
  if (!dateStr) return '';
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
}

// ============================================
// CALCULATE KPIs
// ============================================

export function calculateKPIs(meta: CampaignData[], ticto: SaleData[]): KPIData {
  // Meta Ads - Coluna E (Amount Spent), J (Impressions), P (Clicks All), R (Landing Page Views), AA (Checkouts)
  const totalSpent = meta.reduce((sum, r) => sum + r.amountSpent, 0);
  const totalImpressions = meta.reduce((sum, r) => sum + r.impressions, 0);
  const totalClicks = meta.reduce((sum, r) => sum + r.clicksAll, 0);
  const totalLandingPageViews = meta.reduce((sum, r) => sum + r.landingPageViews, 0);
  const totalCheckouts = meta.reduce((sum, r) => sum + r.checkoutsInitiated, 0);

  // Ticto - Coluna K (Valor) - vendas reais
  const totalPurchases = ticto.length;
  const totalRevenue = ticto.reduce((sum, r) => sum + r.valor, 0);

  // Métricas calculadas
  const costPerPurchase = totalPurchases > 0 ? totalSpent / totalPurchases : 0;
  const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;

  // Taxas
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPM = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
  const avgCPC = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const loadRate = totalClicks > 0 ? (totalLandingPageViews / totalClicks) * 100 : 0;
  const checkoutRate = totalLandingPageViews > 0 ? (totalCheckouts / totalLandingPageViews) * 100 : 0;
  const conversionRate = totalCheckouts > 0 ? (totalPurchases / totalCheckouts) * 100 : 0;
  const pvToConversionRate = totalLandingPageViews > 0 ? (totalPurchases / totalLandingPageViews) * 100 : 0;

  // Ticket Médio
  const avgTicket = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

  return {
    totalPurchases,        // Ticto: COUNT(linhas) onde Valor > 0
    costPerPurchase,       // Meta(E) / Ticto(COUNT)
    roas,                  // Ticto(K) / Meta(E)
    totalSpent,            // Meta: SUM(coluna E)
    totalRevenue,          // Ticto: SUM(coluna K)
    avgTicket,             // Ticto: SUM(K) / COUNT
    totalImpressions,      // Meta: SUM(coluna J)
    totalClicks,           // Meta: SUM(coluna P)
    totalLandingPageViews, // Meta: SUM(coluna R)
    totalCheckouts,        // Meta: SUM(coluna AA)
    avgCTR,                // (Meta P / Meta J) * 100
    avgCPM,                // (Meta E / Meta J) * 1000
    avgCPC,                // Meta E / Meta P
    loadRate,              // (Meta R / Meta P) * 100
    checkoutRate,          // (Meta AA / Meta R) * 100
    conversionRate,        // (Ticto COUNT / Meta AA) * 100
    pvToConversionRate,    // (Ticto COUNT / Meta R) * 100
  };
}

export function calculateFunnel(meta: CampaignData[], ticto: SaleData[]): FunnelData {
  const impressions = meta.reduce((sum, r) => sum + r.impressions, 0);
  const clicks = meta.reduce((sum, r) => sum + r.clicksAll, 0);
  const landingPageViews = meta.reduce((sum, r) => sum + r.landingPageViews, 0);
  const checkouts = meta.reduce((sum, r) => sum + r.checkoutsInitiated, 0);
  const purchases = ticto.length;
  const totalSpent = meta.reduce((sum, r) => sum + r.amountSpent, 0);

  return {
    impressions,           // Meta: SUM(coluna J)
    clicks,                // Meta: SUM(coluna P)
    landingPageViews,      // Meta: SUM(coluna R)
    checkouts,             // Meta: SUM(coluna AA)
    purchases,             // Ticto: COUNT(linhas com Valor > 0)
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    loadRate: clicks > 0 ? (landingPageViews / clicks) * 100 : 0,
    checkoutRate: landingPageViews > 0 ? (checkouts / landingPageViews) * 100 : 0,
    conversionRate: checkouts > 0 ? (purchases / checkouts) * 100 : 0,
    cpm: impressions > 0 ? (totalSpent / impressions) * 1000 : 0,
    cpc: clicks > 0 ? totalSpent / clicks : 0,
    costPerPurchase: purchases > 0 ? totalSpent / purchases : 0,
  };
}

// ============================================
// DAILY METRICS
// ============================================

export function getDailyMetrics(meta: CampaignData[], ticto: SaleData[]): DailyMetrics[] {
  // Agrupar Meta por dia
  const metaByDay = new Map<string, CampaignData[]>();
  meta.forEach(row => {
    const date = row.day;
    if (!metaByDay.has(date)) metaByDay.set(date, []);
    metaByDay.get(date)!.push(row);
  });

  // Agrupar Ticto por dia
  const tictoByDay = new Map<string, SaleData[]>();
  ticto.forEach(row => {
    const date = row.dataFormatted;
    if (!tictoByDay.has(date)) tictoByDay.set(date, []);
    tictoByDay.get(date)!.push(row);
  });

  // Combinar todas as datas
  const allDates = new Set([...metaByDay.keys(), ...tictoByDay.keys()]);
  const dailyMetrics: DailyMetrics[] = [];

  allDates.forEach(date => {
    if (!date) return;

    const metaRows = metaByDay.get(date) || [];
    const tictoRows = tictoByDay.get(date) || [];

    const totalSpent = metaRows.reduce((sum, r) => sum + r.amountSpent, 0);
    const totalImpressions = metaRows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = metaRows.reduce((sum, r) => sum + r.clicksAll, 0);
    const totalLandingPageViews = metaRows.reduce((sum, r) => sum + r.landingPageViews, 0);
    const totalCheckouts = metaRows.reduce((sum, r) => sum + r.checkoutsInitiated, 0);

    const totalPurchases = tictoRows.length;
    const totalRevenue = tictoRows.reduce((sum, r) => sum + r.valor, 0);

    dailyMetrics.push({
      date,
      totalSpent,            // Meta: SUM(E) por dia
      totalImpressions,      // Meta: SUM(J) por dia
      totalClicks,           // Meta: SUM(P) por dia
      totalLandingPageViews, // Meta: SUM(R) por dia
      totalCheckouts,        // Meta: SUM(AA) por dia
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPM: totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0,
      totalPurchases,        // Ticto: COUNT por dia
      totalRevenue,          // Ticto: SUM(K) por dia
      costPerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
      roas: totalSpent > 0 ? totalRevenue / totalSpent : 0,
      loadRate: totalClicks > 0 ? (totalLandingPageViews / totalClicks) * 100 : 0,
      checkoutRate: totalLandingPageViews > 0 ? (totalCheckouts / totalLandingPageViews) * 100 : 0,
      conversionRate: totalCheckouts > 0 ? (totalPurchases / totalCheckouts) * 100 : 0,
    });
  });

  return dailyMetrics.sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================
// CAMPAIGN SUMMARIES
// ============================================

export function getCampaignSummaries(meta: CampaignData[], ticto: SaleData[]): CampaignSummary[] {
  // Agrupar Meta por Campaign Name (coluna B)
  const metaByCampaign = new Map<string, CampaignData[]>();
  meta.forEach(row => {
    const name = row.campaignName;
    if (!metaByCampaign.has(name)) metaByCampaign.set(name, []);
    metaByCampaign.get(name)!.push(row);
  });

  // Agrupar Ticto por UTM Campaign (coluna H)
  const tictoByCampaign = new Map<string, SaleData[]>();
  ticto.forEach(row => {
    const name = row.utmCampaign;
    if (!tictoByCampaign.has(name)) tictoByCampaign.set(name, []);
    tictoByCampaign.get(name)!.push(row);
  });

  const summaries: CampaignSummary[] = [];

  metaByCampaign.forEach((metaRows, name) => {
    const tictoRows = tictoByCampaign.get(name) || [];

    const totalSpent = metaRows.reduce((sum, r) => sum + r.amountSpent, 0);
    const totalImpressions = metaRows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = metaRows.reduce((sum, r) => sum + r.clicksAll, 0);
    const totalLandingPageViews = metaRows.reduce((sum, r) => sum + r.landingPageViews, 0);
    const totalCheckouts = metaRows.reduce((sum, r) => sum + r.checkoutsInitiated, 0);
    const totalThruPlays = metaRows.reduce((sum, r) => sum + r.thruPlays, 0);
    const totalVideoWatches25 = metaRows.reduce((sum, r) => sum + r.videoWatches25, 0);

    const totalPurchases = tictoRows.length;
    const totalRevenue = tictoRows.reduce((sum, r) => sum + r.valor, 0);

    // Stop Rate = % que parou antes de 25% do vídeo
    const stopRate = totalImpressions > 0 ? ((totalImpressions - totalVideoWatches25) / totalImpressions) * 100 : 0;
    // Retention Rate = ThruPlays / Impressions com vídeo
    const retentionRate = totalImpressions > 0 ? (totalThruPlays / totalImpressions) * 100 : 0;

    summaries.push({
      name,
      totalSpent,              // Meta: SUM(E) por campanha
      totalImpressions,        // Meta: SUM(J) por campanha
      totalClicks,             // Meta: SUM(P) por campanha
      totalLandingPageViews,   // Meta: SUM(R) por campanha
      totalCheckouts,          // Meta: SUM(AA) por campanha
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0,
      totalPurchases,          // Ticto: COUNT por UTM Campaign
      totalRevenue,            // Ticto: SUM(K) por UTM Campaign
      costPerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
      roas: totalSpent > 0 ? totalRevenue / totalSpent : 0,
      conversionRate: totalCheckouts > 0 ? (totalPurchases / totalCheckouts) * 100 : 0,
      stopRate,
      retentionRate,
    });
  });

  return summaries.sort((a, b) => b.totalPurchases - a.totalPurchases);
}

// ============================================
// AD SET SUMMARIES (Público)
// ============================================

export function getAdSetSummaries(meta: CampaignData[], ticto: SaleData[]): AdSetSummary[] {
  // Agrupar Meta por Ad Set Name (coluna C)
  const metaByAdSet = new Map<string, CampaignData[]>();
  meta.forEach(row => {
    const name = row.adSetName;
    if (!metaByAdSet.has(name)) metaByAdSet.set(name, []);
    metaByAdSet.get(name)!.push(row);
  });

  // Agrupar Ticto por UTM Term (coluna I) - geralmente usado para público
  const tictoByAdSet = new Map<string, SaleData[]>();
  ticto.forEach(row => {
    const name = row.utmTerm;
    if (!tictoByAdSet.has(name)) tictoByAdSet.set(name, []);
    tictoByAdSet.get(name)!.push(row);
  });

  const summaries: AdSetSummary[] = [];

  metaByAdSet.forEach((metaRows, name) => {
    const tictoRows = tictoByAdSet.get(name) || [];

    const totalSpent = metaRows.reduce((sum, r) => sum + r.amountSpent, 0);
    const totalImpressions = metaRows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = metaRows.reduce((sum, r) => sum + r.clicksAll, 0);
    const totalCheckouts = metaRows.reduce((sum, r) => sum + r.checkoutsInitiated, 0);
    const totalThruPlays = metaRows.reduce((sum, r) => sum + r.thruPlays, 0);
    const totalVideoWatches25 = metaRows.reduce((sum, r) => sum + r.videoWatches25, 0);

    const totalPurchases = tictoRows.length;

    const stopRate = totalImpressions > 0 ? ((totalImpressions - totalVideoWatches25) / totalImpressions) * 100 : 0;
    const retentionRate = totalImpressions > 0 ? (totalThruPlays / totalImpressions) * 100 : 0;

    summaries.push({
      name,
      totalSpent,              // Meta: SUM(E) por Ad Set
      totalPurchases,          // Ticto: COUNT por UTM Term
      costPerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
      stopRate,
      retentionRate,
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0,
      conversionRate: totalCheckouts > 0 ? (totalPurchases / totalCheckouts) * 100 : 0,
    });
  });

  return summaries.sort((a, b) => b.totalPurchases - a.totalPurchases);
}

// ============================================
// CREATIVE SUMMARIES
// ============================================

export function getCreativeSummaries(meta: CampaignData[], ticto: SaleData[]): CreativeSummary[] {
  // Agrupar Meta por Ad Name (coluna D)
  const metaByCreative = new Map<string, CampaignData[]>();
  meta.forEach(row => {
    const name = row.adName;
    if (!metaByCreative.has(name)) metaByCreative.set(name, []);
    metaByCreative.get(name)!.push(row);
  });

  // Agrupar Ticto por UTM Content (coluna J) - geralmente usado para criativo
  const tictoByCreative = new Map<string, SaleData[]>();
  ticto.forEach(row => {
    const name = row.utmContent;
    if (!tictoByCreative.has(name)) tictoByCreative.set(name, []);
    tictoByCreative.get(name)!.push(row);
  });

  const summaries: CreativeSummary[] = [];

  metaByCreative.forEach((metaRows, name) => {
    const tictoRows = tictoByCreative.get(name) || [];

    const totalSpent = metaRows.reduce((sum, r) => sum + r.amountSpent, 0);
    const totalImpressions = metaRows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = metaRows.reduce((sum, r) => sum + r.clicksAll, 0);
    const totalCheckouts = metaRows.reduce((sum, r) => sum + r.checkoutsInitiated, 0);
    const totalThruPlays = metaRows.reduce((sum, r) => sum + r.thruPlays, 0);
    const totalVideoWatches25 = metaRows.reduce((sum, r) => sum + r.videoWatches25, 0);

    const totalPurchases = tictoRows.length;

    const stopRate = totalImpressions > 0 ? ((totalImpressions - totalVideoWatches25) / totalImpressions) * 100 : 0;
    const retentionRate = totalImpressions > 0 ? (totalThruPlays / totalImpressions) * 100 : 0;

    summaries.push({
      name,
      totalSpent,              // Meta: SUM(E) por Ad Name
      totalPurchases,          // Ticto: COUNT por UTM Content
      costPerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
      stopRate,
      retentionRate,
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpent / totalClicks : 0,
      conversionRate: totalCheckouts > 0 ? (totalPurchases / totalCheckouts) * 100 : 0,
    });
  });

  return summaries.sort((a, b) => b.totalPurchases - a.totalPurchases);
}

// ============================================
// FILTERS
// ============================================

export function filterByDateRange(
  meta: CampaignData[],
  ticto: SaleData[],
  startDate: string,
  endDate: string
): { meta: CampaignData[]; ticto: SaleData[] } {
  const filteredMeta = meta.filter(row => row.day >= startDate && row.day <= endDate);
  const filteredTicto = ticto.filter(row => row.dataFormatted >= startDate && row.dataFormatted <= endDate);
  return { meta: filteredMeta, ticto: filteredTicto };
}

export function filterByCampaign(
  meta: CampaignData[],
  ticto: SaleData[],
  campaignName: string
): { meta: CampaignData[]; ticto: SaleData[] } {
  if (!campaignName) return { meta, ticto };
  const filteredMeta = meta.filter(row => row.campaignName === campaignName);
  const filteredTicto = ticto.filter(row => row.utmCampaign === campaignName);
  return { meta: filteredMeta, ticto: filteredTicto };
}

export function filterByCreative(
  meta: CampaignData[],
  ticto: SaleData[],
  creativeName: string
): { meta: CampaignData[]; ticto: SaleData[] } {
  if (!creativeName) return { meta, ticto };
  const filteredMeta = meta.filter(row => row.adName === creativeName);
  const filteredTicto = ticto.filter(row => row.utmContent === creativeName);
  return { meta: filteredMeta, ticto: filteredTicto };
}

// ============================================
// UNIQUE VALUES FOR FILTERS
// ============================================

export function getUniqueCampaigns(meta: CampaignData[]): string[] {
  return [...new Set(meta.map(r => r.campaignName))].filter(Boolean).sort();
}

export function getUniqueCreatives(meta: CampaignData[]): string[] {
  return [...new Set(meta.map(r => r.adName))].filter(Boolean).sort();
}
