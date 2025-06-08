import React, { useState } from 'react';
import useResizeObserverSafe from '../utils/useResizeObserverSafe';

/**
 * A button wrapper that prevents ResizeObserver errors 
 * by using our safe resize observer and debouncing click events
 */
const SafeButton = ({ onClick, children, className, style, ...props }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  // Use our safe resize observer hook
  const handleResize = () => {
    // Empty handler to prevent resize loop errors
  };
  
  const buttonRef = useResizeObserverSafe(handleResize);
  
  // Handle click with debounce to prevent rapid re-renders
  const handleClick = (e) => {
    if (isClicked) return;
    
    setIsClicked(true);
    
    // Add small delay to avoid ResizeObserver loop
    setTimeout(() => {
      if (onClick) {
        onClick(e);
      }
      // Reset after a short delay
      setTimeout(() => setIsClicked(false), 300);
    }, 10);
  };
  
  return (
    <button 
      ref={buttonRef}
      onClick={handleClick}
      className={className}
      style={style}
      disabled={isClicked}
      {...props}
    >
      {children}
    </button>
  );
};

export default SafeButton;
