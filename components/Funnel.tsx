'use client';

import { FunnelData } from '@/types/campaign';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/lib/utils';

interface FunnelProps {
  data: FunnelData;
}

export function Funnel({ data }: FunnelProps) {
  const steps = [
    {
      label: 'Impressões',
      value: data.impressions,
      rate: null,
      rateLabel: null,
      cost: data.cpm,
      costLabel: 'CPM',
    },
    {
      label: 'Cliques',
      value: data.clicks,
      rate: data.ctr,
      rateLabel: 'CTR',
      cost: data.cpc,
      costLabel: 'CPC',
    },
    {
      label: 'Pág.Vendas',
      value: data.landingPageViews,
      rate: data.loadRate,
      rateLabel: 'Tx. carreg.',
      cost: null,
      costLabel: null,
    },
    {
      label: 'Checkout',
      value: data.checkouts,
      rate: data.checkoutRate,
      rateLabel: 'Tx. checkout',
      cost: null,
      costLabel: null,
    },
    {
      label: 'Compras',
      value: data.purchases,
      rate: data.conversionRate,
      rateLabel: 'Tx. conv.',
      cost: data.costPerPurchase,
      costLabel: 'Custo/compra',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 lg:hidden">Funil de Conversão</h3>

      {/* Mobile: Vertical layout */}
      <div className="flex flex-col gap-2 lg:hidden">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            {/* Step box */}
            <div className="bg-blue-500 dark:bg-blue-600 rounded-lg px-3 py-2 min-w-[100px] text-center flex-shrink-0">
              <span className="text-[10px] text-blue-100 block">{step.label}</span>
              <span className="text-base font-bold text-white">{formatCompactNumber(step.value)}</span>
            </div>

            {/* Rate & Cost */}
            <div className="flex-1 flex items-center justify-between text-xs">
              {index > 0 && step.rate !== null && (
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="text-gray-400 dark:text-gray-500">{step.rateLabel}: </span>
                  <span className="font-medium">{formatPercent(step.rate)}</span>
                </div>
              )}
              {step.costLabel && (
                <div className="text-gray-600 dark:text-gray-400 text-right">
                  <span className="text-gray-400 dark:text-gray-500">{step.costLabel}: </span>
                  <span className="font-medium">{formatCurrency(step.cost || 0)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden lg:flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center">
            {/* Rate between steps */}
            {index > 0 && (
              <div className="flex flex-col items-center mx-2 min-w-[80px]">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 text-center whitespace-nowrap">
                  {step.rateLabel}
                </span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {formatPercent(step.rate || 0)}
                </span>
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 my-1" />
              </div>
            )}

            {/* Step box */}
            <div className="flex flex-col items-center">
              {/* Cost above (for CPM, CPC) */}
              {step.costLabel && index < 2 && (
                <div className="mb-1 text-center">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                    {step.costLabel}
                  </span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(step.cost || 0)}
                  </span>
                </div>
              )}

              {/* Main box */}
              <div className="bg-blue-500 dark:bg-blue-600 rounded-lg px-4 py-3 min-w-[100px] text-center">
                <span className="text-[10px] text-blue-100 block">{step.label}</span>
                <span className="text-lg font-bold text-white">
                  {formatCompactNumber(step.value)}
                </span>
              </div>

              {/* Cost below (for Custo por compra) */}
              {step.costLabel && index >= 2 && (
                <div className="mt-1 text-center">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                    {step.costLabel}
                  </span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(step.cost || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
