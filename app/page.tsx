'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import {
  CampaignData,
  SaleData,
  KPIData,
  FunnelData,
  DailyMetrics,
  CampaignSummary,
  AdSetSummary,
  CreativeSummary,
  OrderBumpData,
} from '@/types/campaign';
import {
  fetchAllData,
  calculateKPIs,
  calculateFunnel,
  calculateOrderBumpData,
  getDailyMetrics,
  getCampaignSummaries,
  getAdSetSummaries,
  getCreativeSummaries,
  filterByDateRange,
  filterByCampaign,
  filterByCreative,
  getUniqueCampaigns,
  getUniqueCreatives,
} from '@/lib/sheets';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { MiniCard } from '@/components/MiniCard';
import { Funnel } from '@/components/Funnel';
import { OrderBump } from '@/components/OrderBump';
import { PurchasesCostChart, SpentScatterChart, SpentDonutChart, SalesDonutChart } from '@/components/Charts';
import { CampaignTable, AdSetTable, CreativeTable } from '@/components/DataTable';
import { DateFilter } from '@/components/DateFilter';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Dashboard() {
  // Raw data
  const [rawMeta, setRawMeta] = useState<CampaignData[]>([]);
  const [rawTicto, setRawTicto] = useState<SaleData[]>([]);

  // Filtered data (used internally for calculations)
  const [, setFilteredMeta] = useState<CampaignData[]>([]);
  const [, setFilteredTicto] = useState<SaleData[]>([]);

  // Calculated metrics
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics[]>([]);
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [adSetSummaries, setAdSetSummaries] = useState<AdSetSummary[]>([]);
  const [creativeSummaries, setCreativeSummaries] = useState<CreativeSummary[]>([]);
  const [orderBumpData, setOrderBumpData] = useState<OrderBumpData | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedCreative, setSelectedCreative] = useState('');
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [creatives, setCreatives] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const { meta, ticto } = await fetchAllData();
      setRawMeta(meta);
      setRawTicto(ticto);
      setLastUpdate(new Date());
      setError(null);

      // Set date range from data
      if (meta.length > 0) {
        const dates = meta.map((d) => d.day).filter((d) => d).sort();
        if (!startDate) setStartDate(dates[0] || '');
        if (!endDate) setEndDate(dates[dates.length - 1] || '');
      }

      // Set filter options
      setCampaigns(getUniqueCampaigns(meta));
      setCreatives(getUniqueCreatives(meta));
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se as planilhas estão públicas.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [startDate, endDate]);

  // Load data on mount and refresh every 60s
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Apply filters and calculate metrics
  useEffect(() => {
    if (rawMeta.length === 0) return;

    let meta = rawMeta;
    let ticto = rawTicto;

    // Filter by date
    if (startDate && endDate) {
      const filtered = filterByDateRange(meta, ticto, startDate, endDate);
      meta = filtered.meta;
      ticto = filtered.ticto;
    }

    // Filter by campaign
    if (selectedCampaign) {
      const filtered = filterByCampaign(meta, ticto, selectedCampaign);
      meta = filtered.meta;
      ticto = filtered.ticto;
    }

    // Filter by creative
    if (selectedCreative) {
      const filtered = filterByCreative(meta, ticto, selectedCreative);
      meta = filtered.meta;
      ticto = filtered.ticto;
    }

    setFilteredMeta(meta);
    setFilteredTicto(ticto);

    // Calculate all metrics
    setKpis(calculateKPIs(meta, ticto));
    setFunnel(calculateFunnel(meta, ticto));
    setDailyMetrics(getDailyMetrics(meta, ticto));
    setCampaignSummaries(getCampaignSummaries(meta, ticto));
    setAdSetSummaries(getAdSetSummaries(meta, ticto));
    setCreativeSummaries(getCreativeSummaries(meta, ticto));
    setOrderBumpData(calculateOrderBumpData(ticto));
  }, [rawMeta, rawTicto, startDate, endDate, selectedCampaign, selectedCreative]);

  const handlePresetChange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-medium mb-2">Erro ao carregar</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Meta Logo */}
              <svg className="w-10 h-10 text-blue-500" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10c-22.1 0-40 17.9-40 40s17.9 40 40 40c8.3 0 16-2.5 22.4-6.8L50 50V10zm0 0c22.1 0 40 17.9 40 40 0 8.3-2.5 16-6.8 22.4L50 50V10z"/>
              </svg>
              <div>
                <h1 className="text-xl font-bold text-blue-500">Dados - Meta Ads</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdate && (
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              )}
              <button
                onClick={loadData}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Resumo das métricas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Resumo das métricas</h2>

            {/* Filters - Mobile: full width, Desktop: inline */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-48"
              >
                <option value="">Filtro de Campanha</option>
                {campaigns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={selectedCreative}
                onChange={(e) => setSelectedCreative(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-48"
              >
                <option value="">Filtro de Criativos</option>
                {creatives.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Cards - Grid responsivo */}
          {kpis && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Compras</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{kpis.totalPurchases}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Custo/Compra</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(kpis.costPerPurchase)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">ROAS</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{kpis.roas.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Investido</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(kpis.totalSpent)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Retornado</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(kpis.totalRevenue)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">Ticket Médio</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(kpis.avgTicket)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Date Filter */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onPresetChange={handlePresetChange}
        />

        {/* Charts Row: Métricas por dia + Valor Investido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PurchasesCostChart data={dailyMetrics} title="Métricas por dia" />
          <SpentScatterChart data={dailyMetrics} title="Valor Investido" />
        </div>

        {/* Mini Cards Row */}
        {kpis && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MiniCard
              title="Tx. Carregamento"
              value={formatPercent(kpis.loadRate)}
              data={dailyMetrics.map(d => ({ value: d.loadRate }))}
              color="#3b82f6"
            />
            <MiniCard
              title="CPC"
              value={formatCurrency(kpis.avgCPC)}
              data={dailyMetrics.map(d => ({ value: d.avgCPC }))}
              color="#8b5cf6"
            />
            <MiniCard
              title="CTR"
              value={formatPercent(kpis.avgCTR)}
              data={dailyMetrics.map(d => ({ value: d.avgCTR }))}
              color="#06b6d4"
            />
            <MiniCard
              title="CPM"
              value={formatCurrency(kpis.avgCPM)}
              data={dailyMetrics.map(d => ({ value: d.avgCPM }))}
              color="#f59e0b"
            />
          </div>
        )}

        {/* Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpentDonutChart data={campaignSummaries} title="Distribuição de verba por campanhas" />
          <SalesDonutChart data={campaignSummaries} title="Vendas por campanhas" />
        </div>

        {/* Funnel */}
        {funnel && <Funnel data={funnel} />}

        {/* Order Bump - Conversão por Produto */}
        {orderBumpData && <OrderBump data={orderBumpData} />}

        {/* Campaign Table */}
        <CampaignTable data={campaignSummaries} />

        {/* Ad Set Table (Público) */}
        <AdSetTable data={adSetSummaries} />

        {/* Creative Table */}
        <CreativeTable data={creativeSummaries} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Dados: Meta Ads + Ticto | Atualização automática a cada 60s
          </p>
        </div>
      </footer>
    </div>
  );
}
