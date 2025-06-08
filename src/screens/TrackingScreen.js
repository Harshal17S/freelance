import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery, Chip } from '@material-ui/core';
import { ReactBingmaps } from 'react-bingmaps';
import useResizeObserverSafe from '../utils/useResizeObserverSafe';
import { Store } from '../Store';

const containerStyle = {
  width: '100%',
  height: '350px', // Slightly smaller for better screen fit
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
  border: '1px solid #e0e0e0'
};

 
function TrackingScreen() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { state } = useContext(Store);
  const { order } = state;
  
  // Check if pickup order - if so, we shouldn't show the map
  const isPickupOrder = order?.orderType === 'Pick Up';
  
  const [dimensions, setDimensions] = useState(null);
  const [status, setStatus] = useState('Preparing');
  const [driverPosition, setDriverPosition] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [traveledRoute, setTraveledRoute] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(30); // Minutes
  const mapContainerRef = useRef(null);
  const animationRef = useRef(null);

  let customerData = sessionStorage.getItem("customerInfo");
  customerData = customerData ? JSON.parse(customerData) : null;
  let restaurant = localStorage.getItem("userInfo");
  restaurant = JSON.parse(restaurant);
// Restaurant and delivery locations remained the same
const restaurantLocation = restaurant?.location?.coordinates?.sort(); 
const deliveryLocation = [customerData.customer?.lat, customerData.customer?.long];

// Function to get current driver position based on animation progress
const calculateDriverPosition = (progress) => {
  const waypoints = getPolyline().location;
  const totalSegments = waypoints.length - 1;
  
  const segmentIndex = Math.min(
    Math.floor(progress * totalSegments), 
    totalSegments - 1
  );
  
  const totalDistance = totalSegments;
  const segmentStart = segmentIndex / totalDistance;
  const segmentEnd = (segmentIndex + 1) / totalDistance;
  const segmentProgress = (progress - segmentStart) / (segmentEnd - segmentStart);
  
  const startPoint = waypoints[segmentIndex];
  const endPoint = waypoints[segmentIndex + 1];
  
  return [
    startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress,
    startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress
  ];
};

// Function to format locations for Bing Maps infoboxes with pushpins
const getInfoBoxes = (driverPosition) => {
  const boxes = [
    {
      location: [restaurantLocation[0], restaurantLocation[1]],
      addHandler: "mouseover",
      infoboxOption: { 
        title: 'Restaurant', 
        description: 'Your order is being prepared here' 
      },
      pushPinOption: {
        text: '🍕',
        title: 'Restaurant',
        textSize: 16,
        color: '#e53935'
      }
    },
    {
      location: [deliveryLocation[0], deliveryLocation[1]],
      addHandler: "mouseover",
      infoboxOption: { 
        title: 'Delivery Location', 
        description: 'Your order will be delivered here' 
      },
      pushPinOption: {
        text: '📍',
        title: 'Delivery',
        textSize: 16,
        color: '#1e88e5'
      }
    }
  ];

  if (driverPosition) {
    boxes.push({
      location: driverPosition,
      addHandler: "mouseover",
      infoboxOption: { 
        title: 'Driver', 
        description: 'Your delivery is on the way!' 
      },
      pushPinOption: {
        text: '🛵',
        title: 'Driver',
        textSize: 18,
        color: '#ff9800'
      }
    });
  }
  
  return boxes;
};

// Define polyline for the route
const getPolyline = () => {
  const waypoints = [
    [restaurantLocation[0], restaurantLocation[1]],
    [restaurantLocation[0] + 0.002, restaurantLocation[1] + 0.001],
    [restaurantLocation[0] + 0.003, restaurantLocation[1] + 0.004],
    [restaurantLocation[0] + 0.005, restaurantLocation[1] + 0.008],
    [restaurantLocation[0] + 0.007, restaurantLocation[1] + 0.015],
    [deliveryLocation[0] - 0.002, deliveryLocation[1] - 0.004],
    [deliveryLocation[0] - 0.001, deliveryLocation[1] - 0.001],
    [deliveryLocation[0], deliveryLocation[1]]
  ];
  
  return {
    location: waypoints,
    option: { 
      strokeColor: '#2979ff',
      strokeThickness: 5,
      strokeDashArray: [1],
      visible: true
    }
  };
};

// Generate the traveled portion of the route based on animation progress
const getTraveledPolyline = (progress) => {
  const allWaypoints = getPolyline().location;
  const totalSegments = allWaypoints.length - 1;
  
  const segmentIndex = Math.min(
    Math.floor(progress * totalSegments), 
    totalSegments - 1
  );
  
  const segmentProgress = (progress * totalSegments) - segmentIndex;
  const traveledWaypoints = allWaypoints.slice(0, segmentIndex + 1);
  
  if (segmentIndex < totalSegments) {
    const startPoint = allWaypoints[segmentIndex];
    const endPoint = allWaypoints[segmentIndex + 1];
    
    const currentPosition = [
      startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress,
      startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress
    ];
    
    traveledWaypoints.push(currentPosition);
  }
  
  return {
    location: traveledWaypoints,
    option: { 
      strokeColor: '#ff6d00',
      strokeThickness: 7,
      strokeDashArray: [1],
      visible: true
    }
  };
};
  
  // Handle resize safely with our custom hook
  const handleResize = (entries) => {
    if (!entries || !entries[0]) return;
    
    const { width, height } = entries[0].contentRect;
    
    setDimensions(prev => {
      if (!prev || Math.abs(prev.width - width) > 2 || Math.abs(prev.height - height) > 2) {
        return { width, height };
      }
      return prev;
    });
  };
  
  // Apply our safe resize observer to the map container
  const mapRef = useResizeObserverSafe(handleResize);
  
  // Safe tracking container ref
  const trackingRef = useResizeObserverSafe(() => {});

  // Animate driver along the route
  useEffect(() => {
    const startAnimation = () => {
      // Set initial driver position at restaurant
      setDriverPosition(restaurantLocation);
      setTraveledRoute(getTraveledPolyline(0));
      setLastUpdated(new Date());
      
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      
      const updateInterval = 30000; // Update every 30 seconds for a smoother experience
      
      animationRef.current = setInterval(() => {
        setAnimationProgress(prev => {
          const newProgress = prev + 0.05; // Smaller increment for smoother animation
          
          if (newProgress <= 1) {
            setDriverPosition(calculateDriverPosition(newProgress));
            setTraveledRoute(getTraveledPolyline(newProgress));
            setLastUpdated(new Date());
            
            // Update estimated time remaining
            setEstimatedTime(Math.max(0, Math.round(30 * (1 - newProgress))));
            
            return newProgress;
          } else {
            clearInterval(animationRef.current);
            setTraveledRoute(getTraveledPolyline(1));
            setLastUpdated(new Date());
            setEstimatedTime(0);
            return 1;
          }
        });
      }, updateInterval);
    };

    // After a short delay to simulate order preparation
    const timer = setTimeout(() => {
      setStatus('On the way');
      startAnimation();
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Update order status when driver arrives
  useEffect(() => {
    if (animationProgress === 1) {
      setStatus('Delivered');
    } else if (animationProgress > 0) {
      setStatus('On the way');
    }
  }, [animationProgress]);

  // Determine initial dimensions
  useEffect(() => {
    if (mapContainerRef.current && !dimensions) {
      const { offsetWidth, offsetHeight } = mapContainerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [mapContainerRef.current]);

  // Get status color based on current status
  const getStatusColor = () => {
    switch(status) {
      case 'Preparing':
        return '#f57c00'; // Orange
      case 'On the way':
        return '#1976d2'; // Blue
      case 'Delivered':
        return '#388e3c'; // Green
      default:
        return '#757575'; // Gray
    }
  };

  // Format the timestamp for display
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Not yet updated";
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box ref={trackingRef} style={{ padding: isSmallScreen ? '16px' : '20px' }}>
      <Paper 
        elevation={2} 
        style={{ 
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        <Box 
          style={{ 
            backgroundColor: getStatusColor(),
            padding: '12px 20px',
            color: 'white'
          }}
        >
          <Typography variant={isSmallScreen ? "h5" : "h4"} style={{ fontWeight: 500 }}>
            {isPickupOrder ? 'Order Status' : 'Order Tracking'}
          </Typography>
        </Box>
        
        <Box style={{ padding: '16px' }}>
          {/* Status and Time Info */}
          <Box 
            display="flex" 
            flexDirection={isSmallScreen ? "column" : "row"}
            justifyContent="space-between" 
            alignItems={isSmallScreen ? "flex-start" : "center"}
            mb={2}
          >
            <Box>
              <Chip 
                label={isPickupOrder ? 'Ready for Pickup' : status} 
                style={{
                  backgroundColor: getStatusColor(),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              />
            </Box>
            
            <Box mt={isSmallScreen ? 1 : 0}>
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                {isPickupOrder ? 
                  'Your order is ready at the counter' : 
                  (estimatedTime > 0 ? 
                    `Estimated Delivery: ${estimatedTime} minutes` : 
                    'Order Delivered!'
                  )
                }
              </Typography>
            </Box>
          </Box>
          
          {/* Status details */}
          <Box 
            style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          >
            <Typography variant="body1">
              {isPickupOrder ? 
                '🍽️ Please collect your order from the restaurant counter' :
                (status === 'Preparing' && '👨‍🍳 Your order is being prepared in the kitchen') ||
                (status === 'On the way' && '🛵 Your order is on its way to your location') ||
                (status === 'Delivered' && '✅ Your order has been delivered. Enjoy your meal!')
              }
            </Typography>
          </Box>

          {/* Progress bar */}
          <Box 
            style={{
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: isPickupOrder ? '100%' : // For pickup, show completed
                      (status === 'Preparing' ? '20%' : 
                      status === 'On the way' ? `${20 + animationProgress * 80}%` :
                      '100%'),
                backgroundColor: getStatusColor(),
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </Box>

          {/* Only show map for non-pickup orders */}
          {!isPickupOrder && (
            <>
              {/* Map Container */}
              <Box 
                ref={(el) => {
                  mapRef.current = el;
                  mapContainerRef.current = el;
                }}
                style={{
                  ...containerStyle,
                  height: isSmallScreen ? '250px' : '350px'
                }}
              >
                {dimensions && (
                  <ReactBingmaps
                    bingmapKey="ArW_TkF5xKfdKeIe4Ac-IQaAI7Mm3FLkRbPaj0g5EqEvF01MqV5JMR-ABy2BxrPd"
                    center={[(restaurantLocation[0] + deliveryLocation[0]) / 2, 
                            (restaurantLocation[1] + deliveryLocation[1]) / 2]}
                    infoboxesWithPushPins={getInfoBoxes(driverPosition)}
                    polylines={traveledRoute ? [getPolyline(), traveledRoute] : [getPolyline()]}
                    zoom={14}
                    mapOptions={{
                      showMapTypeSelector: false,
                      showZoomControls: true,
                      mapTypeId: "road"
                    }}
                    width={dimensions.width}
                    height={dimensions.height}
                    navigationBarMode={"compact"}
                  />
                )}
              </Box>

          {/* Route Legend */}
          <Box 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px', 
              marginTop: '12px',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '5px'
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                style={{ 
                  width: '20px', 
                  height: '5px', 
                  backgroundColor: '#2979ff', 
                  marginRight: '8px' 
                }} 
              />
              <Typography variant="body2">Route</Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                style={{ 
                  width: '20px', 
                  height: '5px', 
                  backgroundColor: '#ff6d00',
                  marginRight: '8px' 
                }} 
              />
              <Typography variant="body2">Progress</Typography>
            </Box>
          </Box>

              {/* Last Updated Indicator */}
              {lastUpdated && (
                <Box style={{ marginTop: '12px', textAlign: 'right' }}>
                  <Typography variant="caption" style={{ fontStyle: 'italic' }}>
                    Last update: {formatLastUpdated()}
                  </Typography>
                </Box>
              )}
            </>
          )}
          
          {/* For pickup orders, show pickup instructions instead of map */}
          {isPickupOrder && (
            <Box 
              style={{
                padding: '20px',
                textAlign: 'center',
                marginTop: '20px',
                backgroundColor: '#f1f8e9',
                border: '1px solid #c5e1a5',
                borderRadius: '8px'
              }}
            >
              <Typography variant="h6" style={{ color: '#33691e', marginBottom: '12px' }}>
                🛎️ Pickup Instructions
              </Typography>
              <Typography>
                Your order number is <strong>{order?.number || 'being prepared'}</strong>.
              </Typography>
              <Typography style={{ marginTop: '8px' }}>
                Please provide this number when collecting your order from the restaurant counter.
              </Typography>
            </Box>
          )}
          
        </Box>
      </Paper>
    </Box>
  );
}

export default TrackingScreen;
