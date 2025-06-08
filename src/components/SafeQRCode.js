import React from 'react';
import QRCode from 'react-qr-code';
import useResizeObserverSafe from '../utils/useResizeObserverSafe';

const SafeQRCode = ({ value, style = {}, size = 456 }) => {
  const handleResize = () => {
    // This empty handler ensures we're using our safe resize observer
    // but not actually making any resize-based changes
  };
  
  const qrRef = useResizeObserverSafe(handleResize);
  
  return (
    <div ref={qrRef}>
      <QRCode
        size={size}
        style={{
          height: style.height || '150px',
          maxWidth: style.maxWidth || '150px',
          width: style.width || '150px',
          marginTop: style.marginTop || '20px',
          ...style
        }}
        value={value}
        viewBox={`0 0 ${size} ${size}`}
      />
    </div>
  );
};

export default SafeQRCode;
