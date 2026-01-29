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
      rateLabel: 'Tx. de carregamento',
      cost: null,
      costLabel: null,
    },
    {
      label: 'Checkout',
      value: data.checkouts,
      rate: data.checkoutRate,
      rateLabel: 'Tx. de checkout',
      cost: null,
      costLabel: null,
    },
    {
      label: 'Compras',
      value: data.purchases,
      rate: data.conversionRate,
      rateLabel: 'Tx. conversão checkout / compra',
      cost: data.costPerPurchase,
      costLabel: 'Custo por compra',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between overflow-x-auto">
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
