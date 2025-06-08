import React, { useContext, useEffect, useState } from 'react';
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
import { Button, CircularProgress, Dialog,
  DialogTitle, } from '@material-ui/core';
import { setPaymentType, setOrderType, setCustomerId } from '../actions';
import { Store } from '../Store';
import config,{ getParameterByName,merchantCode} from '../util';
import { ORDER_SET_SCHEDULE_DATE } from '../constants';
import SignUp from './SignUp';

export default function HomeScreen(props) {
  const { state, dispatch } = useContext(Store);
  let { userInfo } = state.userData;
  let customerInfo = sessionStorage.getItem("customerInfo");
  if(customerInfo){
    customerInfo = JSON.parse(customerInfo);
  }
  const styles = useStyles();
  const { selectedCurrency, order, qr } = state;

  const [userName,setUserName] = useState(customerInfo?.customer?.firstName || "");
  const [userLName,setUserLName] = useState(customerInfo?.customer?.lastName || "");
  const [number,setNumber] =useState(customerInfo?.customer?.phone || "");
  const [schedule,setSchedule]= useState("");
  const [address,setAddress] =useState(customerInfo && customerInfo.address);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [timeError, setTimeError] = useState(""); // Add error state for time validation
  const [addressInputMethod, setAddressInputMethod] = useState("manual"); // Add new state for address input method
  const [locationName,setLocationName] = useState("");
 const [openForm,setOpenForm] = useState(false);
  const [openSign,setOpenSign] = useState(false);
  const [isPickUp,setIsPickUp] = useState(false);
  const [isDeliver,setIsDeliver] =useState(false);
  const [isScheduleDelivery, setIsScheduleDelivery] = useState(false);
 const themeColor = userInfo?.themeColor || '#ffbc01';  
  const themeTxtColor = userInfo?.themeTxtColor || '#000'; 
  let userData =localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null;
  let loggedUser =sessionStorage.getItem("customerInfo")?JSON.parse(sessionStorage.getItem("customerInfo")):null;

  // let {setting} = state.userSetting;
  //   console.log(setting);
  
useEffect(()=>{
  if(loggedUser&&loggedUser.customer){
   setCustomerId(dispatch,loggedUser.customer.id);
  // selectHandler("Pick Up");
  }else{
    console.log('opning login');
    setOpenSign(true);
  }
},[])


   //  if(setting){
   //   setTimeout(() => {
   //    let textcolor = document.getElementById("title1");
   //    textcolor.style.color = setting.color_primary;
   //  }, 10);
   // }




 // let sokURL = window.location.href.indexOf('localhost') > 0 ?'https://online.menulive.in':window.location.origin;
 // const baseURL =config.baseURL;
 //  const payURL = "https://pay.digitallive24.com";

 //  const getCurrency = userInfo? userInfo.currency:"";
 //  const getPercent = setting? setting.taxPercent:"";


 //  const [qrDetails, setQrDetails] = useState([])

  let getTime = new Date();
  let closeByTime = Math.floor(getTime.getTime() / 1000) + 180;
  console.log(closeByTime);

//   // const [item,setItem] =useState([]);
// console.log(state.order);
//   let items = [];
//   if (order) {
//     order.orderItems.map((o) => {
//       items.push({
//         price_data: {
//           currency: getCurrency,
//           product_data: {
//             name: o.name
//           },
//           unit_amount: o.price * 100 + (o.price * getPercent / 100) * 100
//         },
//         quantity: o.quantity
//       })
//     });
//   }

//   console.log(items);


  const selectHandler = (orderType) => {
    setOrderType(dispatch, orderType);

    if(orderType === "Pick Up"){
                setOpenForm(true);
                setIsPickUp(true);
                console.log("hello");
              }
              else if(orderType === "Schedule Delivery"){
                setOpenForm(true);
                setIsScheduleDelivery(true);
              }
              else{
                setOpenForm(true);
              setIsDeliver(true); 
            }

  };
  
  const handleCancle =()=>{
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
          return props.history.push('/?' + window.location.href.split('?')[1])
  }
  const updateUserAddr = (lat, long) => {
      axios.put(`${config.authapi}/customer/${customerInfo.customer.id}`,{
          lat: lat,
          long: long,
          merchantCode:merchantCode ,
      }).then(res=>{
          console.log(res);
          customerInfo.customer.lat =lat;
          customerInfo.customer.long =long;
          sessionStorage.setItem("customerInfo", JSON.stringify(customerInfo));
      })
  }
  const getCurrentLocation = () => {
    console.log("######## GETTING CURRENT LOCATION ####################");
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          // Ideally, use reverse geocoding for a human-readable address
          console.log(`Current Location (${latitude}, ${longitude})`);
          setAddress(`Current Location (${latitude}, ${longitude})`);
          setIsLoadingLocation(false);
          updateUserAddr(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          console.log("Unable to get your current location. Please enter address manually.");
          setIsLoadingLocation(false);
          setAddressInputMethod("manual"); // Switch to manual if location fails
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setAddressInputMethod("manual"); // Switch to manual if geolocation not supported
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

  // Add time validation function
  const validateTime = (dateTimeString) => {
    if (!dateTimeString) return "Please select a time";
    
    const selectedDate = new Date(dateTimeString);
    const selectedHour = selectedDate.getHours();
    const selectedMinute = selectedDate.getMinutes();
    
   
    if (selectedHour < userInfo.openTime || selectedHour > userInfo.closeTime) {
      return "Please select time while it is open!";
    }
    
    return ""; // No error
  };

  // Update the schedule change handler to validate in real time
  const handleScheduleChange = (e) => {
    const newSchedule = e.target.value;
    setSchedule(newSchedule);
    setTimeError(validateTime(newSchedule));
  };

  // Check if all mandatory fields are filled for delivery
  const isDeliveryFormValid = () => {
    if (isDeliver || isScheduleDelivery) {
  
      
      // For manual address entry
      if (addressInputMethod === "manual" && !address.trim()) return false;
      
      
      // scheduled delivery needs valid time
      if (isScheduleDelivery && (timeError || !schedule)) return false;
    }
    
    // pickup requires valid schedule
    if (isPickUp && (timeError || !schedule)) return false;
    
    return true;
  };

  const handleSubmit = () => {
    //console.log("Submitted with after location selection:", schedule);
    let items = [];
    // For Pick Up and Schedule Delivery, validate the schedule time
    if ((isPickUp || isScheduleDelivery) && schedule) {
      const error = validateTime(schedule);
      if (error) {
        setTimeError(error);
        return;
      }

      const selectedDate = new Date(schedule);
      const timestamp = selectedDate.getTime();

      dispatch({
        type: ORDER_SET_SCHEDULE_DATE,
        payload: timestamp,
      });
    }
  
    if(customerInfo){
      customerInfo.customer.firstName= userName;
      customerInfo.customer.lastName= userLName;
      customerInfo.customer.phone= number;
      }
      sessionStorage.setItem('customerInfo',JSON.stringify(customerInfo));

    props.history.push('/order?' + window.location.href.split('?')[1]);
  };

  


  
  return (
    <Box style={{textAlign:"center",height:"100vh",backgroundColor:themeColor}}>
{openSign && !loggedUser && <Dialog open={true} fullWidth maxWidth="sm">
  <SignUp log={true} setOpenSign={setOpenSign} procedToCheckoutHandler={()=> window.location.reload()}/>
</Dialog>}
      <Dialog
        aria-labelledby="max-width-dialog-title"
        open={openForm}
        fullWidth={true}
        maxWidth={state.widthScreen ? 'sm' : 'xs'}
        style={{backgroundColor:'#fff!important'}}
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle style={{
          padding: '20px 24px'
         
        }}>
          <div style={{
            fontSize:"1.5em", 
            fontWeight: "600", 
            borderBottom: "none", 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {order?.orderType ? `Order Type: ${order.orderType}` : "Order Type"}
          </div>
        </DialogTitle>
        
        <div style={{height:"auto", padding:"24px"}}>
          {/* Pickup Time Warning */}
          {isPickUp && 
            <div className="note">
              <span style={{marginRight: "8px", fontSize: "18px"}}>⏰</span>
              <span><strong>Note:</strong> Pickup time is between {userInfo?.openTime} to {userInfo?.closeTime} O'clock.</span>
            </div>
          }
          
          {/* Schedule Delivery Warning */}
          {isScheduleDelivery && 
            <div style={{
              marginBottom: "20px", 
              backgroundColor: "#fff8e6", 
              border: "1px solid #ffdb99", 
              borderRadius: "8px", 
              padding: "12px 16px", 
              color: "#e67700",
              fontSize: "0.95em",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{marginRight: "8px", fontSize: "18px"}}>⏰</span>
              <span><strong>Note:</strong> Schedule your delivery time between {userInfo?.openTime} to {userInfo?.closeTime}.</span>
            </div>
          }
          
          {/* Hidden fields remain the same */}
          {isPickUp &&<span>
            <label style={{
                fontWeight: "600", 
                display: "block", 
                margin: "8px",
                fontSize: "1em",
                color: "#333"
              }} >Name <span style={{color:"red"}}>*</span>  </label>
            <input className='userInput' placeholder='Name' defaultValue={userName} type='text' onChange={(e)=>setUserName(e.target.value)} />
          </span>}
          {isPickUp &&<span>
            <label style={{
                fontWeight: "600", 
                display: "block", 
                margin: "8px",
                fontSize: "1em",
                color: "#333"
              }} >Last Name </label>
            <input className='userInput' placeholder='Last Name' defaultValue={userLName} type='text' onChange={(e)=>setUserLName(e.target.value)} />
          </span>}
          {isPickUp &&<span>
            <label style={{
                fontWeight: "600", 
                display: "block", 
                margin: "8px",
                fontSize: "1em",
                color: "#333"
              }} >Phone No. <span style={{color:"red"}}>*</span> </label>
            <input type='text' className='userInput' defaultValue={number} placeholder='Mobile No'  onChange={(e)=>setNumber(e.target.value)} />
          </span>}

          {/* Pickup Schedule field with improved styling */}
          {isPickUp && 
            <div style={{marginBottom: "20px"}}>
              <label style={{
                fontWeight: "600", 
                display: "block", 
                margin: "8px",
                fontSize: "1em",
                color: "#333"
              }}>
                Schedule <span style={{color:"red"}}>*</span>
              </label>
              <input 
                type='datetime-local' 
                className='userInput' 
                style={{
                  width: "100%", 
                  padding: "14px", 
                  border: timeError ? "2px solid #ff0000" : "1px solid #ddd", 
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "all 0.2s ease"
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
                  alignItems: "center"
                }}>
                  <span style={{marginRight: "5px"}}>⚠️</span> {timeError}
                </div>
              )}
            </div>
          }
          
          {/* Delivery Address Section with improved styling and row layout */}
          {(isDeliver || isScheduleDelivery) && 
            <div style={{marginBottom: "20px"}}>
              
                
              {/* Mobile Number field - MANDATORY */}
              <div style={{marginBottom: "20px"}}>
                <label style={{
                  fontWeight: "600", 
                  display: "block", 
                  marginBottom: "8px",
                  fontSize: "1em",
                  color: "#333"
                }}>
                  Mobile Number <span style={{color:"red"}}>*</span>
                </label>
                <input 
                  type="tel" 
                  className='userInput' 
                  placeholder='Enter mobile number' 
                  onChange={(e) => setNumber(e.target.value)} 
                  value={number}
                  style={{
                    width: "100%", 
                    padding: "14px", 
                    border: !number.trim() ? "1px solid #ddd" : "1px solid #ddd", 
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border 0.2s ease"
                  }}
                />
              </div>

              {/* Name field (changed from Location Name) - OPTIONAL */}
              <div style={{marginBottom: "20px"}}>
                <label style={{
                  fontWeight: "600", 
                  display: "block", 
                  marginBottom: "8px",
                  fontSize: "1em",
                  color: "#333"
                }}>
                  Name <span style={{color:"#666", fontSize: "0.9em", fontWeight: "normal"}}>(optional)</span>
                </label>
                <input 
                  type="text" 
                  className='userInput' 
                  placeholder='Your name' 
                  onChange={(e) => setUserLName(e.target.value)} 
                  defaultValue={userName}
                  style={{
                    width: "100%", 
                    padding: "14px", 
                    border: "1px solid #ddd", 
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "border 0.2s ease"
                  }}
                />
              </div>
              
              {/* Manual address input */}
              {(
                <div style={{
                  animation: "fadeIn 0.3s ease",
                }}>
                  <label style={{
                    fontWeight: "600", 
                    display: "block", 
                    marginBottom: "8px",
                    fontSize: "1em",
                    color: "#333"
                  }}>
                    Address <span style={{color:"red"}}>*</span>
                  </label>
                  <textarea 
                    className='userInput' 
                    placeholder='Enter delivery address' 
                    onChange={(e)=>setAddress(e.target.value)} 
                    value={address}
                    rows={3}
                    style={{
                      width: "100%", 
                      padding: "14px", 
                      border: "1px solid #ddd", 
                      borderRadius: "8px", 
                      resize: "vertical",
                      fontSize: "15px",
                      transition: "border 0.2s ease",
                      ":focus": {
                        outline: "none",
                        border: "1px solid #4a90e2"
                      }
                    }}
                  />
                </div>
              )}
            </div>
          }
          
          {/* Schedule Delivery Time field with improved styling */}
          {isScheduleDelivery && 
            <div style={{marginBottom: "20px"}}>
              <label style={{
                fontWeight: "600", 
                display: "block", 
                marginBottom: "8px",
                fontSize: "1em",
                color: "#333"
              }}>
                Schedule <span style={{color:"red"}}>*</span>
              </label>
              <input 
                type='datetime-local' 
                className='userInput'
                style={{
                  width: "100%", 
                  padding: "14px", 
                  border: timeError ? "2px solid #ff0000" : "1px solid #ddd", 
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "all 0.2s ease"
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
                  alignItems: "center"
                }}>
                  <span style={{marginRight: "5px"}}>⚠️</span> {timeError} (Hours: 10:00 AM - 6:00 PM)
                </div>
              )}
            </div>
          }
          
          {/* Action Buttons with improved styling */}
          <div style={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            paddingTop: "20px", 
            marginTop: "15px",
            borderTop: "1px solid #eaeaea"
          }}>
            <button 
              className='c_btn'
              onClick={()=> handleCancle()}
              style={{
                padding: "12px 24px",
                minWidth: "120px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease"
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
                backgroundColor: themeColor,
                color: themeTxtColor,
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                opacity: (isPickUp || isScheduleDelivery) && (timeError || !schedule) ? "0.6" : "1",
                cursor: (isPickUp || isScheduleDelivery) && (timeError || !schedule) ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              Next
            </button>
          </div>
        </div>
      </Dialog>
      
      <Box  style={{height:'100vh!important',backgroundColor:themeColor,padding:"20px"}}>
        <h2> How would you like to collect order?</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <Card xs={1} sm={2} className={styles.card} style={{width: '150px', margin: '10px'}}>
            <CardActionArea onClick={() => selectHandler('Pick Up')} style={{height: '100%'}}>
              <CardMedia
                component="img"
                image="/images/pickup.png"
                className={styles.media}
                style={{height:"166px",width:"140px",margin:"0 auto"}}
              />
              <CardContent style={{padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{margin: 0,fontSize:"1.4em"}}
                >
                  PICK UP
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card xs={1} sm={2} className={styles.card} style={{width: '150px', margin: '10px'}}>
            <CardActionArea onClick={() => selectHandler('Delivery')} id='counter' style={{height: '100%'}}>
              <CardMedia
                component="img"
                alt="At counter"
                image="/images/delivery.png"
                className={styles.media}
                style={{height:"166px",width:"140px",margin:"0 auto"}}
              />
              <CardContent style={{padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{margin: 0,fontSize:"1.4em"}}
                >
                  DELIVERY
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          <Card xs={1} sm={2} className={styles.card} style={{width: '150px', margin: '10px'}}>
            <CardActionArea onClick={() => selectHandler('Schedule Delivery')} style={{height: '100%'}}>
              <CardMedia
                component="img"
                alt="Schedule Delivery"
                image="/images/sch-delivery.png"
                className={styles.media}
                style={{height:"166px",width:"140px",margin:"0 auto"}}
              />
              <CardContent style={{padding: '5px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography
                  gutterBottom
                  variant="h4"
                  color="textPrimary"
                  component="p"
                  style={{margin: 0,fontSize:"1.4em"}}
                >
                  SCHEDULE DELIVERY
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </Box>
    </Box>
  );
}
