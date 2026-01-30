'use client';

import { Calendar } from 'lucide-react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPresetChange: (days: number) => void;
  onCustomRange: (start: string, end: string) => void;
}

export function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPresetChange,
  onCustomRange,
}: DateFilterProps) {
  const dayPresets = [
    { label: '7 dias', days: 7 },
    { label: '14 dias', days: 14 },
    { label: '30 dias', days: 30 },
    { label: '90 dias', days: 90 },
  ];

  const handleThisWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Dom, 1=Seg, ...
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    onCustomRange(
      monday.toISOString().split('T')[0],
      now.toISOString().split('T')[0]
    );
  };

  const handleThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    onCustomRange(
      firstDay.toISOString().split('T')[0],
      now.toISOString().split('T')[0]
    );
  };

  const handleLastMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    onCustomRange(
      firstDay.toISOString().split('T')[0],
      lastDay.toISOString().split('T')[0]
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-2 sm:px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <span className="text-gray-500 dark:text-gray-400 text-sm">até</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-2 sm:px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          onClick={handleThisWeek}
          className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Essa Semana
        </button>
        <button
          onClick={handleThisMonth}
          className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Esse Mês
        </button>
        <button
          onClick={handleLastMonth}
          className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Mês Passado
        </button>
        {dayPresets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => onPresetChange(preset.days)}
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
