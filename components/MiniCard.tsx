'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

interface MiniCardProps {
  title: string;
  value: string;
  data: { value: number }[];
  color?: string;
}

export function MiniCard({ title, value, data, color = '#3b82f6' }: MiniCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </p>
      <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </p>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
