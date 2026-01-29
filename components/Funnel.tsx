'use client';

import { FunnelData } from '@/types/campaign';
import { formatCompactNumber, formatCurrency, formatPercent } from '@/lib/utils';

interface FunnelProps {
  data: FunnelData;
}

export function Funnel({ data }: FunnelProps) {
  const steps = [
    { label: 'Impressões', value: data.impressions, color: 'bg-blue-500' },
    { label: 'Cliques', value: data.clicks, color: 'bg-blue-400' },
    { label: 'Carregamentos', value: data.landingPageViews, color: 'bg-cyan-500' },
    { label: 'Checkouts', value: data.checkouts, color: 'bg-teal-500' },
    { label: 'Compras', value: data.purchases, color: 'bg-green-500' },
  ];

  const rates = [
    { label: 'CTR', value: data.ctr },
    { label: 'Tx. Carreg.', value: data.loadRate },
    { label: 'Tx. Checkout', value: data.checkoutRate },
    { label: 'Tx. Conv.', value: data.conversionRate },
  ];

  const maxValue = steps[0].value || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Funil de Conversão
      </h3>

      {/* Funil Visual */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const widthPercent = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
          const minWidth = 20; // Largura mínima para visualização
          const displayWidth = Math.max(widthPercent, minWidth);

          return (
            <div key={step.label} className="relative">
              {/* Barra do funil */}
              <div
                className={`${step.color} rounded-lg py-3 px-4 mx-auto transition-all duration-500 flex items-center justify-between`}
                style={{
                  width: `${displayWidth}%`,
                  minWidth: '200px',
                }}
              >
                <span className="text-white text-xs sm:text-sm font-medium truncate">
                  {step.label}
                </span>
                <span className="text-white text-sm sm:text-base font-bold">
                  {formatCompactNumber(step.value)}
                </span>
              </div>

              {/* Taxa de conversão entre etapas */}
              {index < rates.length && (
                <div className="absolute -right-2 sm:right-4 top-1/2 transform -translate-y-1/2 translate-x-full">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-[10px] sm:text-xs">
                    <span className="text-gray-500 dark:text-gray-400">{rates[index].label}: </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatPercent(rates[index].value)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Métricas de custo */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">CPM</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.cpm)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">CPC</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.cpc)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Custo/Compra</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.costPerPurchase)}
          </p>
        </div>
      </div>
    </div>
  );
}
