// This file must be imported before any React component
import React from 'react';

// Enhanced polyfill for useSyncExternalStore
if (!React.useSyncExternalStore) {
  // Add the function directly to React object
  React.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    const [state, setState] = React.useState(getSnapshot());
    
    React.useEffect(() => {
      // Subscribe to changes and update state when they happen
      const handleChange = () => {
        try {
          const nextState = getSnapshot();
          setState(nextState);
        } catch (error) {
          console.error("Error in useSyncExternalStore polyfill:", error);
        }
      };
      
      // Subscribe and get the unsubscribe function
      const unsubscribe = subscribe(handleChange);
      
      // Immediately check for changes (important for some libraries)
      handleChange();
      
      // Cleanup on unmount
      return unsubscribe;
    }, [subscribe, getSnapshot]);
    
    return state;
  };

  // Add the shim property
  React.useSyncExternalStore.shim = React.useSyncExternalStore;
}

// Make patched React available globally to ensure all components use the same instance
window.React = React;

export default React;
