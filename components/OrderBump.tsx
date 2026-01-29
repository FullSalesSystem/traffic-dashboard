'use client';

import { OrderBumpData } from '@/types/campaign';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { ShoppingBag, TrendingUp, Package } from 'lucide-react';

interface OrderBumpProps {
  data: OrderBumpData;
}

export function OrderBump({ data }: OrderBumpProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Conversão por Produto
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Produto Principal */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Produto Principal</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {data.mainProduct.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Vendas</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {data.mainProduct.quantity}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Receita</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.mainProduct.revenue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Ticket Médio</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatCurrency(data.mainProduct.avgPrice)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Tx. Conversão</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                100%
              </p>
            </div>
          </div>
        </div>

        {/* Order Bump */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-green-600 dark:text-green-400">Order Bump</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {data.orderBump.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Vendas</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {data.orderBump.quantity}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Receita</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.orderBump.revenue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Ticket Médio</p>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatCurrency(data.orderBump.avgPrice)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Tx. Conversão</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {formatPercent(data.orderBumpConversionRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receita do Order Bump</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data.orderBumpRevenue)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({formatPercent(data.orderBumpRevenuePercent)} da receita total)
                </span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Receita Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.totalRevenue)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
