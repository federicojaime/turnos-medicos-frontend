export default function GradientText({ 
  children, 
  gradient = 'primary', 
  className = '',
  as = 'span'
}) {
  const gradients = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
    success: 'bg-gradient-to-r from-green-400 to-blue-500',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500',
    medical: 'bg-gradient-to-r from-teal-400 to-blue-500',
    sunset: 'bg-gradient-to-r from-orange-400 to-pink-500',
  };

  const Component = as;

  const textClasses = `
    bg-clip-text text-transparent font-bold
    ${gradients[gradient]}
    ${className}
  `;

  return (
    <Component className={textClasses}>
      {children}
    </Component>
  );
}