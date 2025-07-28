import { useState } from 'react';
import Button from './Button';

export default function AnimatedButton({ 
  children, 
  onClick, 
  variant = 'primary',
  animation = 'bounce',
  className = '',
  ...props 
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick?.(e);
  };

  const animations = {
    bounce: isClicked ? 'animate-bounce' : '',
    pulse: isClicked ? 'animate-pulse' : '',
    spin: isClicked ? 'animate-spin' : '',
    wiggle: isClicked ? 'animate-wiggle' : '',
    heartbeat: isClicked ? 'animate-heartbeat' : '',
  };

  const buttonClasses = `
    transition-all duration-200 transform hover:scale-105 active:scale-95
    ${animations[animation]}
    ${className}
  `;

  return (
    <Button
      {...props}
      variant={variant}
      onClick={handleClick}
      className={buttonClasses} 
    >
      {children}
    </Button>
  );
}

