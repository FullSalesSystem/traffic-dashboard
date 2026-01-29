'use client';

import { useState, useMemo } from 'react';
import { CampaignSummary, AdSetSummary, CreativeSummary } from '@/types/campaign';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

// ============================================
// CAMPAIGN TABLE
// ============================================

interface CampaignTableProps {
  data: CampaignSummary[];
}

type CampaignSortKey = 'name' | 'totalPurchases' | 'totalSpent' | 'costPerPurchase' | 'stopRate' | 'retentionRate' | 'avgCTR' | 'avgCPC' | 'conversionRate';
type SortDirection = 'asc' | 'desc';

export function CampaignTable({ data }: CampaignTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<CampaignSortKey>('totalPurchases');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: CampaignSortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return result;
  }, [data, searchTerm, sortKey, sortDirection]);

  const SortIcon = ({ columnKey }: { columnKey: CampaignSortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3 h-3 inline ml-0.5" />
    );
  };

  const maxPurchases = Math.max(...data.map(d => d.totalPurchases), 1);
  const maxSpent = Math.max(...data.map(d => d.totalSpent), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campanha</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th onClick={() => handleSort('name')} className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                Campanha <SortIcon columnKey="name" />
              </th>
              <th onClick={() => handleSort('totalPurchases')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Compras <SortIcon columnKey="totalPurchases" />
              </th>
              <th onClick={() => handleSort('totalSpent')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Valor Investido <SortIcon columnKey="totalSpent" />
              </th>
              <th onClick={() => handleSort('costPerPurchase')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Custo/Compra <SortIcon columnKey="costPerPurchase" />
              </th>
              <th onClick={() => handleSort('stopRate')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Stop Rate <SortIcon columnKey="stopRate" />
              </th>
              <th onClick={() => handleSort('retentionRate')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Tx. Retenção <SortIcon columnKey="retentionRate" />
              </th>
              <th onClick={() => handleSort('avgCTR')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                CTR <SortIcon columnKey="avgCTR" />
              </th>
              <th onClick={() => handleSort('avgCPC')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                CPC <SortIcon columnKey="avgCPC" />
              </th>
              <th onClick={() => handleSort('conversionRate')} className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap">
                Tx. Conversão <SortIcon columnKey="conversionRate" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedData.slice(0, 10).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-2 text-gray-900 dark:text-white max-w-[200px] truncate" title={row.name}>
                  {row.name}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">{row.totalPurchases}</span>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(row.totalPurchases / maxPurchases) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white">{formatCurrency(row.totalSpent)}</span>
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${(row.totalSpent / maxSpent) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-white">
                  {formatCurrency(row.costPerPurchase)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.stopRate > 20 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    row.stopRate > 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  )}>
                    {formatPercent(row.stopRate)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                  {formatPercent(row.retentionRate)}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                  {formatPercent(row.avgCTR)}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                  {formatCurrency(row.avgCPC)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.conversionRate > 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    row.conversionRate > 10 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  )}>
                    {formatPercent(row.conversionRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length > 10 && (
        <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          1 - 10 / {filteredAndSortedData.length}
        </div>
      )}
    </div>
  );
}

// ============================================
// AD SET TABLE (Público)
// ============================================

interface AdSetTableProps {
  data: AdSetSummary[];
}

export function AdSetTable({ data }: AdSetTableProps) {
  const maxPurchases = Math.max(...data.map(d => d.totalPurchases), 1);
  const maxSpent = Math.max(...data.map(d => d.totalSpent), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Público</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Público</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Compras</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor Investido</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Custo/Compra</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stop Rate</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tx. Retenção</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CTR</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CPC</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tx. Conversão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-2 text-gray-900 dark:text-white max-w-[180px] truncate" title={row.name}>
                  {row.name || '-'}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">{row.totalPurchases}</span>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(row.totalPurchases / maxPurchases) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white">{formatCurrency(row.totalSpent)}</span>
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${(row.totalSpent / maxSpent) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.costPerPurchase)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.stopRate > 20 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    row.stopRate > 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  )}>
                    {formatPercent(row.stopRate)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatPercent(row.retentionRate)}</td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatPercent(row.avgCTR)}</td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.avgCPC)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.conversionRate > 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  )}>
                    {formatPercent(row.conversionRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// CREATIVE TABLE
// ============================================

interface CreativeTableProps {
  data: CreativeSummary[];
}

export function CreativeTable({ data }: CreativeTableProps) {
  const maxPurchases = Math.max(...data.map(d => d.totalPurchases), 1);
  const maxSpent = Math.max(...data.map(d => d.totalSpent), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Criativo</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Criativo</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Compras</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor Investido</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Custo/Compra</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Stop Rate</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tx. Retenção</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CTR</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">CPC</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tx. Conversão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.slice(0, 10).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-2 text-gray-900 dark:text-white max-w-[180px] truncate" title={row.name}>
                  {row.name || '-'}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">{row.totalPurchases}</span>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(row.totalPurchases / maxPurchases) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-900 dark:text-white">{formatCurrency(row.totalSpent)}</span>
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${(row.totalSpent / maxSpent) * 100}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-white">{formatCurrency(row.costPerPurchase)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.stopRate > 20 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    row.stopRate > 10 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  )}>
                    {formatPercent(row.stopRate)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatPercent(row.retentionRate)}</td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatPercent(row.avgCTR)}</td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{formatCurrency(row.avgCPC)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    row.conversionRate > 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  )}>
                    {formatPercent(row.conversionRate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
