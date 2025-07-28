import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function FloatingActionButton({ actions = [], className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx('fixed bottom-6 right-6 z-50', className)}>
      {/* Action buttons */}
      <div className={clsx(
        'flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={clsx(
              'flex items-center bg-white rounded-full shadow-lg hover:shadow-xl',
              'px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900',
              'transition-all duration-200 transform hover:scale-105',
              'border border-gray-200 hover:border-gray-300'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <action.icon className="h-5 w-5 mr-2" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full',
          'shadow-lg hover:shadow-xl transition-all duration-200',
          'flex items-center justify-center transform hover:scale-110',
          'focus:outline-none focus:ring-4 focus:ring-blue-300',
          isOpen && 'rotate-45'
        )}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <PlusIcon className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>
    </div>
  );
}