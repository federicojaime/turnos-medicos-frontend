import { clsx } from 'clsx';

export default function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  children,
  overlay = false 
}) {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  };

  const colors = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    white: 'text-white',
  };

  const SpinnerSVG = () => (
    <svg
      className={clsx(
        'animate-spin',
        sizes[size],
        colors[color],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
          <SpinnerSVG />
          {children && (
            <p className="text-gray-700 text-sm">{children}</p>
          )}
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div className="flex items-center space-x-2">
        <SpinnerSVG />
        <span className="text-sm text-gray-700">{children}</span>
      </div>
    );
  }

  return <SpinnerSVG />;
}

// Spinner variants for specific use cases
export const PageSpinner = ({ text = 'Cargando...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  </div>
);

export const InlineSpinner = ({ text }) => (
  <Spinner size="sm" color="primary">
    {text}
  </Spinner>
);

export const ButtonSpinner = () => (
  <Spinner size="sm" color="white" />
);