'use client';

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  Legend,
} from 'recharts';
import { useTheme } from 'next-themes';
import { DailyMetrics, CampaignSummary } from '@/types/campaign';
import { formatCurrency, formatCompactNumber, shortenCampaignName } from '@/lib/utils';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
  '#ef4444', '#06b6d4', '#84cc16', '#6366f1', '#f97316',
  '#a855f7', '#22c55e'
];

interface DailyChartProps {
  data: DailyMetrics[];
  title: string;
}

// Gráfico de Compras (barras) + Custo por Compra (linha) por dia
export function PurchasesCostChart({ data, title }: DailyChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = data.map(d => ({
    date: d.date.substring(5), // MM-DD
    compras: d.totalPurchases,
    custoCompra: d.costPerPurchase,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={11} />
          <YAxis
            yAxisId="left"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={11}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={11}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
            }}
            formatter={(value: number, name: string) => [
              name === 'custoCompra' ? formatCurrency(value) : value,
              name === 'custoCompra' ? 'Custo por Compra' : 'Compras',
            ]}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="compras" fill="#3b82f6" name="Compras" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="custoCompra"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Custo por Compra"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Gráfico de Valor Investido por dia (scatter)
export function SpentScatterChart({ data, title }: DailyChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scatterData = data.map(d => ({
    date: d.date.substring(5),
    valor: d.totalSpent,
  }));

  const totalSpent = data.reduce((sum, d) => sum + d.totalSpent, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalSpent)}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200} className="sm:!h-[250px]">
        <ScatterChart data={scatterData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={10} />
          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={10} tickFormatter={(v) => formatCompactNumber(v)} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Valor']}
          />
          <Scatter dataKey="valor" fill="#ef4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CampaignChartProps {
  data: CampaignSummary[];
  title: string;
}

// Donut: Distribuição de verba por campanhas
export function SpentDonutChart({ data, title }: CampaignChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const top10 = data.slice(0, 10);
  const othersTotal = data.slice(10).reduce((sum, d) => sum + d.totalSpent, 0);

  const chartData = [
    ...top10.map(d => ({
      name: shortenCampaignName(d.name, 25),
      value: d.totalSpent,
    })),
    ...(othersTotal > 0 ? [{ name: 'Outras', value: othersTotal }] : []),
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Gasto']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full sm:w-1/2 sm:pl-4 mt-4 sm:mt-0 overflow-y-auto max-h-[150px] sm:max-h-[280px]">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 py-1 text-xs">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                {item.name}
              </span>
              <span className="text-gray-500 dark:text-gray-500">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Donut: Vendas por campanhas
export function SalesDonutChart({ data, title }: CampaignChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const withSales = data.filter(d => d.totalPurchases > 0);
  const top10 = withSales.slice(0, 10);
  const othersTotal = withSales.slice(10).reduce((sum, d) => sum + d.totalPurchases, 0);

  const chartData = [
    ...top10.map(d => ({
      name: shortenCampaignName(d.name, 25),
      value: d.totalPurchases,
    })),
    ...(othersTotal > 0 ? [{ name: 'Outras', value: othersTotal }] : []),
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height={220} className="sm:!h-[280px]">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'Vendas']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full sm:w-1/2 sm:pl-4 mt-4 sm:mt-0 overflow-y-auto max-h-[150px] sm:max-h-[280px]">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 py-1 text-xs">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                {item.name}
              </span>
              <span className="text-gray-500 dark:text-gray-500">
                {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
