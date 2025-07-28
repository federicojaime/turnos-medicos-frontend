import { useState, useEffect } from 'react';
import Card from './Card';

export const AnimatedStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  trend = null,
  loading = false,
  animationDelay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  // Crear clases manualmente
  const cardClasses = `
    relative overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-xl
    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
  `;

  const valueClasses = `
    text-3xl font-bold text-gray-900 transition-all duration-700
    ${isVisible ? 'transform-none' : 'transform scale-50'}
  `;

  const trendClasses = `
    flex items-center mt-2 transition-all duration-500
    ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}
  `;

  const iconContainerClasses = `
    p-4 rounded-2xl transition-all duration-500 transform
    ${iconBgClasses[color]}
    ${isVisible ? 'rotate-0 scale-100' : 'rotate-45 scale-75'}
  `;

  return (
    <Card className={cardClasses} hover={true}>
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`}></div>
      
      {/* Floating background effect */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full transform rotate-45`}></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <p className={valueClasses}>{value}</p>
              
              {trend && (
                <div className={trendClasses}>
                  <span className={`text-sm font-medium ${
                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.direction === 'up' ? '↗' : '↘'} {trend.value}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className={iconContainerClasses}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};