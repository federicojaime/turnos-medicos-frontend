// ====== src/components/ui/Skeleton.jsx ======
import { clsx } from 'clsx';
import Card from './Card';

export const SkeletonLine = ({ width = 'full', height = '4', className = '' }) => (
  <div 
    className={clsx(
      'bg-gray-200 rounded animate-pulse',
      `h-${height}`,
      width === 'full' ? 'w-full' : `w-${width}`,
      className
    )}
  />
);

export const SkeletonCircle = ({ size = '12', className = '' }) => (
  <div 
    className={clsx(
      'bg-gray-200 rounded-full animate-pulse',
      `h-${size} w-${size}`,
      className
    )}
  />
);

export const SkeletonCard = ({ lines = 3, showAvatar = false, className = '' }) => (
  <Card className={className}>
    <div className="animate-pulse">
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <SkeletonCircle size="12" />
          <div className="space-y-2 flex-1">
            <SkeletonLine width="1/3" height="4" />
            <SkeletonLine width="1/4" height="3" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine 
            key={i}
            width={i === lines - 1 ? '3/4' : 'full'}
            height="4"
          />
        ))}
      </div>
    </div>
  </Card>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <Card padding="none">
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonLine key={i} width="3/4" height="4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonLine key={colIndex} width="full" height="4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// Skeleton específicos para la aplicación médica
export const SkeletonAppointmentCard = () => (
  <Card>
    <div className="animate-pulse">
      <div className="flex items-start space-x-4">
        <SkeletonCircle size="12" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="1/2" height="5" />
          <SkeletonLine width="1/3" height="4" />
          <div className="flex space-x-4 mt-3">
            <SkeletonLine width="20" height="3" />
            <SkeletonLine width="16" height="3" />
          </div>
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </Card>
);

export const SkeletonStatCard = () => (
  <Card>
    <div className="animate-pulse flex items-center justify-between">
      <div className="flex-1">
        <SkeletonLine width="1/2" height="4" className="mb-2" />
        <SkeletonLine width="1/3" height="8" className="mb-2" />
        <SkeletonLine width="1/4" height="3" />
      </div>
      <SkeletonCircle size="16" />
    </div>
  </Card>
);

export const SkeletonDoctorCard = () => (
  <Card>
    <div className="animate-pulse text-center">
      <SkeletonCircle size="20" className="mx-auto mb-4" />
      <SkeletonLine width="3/4" height="5" className="mx-auto mb-2" />
      <SkeletonLine width="1/2" height="4" className="mx-auto mb-2" />
      <SkeletonLine width="2/3" height="3" className="mx-auto mb-4" />
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </Card>
);

export default {
  SkeletonLine,
  SkeletonCircle,
  SkeletonCard,
  SkeletonTable,
  SkeletonAppointmentCard,
  SkeletonStatCard,
  SkeletonDoctorCard,
};