
import React from 'react';
import { BRAND_INFO } from '../constants';

interface DashboardCardProps {
  title: string;
  value?: string | number; // Made value optional
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, icon, children, trend }) => {
  const trendColor = trend?.direction === 'up' ? 'text-green-500' : trend?.direction === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend?.direction === 'up' ? '↑' : trend?.direction === 'down' ? '↓' : '–';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold" style={{ color: BRAND_INFO.colors.secondary }}>{title}</h3>
          {icon && <div style={{ color: BRAND_INFO.colors.primary }}>{icon}</div>}
        </div>
        {typeof value !== 'undefined' && <p className="text-3xl font-bold" style={{ color: BRAND_INFO.colors.secondary }}>{value}</p>}
        {trend && (
          <p className={`text-sm ${trendColor} font-medium`}>
            {trendIcon} {trend.value}
          </p>
        )}
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default DashboardCard;
