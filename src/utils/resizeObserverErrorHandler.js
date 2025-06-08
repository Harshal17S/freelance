/**
 * Utility to handle ResizeObserver errors globally
 * This prevents the "ResizeObserver loop completed with undelivered notifications" error
 * from being logged to the console
 */
const installResizeObserverErrorHandler = () => {
  // Store the original error handler
  const originalOnError = window.onerror;
  
  // Create a new error handler that filters ResizeObserver errors
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is a ResizeObserver error
    if (message && message.toString().includes('ResizeObserver loop')) {
      // Prevent the error from being logged to the console
      return true;
    }
    
    // For all other errors, use the original error handler
    if (originalOnError) {
      return originalOnError.apply(this, arguments);
    }
    
    return false;
  };
};

export default installResizeObserverErrorHandler;
