import { useEffect, useRef } from 'react';

/**
 * A safe implementation of ResizeObserver that prevents the
 * "ResizeObserver loop completed with undelivered notifications" error.
 *
 * @param {Function} callback - The callback function to execute on resize
 * @returns {Object} - The reference object to attach to the DOM element
 */
const useResizeObserverSafe = (callback) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Use requestAnimationFrame to prevent resize loops
    let rafId = null;
    const element = ref.current;
    
    const observer = new ResizeObserver(entries => {
      // Cancel any pending RAF callbacks
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Schedule the callback in the next animation frame
      rafId = requestAnimationFrame(() => {
        if (callback && Array.isArray(entries) && entries.length) {
          callback(entries);
        }
      });
    });
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [callback]);
  
  return ref;
};

export default useResizeObserverSafe;
