import React, { useContext, useEffect, useState } from 'react';
import './SelectPaymentScreen.css';
import axios from "axios";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Button, CircularProgress, Dialog, DialogTitle } from '@material-ui/core';
import { setPaymentType, generateQrCode, getCheckoutUrl, setOrderType, setCustomerId } from '../actions';
import { Store } from '../Store';
import config, { merchantCode } from '../util';
import { ORDER_SET_SCHEDULE_DATE } from '../constants';
import SignUp from './SignUp';
import CoffeeLogo from '../assets/image/Cofee_logo.png';
import splash1 from '../assets/image/splash1.png';
import hh from '../assets/image/take-a-coffee-sign-icon-hot-cup-vector-10871825.jpg';
import splash2 from '../assets/image/splash2.png';
import splash3 from '../assets/image/splash3.png';
import Pickup from '../assets/image/pickup.webp';
import hh2 from '../assets/image/pngtree-coffee-delivery-motorcycle-circle-retro-cycle-graphic-delivery-vector-picture-image_9850269.png'
import hh3 from '../assets/image/th.jpg';
import Delivery from '../assets/image/delivery.webp';
import SDelivery from '../assets/image/delivery.webp';

// Splash Screen Component
const SplashScreen = ({ currentSplash, onFinish }) => {
  const splashScreens = [
    { image: splash1, text: 'Welcome to Our Coffee Shop' },
    { image: splash2, text: 'Brewing Happiness Daily' },
    { image: splash3, text: 'Let’s Get Started!' },
  ];

  return (
    <div className="page-wrapper">
      <Box
        style={{
          height: '100vh',
          width: '100vw',
          backgroundImage: `url(${splashScreens[currentSplash].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Overlay */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* Skip Button */}
        <button
          onClick={onFinish}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 2,
            background: 'transparent',
            color: '#fff',
            fontSize: '1em',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          Skip
        </button>

        {/* Logo */}
        {currentSplash === 0 && (
  <img
    src={CoffeeLogo}
    alt="Coffee Logo"
    style={{
      width: '312px',
      height: '312px',
      marginBottom: '20px',
      animation: 'fadeIn 1s ease-in-out',
      zIndex: 1,
    }}
  />
)}

        {/* Title */}
    {currentSplash !== 0 && (
  <Box
    style={{
      paddingBottom: '200px', // 👈 Adjust as needed (e.g., 60px, 80px)
      zIndex: 1,
    }}
  >
    <Typography
      variant="h4"
      style={{
        color: '#fff',
        fontFamily: 'Poppins',
        fontWeight: 700,
        textAlign: 'center',
        animation: 'slideUp 1s ease-in-out',
      }}
    >
      {splashScreens[currentSplash].text}
    </Typography>

    <Typography
      variant="body1"
      style={{
        marginTop: '20px',
        color: '#CE9760',
        fontFamily: 'Poppins',
        textAlign: 'center',
        padding: '0 30px',
        animation: 'fadeIn 1.2s ease-in-out',
      }}
    >
      Lorem ipsum dolor sit amet consectetur. Vestibulum eget blandit mattis
    </Typography>
  </Box>
)}

        {/* Loading Indicator */}
        <CircularProgress
          size={30}
          style={{
            color: '#d4a017',
            marginTop: '40px',
            zIndex: 1,
          }}
        />
      </Box>
    </div>
  );
};

// CSS Animations
const styles = `
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
`;

// Add the animations to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default function HomeScreen(props) {
  const { state, dispatch } = useContext(Store);
  let { userInfo } = state.userData;
  let customerInfo = sessionStorage.getItem("customerInfo");
  if (customerInfo) {
    customerInfo = JSON.parse(customerInfo);
  }
  const styles = useStyles();
  const { selectedCurrency, order, qr } = state;

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [currentSplash, setCurrentSplash] = useState(0);

  // Manage Splash Screen Transitions
  useEffect(() => {
    if (currentSplash < 2) {
      const timer = setTimeout(() => {
        setCurrentSplash(currentSplash + 1);
      }, 2000); // Each splash screen displays for 2 seconds
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000); // Last splash screen
      return () => clearTimeout(timer);
    }
  }, [currentSplash]);

  const [userName, setUserName] = useState(customerInfo?.customer?.firstName || "");
  const [userLName, setUserLName] = useState(customerInfo?.customer?.lastName || "");
  const [number, setNumber] = useState(customerInfo?.customer?.phone || "");
  const [schedule, setSchedule] = useState("");
  const [address, setAddress] = useState(customerInfo && customerInfo.address);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [addressInputMethod, setAddressInputMethod] = useState("manual");

  const [openForm, setOpenForm] = useState(false);
  const [openSign, setOpenSign] = useState(false);
  const [isPickUp, setIsPickUp] = useState(false);
  const [isDeliver, setIsDeliver] = useState(false);
  const [isScheduleDelivery, setIsScheduleDelivery] = useState(false);
  const themeColor = '#1a1a1a'; // Dark background for coffee theme
  const themeTxtColor = '#d4a017'; // Gold accent for text

  let userData = sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : null;
  let loggedUser = sessionStorage.getItem("customerInfo") ? JSON.parse(sessionStorage.getItem("customerInfo")) : null;

  let { setting } = state.userSetting;
  console.log(setting);

  const selectHandler = (orderType) => {
    setOrderType(dispatch, orderType);

    if (orderType === "Pick Up") {
      setOpenForm(true);
      setIsPickUp(true);
      console.log("hello");
    } else if (orderType === "Schedule Delivery") {
      setOpenForm(true);
      setIsScheduleDelivery(true);
    } else {
      setOpenForm(true);
      setIsDeliver(true);
    }
  };

useEffect(() => {
  if (loggedUser && loggedUser.customer) {
    setCustomerId(dispatch, loggedUser.customer.id);
    props.history.push('/order?' + window.location.href.split('?')[1]);
  } else {
    setOpenSign(true);
  }
}, []);


  if (setting) {
    setTimeout(() => {
      let textcolor = document.getElementById("title1");
      if (textcolor) {
        textcolor.style.color = '#d4a017'; // Gold accent
      }
    }, 10);
  }

  let sokURL = window.location.href.indexOf('localhost') > 0 ? 'https://online.menulive.in' : window.location.origin;
  const baseURL = config.baseURL;
  const payURL = "https://pay.digitallive24.com";

  const getCurrency = userInfo ? userInfo.currency : "";
  const getPercent = setting ? setting.taxPercent : "";

  const [qrDetails, setQrDetails] = useState([]);

  const handleCancel = () => {
    setOpenForm(false);
    setIsPickUp(false);
    setIsDeliver(false);
    setIsScheduleDelivery(false);
    setAddress("");
    setNumber("");
    setUserName("");
    setUserLName("");
    setSchedule("");
    setUseCurrentLocation(false);
    return props.history.push('/?' + window.location.href.split('?')[1]);
  };

  const updateUserAddr = (lat, long) => {
    axios.put(`${config.authapi}/customer/${customerInfo.customer.id}`, {
      lat: lat,
      long: long,
      merchantCode: merchantCode,
    }).then(res => {
      console.log(res);
      customerInfo.customer.lat = lat;
      customerInfo.customer.long = long;
      sessionStorage.setItem("customerInfo", JSON.stringify(customerInfo));
    });
  };

  const getCurrentLocation = () => {
    console.log("######## GETTING CURRENT LOCATION ####################");
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          console.log(`Current Location (${latitude}, ${longitude})`);
          setAddress(`Current Location (${latitude}, ${longitude})`);
          setIsLoadingLocation(false);
          updateUserAddr(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          console.log("Unable to get your current location. Please enter address manually.");
          setIsLoadingLocation(false);
          setAddressInputMethod("manual");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setAddressInputMethod("manual");
    }
  };

  const handleAddressMethodChange = (method) => {
    setAddressInputMethod(method);
    if (method === "current") {
      getCurrentLocation();
    }
  };

  const handleCurrentLocationChange = (e) => {
    const checked = e.target.checked;
    setUseCurrentLocation(checked);
    if (checked) {
      getCurrentLocation();
    }
  };

  const validateTime = (dateTimeString) => {
    if (!dateTimeString) return "Please select a time";

    const selectedDate = new Date(dateTimeString);
    const selectedHour = selectedDate.getHours();
    const selectedMinute = selectedDate.getMinutes();

    if (selectedHour < userInfo?.openTime || selectedHour > userInfo?.closeTime) {
      return "Please select time while it is open!";
    }

    return "";
  };

  const handleScheduleChange = (e) => {
    const newSchedule = e.target.value;
    setSchedule(newSchedule);
  };

  const handleSubmit = () => {
    let items = [];
    console.log(order);
    let metadata = {};

    if (isPickUp) {
      metadata['schedule'] = schedule;
    } else {
      metadata['delivery'] = JSON.stringify(loggedUser.customer.email);
    }

    let eComOrdData = {
      items: items,
      metadata: metadata,
      email: loggedUser.customer.email,
      currency: "USD"
    };

    localStorage.setItem('runningOrder', JSON.stringify(eComOrdData));
    if (customerInfo) {
      customerInfo.customer.firstName = userName;
      customerInfo.customer.lastName = userLName;
      customerInfo.customer.phone = number;
      sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    }
    setOpenForm(false);
    return props.history.push('/order?' + window.location.href.split('?')[1]);
  };

  // Show Splash Screens if still active
  if (showSplash) {
    return <SplashScreen currentSplash={currentSplash} />;
  }

  return (
    <Box style={{ textAlign: "center", height: "100vh", backgroundColor: themeColor }}>
      {openSign && !loggedUser && (
        <Dialog open={true} fullWidth maxWidth="sm">
          <SignUp log={true} setOpenSign={setOpenSign} procedToCheckoutHandler={() => window.location.reload()} />
        </Dialog>
      )}
      <Dialog
        aria-labelledby="max-width-dialog-title"
        open={openForm}
        fullWidth={true}
        maxWidth={state.widthScreen ? 'sm' : 'xs'}
        style={{ backgroundColor: '#fff!important' }}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            backgroundColor: '#2a2a2a', // Darker dialog for coffee theme
          }
        }}
      >
        <DialogTitle style={{ padding: '20px 24px' }}>
          <div style={{
            fontSize: "1.5em",
            fontWeight: "600",
            borderBottom: "none",
            color: '#d4a017', // Gold text
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Playfair Display', serif",
          }}>
            {order?.orderType ? `Order Type: ${order.orderType}` : "Order Type"}
          </div>
        </DialogTitle>

        <div
  style={{
    maxHeight: "70vh",       // Limit dialog height
    overflowY: "auto",       // Enable vertical scroll
    padding: "24px",
    scrollbarWidth: "thin",  // Firefox
  }}
>

          {isPickUp && (
            <div className="note" style={{ backgroundColor: '#3a2a1a', border: '1px solid #8B4513', color: '#d4a017' }}>
              <span style={{ marginRight: "8px", fontSize: "18px" }}>⏰</span>
              {userData?.openTime && (
                <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong>Note:</strong> Pickup time is between {userData?.openTime} to {userData?.closeTime} O'clock.
                </span>
              )}
            </div>
          )}

          {isScheduleDelivery && (
            <div style={{
              marginBottom: "20px",
              backgroundColor: '#3a2a1a',
              border: "1px solid #8B4513",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#d4a017",
              fontSize: "0.95em",
              display: "flex",
              alignItems: "center",
              fontFamily: "'Poppins', sans-serif",
            }}>
              <span style={{ marginRight: "8px", fontSize: "18px" }}>⏰</span>
              <span><strong>Note:</strong> Schedule your delivery time between 10 AM and 6 PM.</span>
            </div>
          )}

          <span>
            <label style={{
              fontWeight: "600",
              display: "block",
              margin: "8px",
              fontSize: "1em",
              color: "#d4a017",
              fontFamily: "'Poppins', sans-serif",
            }}>
              Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className='userInput'
              placeholder='Name'
              defaultValue={userName}
              type='text'
              onChange={(e) => setUserName(e.target.value)}
              style={{
                backgroundColor: '#3a2a1a',
                color: '#fff',
                border: '1px solid #8B4513',
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </span>
          <span>
            <label style={{
              fontWeight: "600",
              display: "block",
              margin: "8px",
              fontSize: "1em",
              color: "#d4a017",
              fontFamily: "'Poppins', sans-serif",
            }}>
              Last Name
            </label>
            <input
              className='userInput'
              placeholder='Last Name'
              defaultValue={userLName}
              type='text'
              onChange={(e) => setUserLName(e.target.value)}
              style={{
                backgroundColor: '#3a2a1a',
                color: '#fff',
                border: '1px solid #8B4513',
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </span>
          <span>
            <label style={{
              fontWeight: "600",
              display: "block",
              margin: "8px",
              fontSize: "1em",
              color: "#d4a017",
              fontFamily: "'Poppins', sans-serif",
            }}>
              Phone No. <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type='text'
              className='userInput'
              defaultValue={number}
              placeholder='Mobile No'
              onChange={(e) => setNumber(e.target.value)}
              style={{
                backgroundColor: '#3a2a1a',
                color: '#fff',
                border: '1px solid #8B4513',
                fontFamily: "'Poppins', sans-serif",
              }}
            />
          </span>

          {isPickUp && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                fontWeight: "600",
                display: "block",
                margin: "8px",
                fontSize: "1em",
                color: "#d4a017",
                fontFamily: "'Poppins', sans-serif",
              }}>
                Schedule <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type='datetime-local'
                className='userInput'
                style={{
                  width: "100%",
                  padding: "14px",
                  border: timeError ? "2px solid #ff0000" : "1px solid #8B4513",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  backgroundColor: '#3a2a1a',
                  color: '#fff',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onChange={handleScheduleChange}
                value={schedule}
              />
            </div>
          )}

          {(isDeliver || isScheduleDelivery) && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                marginBottom: "15px",
                backgroundColor: '#3a2a1a',
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid #8B4513",
              }}>
                <div style={{
                  marginBottom: "12px",
                  fontWeight: "600",
                  fontSize: "1em",
                  color: "#d4a017",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  Select Address Method:
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  flexWrap: "wrap",
                }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "12px 16px",
                    border: "2px solid",
                    borderColor: addressInputMethod === "current" ? "#d4a017" : "#8B4513",
                    borderRadius: "8px",
                    backgroundColor: addressInputMethod === "current" ? "rgba(212, 160, 23, 0.1)" : "#3a2a1a",
                    flex: "1",
                    minWidth: "140px",
                    transition: "all 0.2s ease",
                    boxShadow: addressInputMethod === "current" ? "0 2px 8px rgba(212, 160, 23, 0.2)" : "none",
                  }}>
                    <input
                      type="radio"
                      name="addressMethod"
                      checked={addressInputMethod === "current"}
                      onChange={() => handleAddressMethodChange("current")}
                      style={{
                        marginRight: "10px",
                        transform: "scale(1.2)",
                        accentColor: "#d4a017",
                      }}
                    />
                    <span style={{
                      fontWeight: addressInputMethod === "current" ? "600" : "normal",
                      color: addressInputMethod === "current" ? "#d4a017" : "#fff",
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {isLoadingLocation ?
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "10px" }}>Getting location</span>
                          <CircularProgress size={16} style={{ color: "#d4a017" }} />
                        </span> :
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "8px", fontSize: "16px" }}>📍</span>
                          Use current location
                        </span>
                      }
                    </span>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "12px 16px",
                    border: "2px solid",
                    borderColor: addressInputMethod === "manual" ? "#d4a017" : "#8B4513",
                    borderRadius: "8px",
                    backgroundColor: addressInputMethod === "manual" ? "rgba(212, 160, 23, 0.1)" : "#3a2a1a",
                    flex: "1",
                    minWidth: "140px",
                    transition: "all 0.2s ease",
                    boxShadow: addressInputMethod === "manual" ? "0 2px 8px rgba(212, 160, 23, 0.2)" : "none",
                  }}>
                    <input
                      type="radio"
                      name="addressMethod"
                      checked={addressInputMethod === "manual"}
                      onChange={() => handleAddressMethodChange("manual")}
                      style={{
                        marginRight: "10px",
                        transform: "scale(1.2)",
                        accentColor: "#d4a017",
                      }}
                    />
                    <span style={{
                      fontWeight: addressInputMethod === "manual" ? "600" : "normal",
                      color: addressInputMethod === "manual" ? "#d4a017" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      <span style={{ marginRight: "8px", fontSize: "16px" }}>✏️</span>
                      Enter manually
                    </span>
                  </label>
                </div>
              </div>
              {addressInputMethod === "manual" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <label style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "1em",
                    color: "#d4a017",
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    className='userInput'
                    placeholder='Enter delivery address'
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "1px solid #8B4513",
                      borderRadius: "8px",
                      resize: "vertical",
                      fontSize: "15px",
                      transition: "border 0.2s ease",
                      backgroundColor: '#3a2a1a',
                      color: '#fff',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {isScheduleDelivery && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
                fontSize: "1em",
                color: "#d4a017",
                fontFamily: "'Poppins', sans-serif",
              }}>
                Schedule <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type='datetime-local'
                className='userInput'
                style={{
                  width: "100%",
                  padding: "14px",
                  border: timeError ? "2px solid #ff0000" : "1px solid #8B4513",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  backgroundColor: '#3a2a1a',
                  color: '#fff',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onChange={handleScheduleChange}
                value={schedule}
              />
              {timeError && (
                <div style={{
                  color: "#ff0000",
                  fontSize: "0.85em",
                  marginTop: "6px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  <span style={{ marginRight: "5px" }}>⚠️</span> {timeError} (Hours: 10:00 AM - 6:00 PM)
                </div>
              )}
            </div>
          )}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            marginTop: "15px",
            borderTop: "1px solid #8B4513",
          }}>
            <button
              className='c_btn'
              onClick={() => handleCancel()}
              style={{
                padding: "12px 24px",
                minWidth: "120px",
                border: "1px solid #8B4513",
                borderRadius: "8px",
                backgroundColor: '#3a2a1a',
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: '#d4a017',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Back
            </button>
            <button
              className='s_btn'
              onClick={handleSubmit}
              disabled={(isPickUp || isScheduleDelivery) && (timeError || !schedule)}
              style={{
                padding: "12px 24px",
                minWidth: "120px",
                fontWeight: "600",
                backgroundColor: '#d4a017',
                color: '#000',
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                opacity: (isPickUp || isScheduleDelivery) && (timeError || !schedule) ? "0.6" : "1",
                cursor: (isPickUp || isScheduleDelivery) && (timeError || !schedule) ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </Dialog>

      {/* <Box style={{ height: '100vh!important', backgroundColor: themeColor, padding: "20px" }}>
        <img
          src={CoffeeLogo}
          alt="Coffee Logo"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "20px",
            display: 'block',
            margin: '0 auto',
          }}
        />
        <h2 style={{
          color: '#d4a017',
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          marginBottom: '30px',
        }}>
          How would you like to collect your order?
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
        }}>
          <Card
            xs={1}
            sm={2}
            className={styles.card}
            style={{
              width: '150px',
              margin: '10px',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <CardActionArea onClick={() => selectHandler('Pick Up')} style={{ height: '100%' }}>
              <CardMedia
                component="img"
                // image={Pickup}
                  image={hh}
                className={styles.media}
                style={{ height: "166px", width: "140px", margin: "0 auto" }}
              />
              <CardContent style={{ padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{
                    margin: 0,
                    fontSize: "1.4em",
                    color: '#d4a017',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  PICK UP
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            xs={1}
            sm={2}
            className={styles.card}
            style={{
              width: '150px',
              margin: '10px',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <CardActionArea onClick={() => selectHandler('Delivery')} id='counter' style={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt="At counter"
                // image={Delivery}
                  image={hh2}
                className={styles.media}
                style={{ height: "166px", width: "140px", margin: "0 auto" }}
              />
              <CardContent style={{ padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{
                    margin: 0,
                    fontSize: "1.4em",
                    color: '#d4a017',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  DELIVERY
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card
            xs={1}
            sm={2}
            className={styles.card}
            style={{
              width: '150px',
              margin: '10px',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <CardActionArea onClick={() => selectHandler('Schedule Delivery')} style={{ height: '100%' }}>
              <CardMedia
                component="img"
                alt="Schedule Delivery"
                // image={SDelivery}
                 image={hh3}
                className={styles.media}
                style={{ height: "166px", width: "140px", margin: "0 auto" }}
              />
              <CardContent style={{ padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{
                    margin: 0,
                    fontSize: "1.4em",
                    color: '#d4a017',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  SCHEDULE DELIVERY
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </Box> */
      }
    </Box>
    
  );
}