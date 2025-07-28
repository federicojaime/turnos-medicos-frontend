import { clsx } from 'clsx';

export default function StatCard({ title, value, icon: Icon, color = 'blue', trend = null }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={clsx(
              'text-sm font-medium mt-1',
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
        <div className={clsx(
          'p-3 rounded-lg',
          colorClasses[color]
        )}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}