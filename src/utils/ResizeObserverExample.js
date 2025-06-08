import React from 'react';
import useResizeObserverSafe from './useResizeObserverSafe';

const ResizeObserverExample = () => {
  const handleResize = (entries) => {
    const entry = entries[0];
    console.log('Element size:', entry.contentRect);
    // Do something with the size information
  };
  
  const resizeRef = useResizeObserverSafe(handleResize);
  
  return (
    <div ref={resizeRef} style={{ width: '100%', height: '100%' }}>
      This element is safely observed for resize events
    </div>
  );
};

export default ResizeObserverExample;
