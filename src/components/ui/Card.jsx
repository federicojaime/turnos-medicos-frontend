import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'default',
  shadow = 'sm',
  hover = false,
  clickable = false,
  onClick,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white border-0',
    filled: 'bg-gray-50 border border-gray-200',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const baseClasses = 'rounded-lg transition-all duration-200';
  
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : '';

  return (
    <div
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        paddings[padding],
        shadows[shadow],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

// Card Title Component
export const CardTitle = ({ children, className = '', level = 3, ...props }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={clsx('text-lg font-semibold text-gray-900', className)} {...props}>
      {children}
    </Tag>
  );
};

// Card Content Component
export const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)} {...props}>
    {children}
  </div>
);

export default Card;
