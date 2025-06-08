import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  Paper,
  Container,
  Divider,
  Card,
  CardContent,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@material-ui/core";
import { useStyles } from "../styles";
import Logo from "../components/Logo";
import { Store } from "../Store";
import { Alert } from "@material-ui/lab";
import {
  createOrder,
  setPaymentType,
  generateQrCode,
  clearOrder,
  getCheckoutUrl,
  getUserData,
  setCustomerId,
} from "../actions";
import QRCode from "react-qr-code";
import axios from "axios";
import config, { getParameterByName, merchantCode } from "../util";
//import BillPrint from "./BillPrint";
import { useIntl } from "react-intl";
import BillSummary from "../components/Bill_Summary";
import TrackingScreen from './TrackingScreen';
import SafeQRCode from '../components/SafeQRCode'; // Import the safe QRCode component
import useResizeObserverSafe from '../utils/useResizeObserverSafe';
import SafeButton from '../components/SafeButton'; // Import the SafeButton component
import { CheckCircle, AccessTime, RestaurantMenu } from '@material-ui/icons';

export default function CompleteOrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { formatMessage: t, locale, setLocale } = useIntl();
  const { order, selectedCurrency, taxPercent, dineinTax, takeAwayTax } = state;
  const { loading, error, newOrder } = state.orderCreate;
  const [custId, setCustId] = useState("");
  const [orderAccepted, setOrderAccepted] = useState(false);  // State to track if restaurant accepted order
  const [checkingOrderStatus, setCheckingOrderStatus] = useState(false);  // State to track order status checking
  const [display, setDisplay] = useState(false);
  const [fontColor, setFontColor] = useState();
  const [displayOrder, setDisplayOrder] = useState(false);
  const [invData, setInvData] = useState();
  const [detailview, setDetailView] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  //const [billPrint, setBillPrint] = useState(false);
  let { setting } = state.userSetting;

  console.log(setting);
  let { userInfo } = state.userData;
  console.log(userInfo);

  const [phnumber, setPhnumber] = useState("");

  console.log(phnumber);
  let sokURL =
    window.location.href.indexOf("localhost") > 0
      ? "https://online.menulive.in"
      : window.location.origin;
  // const isPaymentAllowed = getParameterByName("isPaymentAllowed");

  const baseURL = config.baseURL;
  const userCurrency = userInfo ? userInfo.currency : "";
  const isScan = getParameterByName("isScan");

  console.log(isScan);
  const email = userInfo ? userInfo.email : "";
  const upiId = userInfo ? userInfo.paymentProviderCode : "";
  const upiName = userInfo ? userInfo.firstName + " " + userInfo.lastName : "";
  const address = userInfo ? userInfo.address : "";
  const gst = userInfo ? userInfo.taxCodeNo : "";
  const [invoiceNo, setInvoiceNo] = useState("");

  let isPaymentAllowed = setting ? setting.isPaymentAllowed : "";

  let paytimer = null;

  useEffect(() => {
    if (newOrder) {
      getInvoice();
    }
  }, [newOrder]);

  console.log(openPhone, order);
  console.log("orderInfo", state.order);

  let customerData = sessionStorage.getItem("customerInfo");
  customerData = customerData ? JSON.parse(customerData) : null;

  // console.log("customer" , customer?.user?.id);


  const createNewOrder = (customerId) => {
    if (order.orderItems.length > 0) {
      let items = order.orderItems.map((o) => {
        o["status"] = "inProgress";
        o["sub_pro"] = JSON.stringify(o.sub_pro);
        return o;
      });
      order.orderItems = items;
      order.paymentType = isPaymentAllowed ? order.paymentType : "At Counter";
      order.customerId = customerData?.customer?.id;
      order.userId = merchantCode;
      order.mac = customerData?.customer?.id;
      createOrder(dispatch, order);
      console.log("order created");
    }
  };

  useEffect(() => {
    createNewOrder();
    setDetailView(true);

  }, []);

  const getInvoice = () => {
    console.log(newOrder);
    let billData = {};
    billData.userId = merchantCode;
    billData.appName = "Online Order";
    billData.payType = "onetime";
    billData.payStatus = "paid";
    billData.purchaseItems =
      newOrder && newOrder.orderItems ? newOrder.orderItems : "";

    axios.post(`${config.payUrl}/api/new-order`, billData).then((res) => {
      setInvoiceNo(res.data.invoiceData.invoicePath);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (detailview) {
        //clearOrder(dispatch);
        //props.history.push("/?" + window.location.href.split("?")[1]);
      }
    }, 60 * 1000);
  }, [detailview]);

  const handleBack = () => {
    setDisplayOrder(false);
    return props.history.push("/?" + window.location.href.split("?")[1]);
  };
  const handleForm = () => {
    setDisplay(!display);
  };
  const backSpaceImage = () => {
    return (
      <img
        src="/images/backspace-1.png"
        alt="backSpace"
        height="40vh"
        width="40vw"
      />
    );
  };

  let appUrl = window.location.href.replace("complete", "");
  let updateUrl = appUrl.replace(/&/g, "~");
  console.log(updateUrl);

  let orderDetails = newOrder;

  let summaryPath1 = orderDetails
    ? `${window.location.origin}/app.html?serve_url=${baseURL}&orderId=${
        orderDetails ? orderDetails.id : ""
      }&merchantCode=${
        userInfo ? userInfo.merchantCode : ""
      }&currency=${userCurrency}&restaurant=${upiName}&cgst=${gst}&invoice=${invoiceNo}&sok_url=${updateUrl}`
    : "";

  if (orderDetails && orderDetails.id) {
    orderDetails.orderId = orderDetails ? orderDetails.id : "";
    orderDetails.merchantCode = userInfo ? userInfo.merchantCode : "";
    orderDetails.currency = userCurrency;
    orderDetails.restaurant = upiName;
    orderDetails.address = address;
    // address:
    //   userData || merchantData ? merchantData.address || userData.address : "",
    orderDetails.cgst = gst;
    orderDetails.invoice_no = invoiceNo;
  }

  let paymentUrl = orderDetails
    ? `upi://pay?pn=${upiName}&pa=${upiId}&am=${orderDetails.totalPrice}&tn=${orderDetails.number}`
    : "";

  const handleSubmit = () => {
    let msgtext = `${encodeURI(summaryPath1)}`;
    axios
      .post(baseURL.replace("apps", "cms") + "/api/send-sms-msg", {
        toMobile: `+91${phnumber}`,
        msgConent: msgtext,
      })
      .then((res) => {
        setPhnumber("");
      });
  };

  const handlePayment = () => {
    setDetailView(true);
    if (paytimer) {
      clearInterval(paytimer);
    }

    createNewOrder();
  };

  const handleCounter = () => {
    if (paytimer) {
      clearInterval(paytimer);
    }
    setDetailView(true);
    createNewOrder();
  };
  
  function validateNumber(event) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46];

    if (
      !(
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105) ||
        excludedKeys.includes(keyCode)
      )
    ) {
      event.preventDefault();
    }
  }

  let PrintInterface = true;

  // Handle pay button click with extra protection
  const handlePaymentSafe = (e) => {
    // Prevent default to avoid any browser quirks
    if (e) e.preventDefault();
    
    // Use setTimeout to avoid immediate render which could cause ResizeObserver issues
    setTimeout(() => {
      setDetailView(true);
      if (paytimer) {
        clearInterval(paytimer);
      }
      createNewOrder();
    }, 50);
  };

  // Safe counter button handler
  const handleCounterSafe = (e) => {
    if (e) e.preventDefault();
     props.history.push('/payment?' + window.location.href.split('?')[1]);
    // setTimeout(() => {
    //   if (paytimer) {
    //     clearInterval(paytimer);
    //   }
    //   setDetailView(true);
    //   createNewOrder();
    // }, 50);
  };

  // Add a resize observer ref to the root element
  const handleRootResize = () => {
    // Empty handler to prevent loop errors
  };
  const rootRef = useResizeObserverSafe(handleRootResize);

  // Add custom styles for this component
  const usePaymentStyles = makeStyles((theme) => ({
    paymentRoot: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
    },
    paymentContainer: {
      backgroundColor: 'white',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      padding: theme.spacing(4),
      maxWidth: 500,
      width: '100%',
      marginTop: theme.spacing(2),
    },
    pageTitle: {
      fontWeight: 600,
      marginBottom: theme.spacing(3),
      color: theme.palette.primary.main,
      textAlign: 'center',
    },
    qrContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      alignItems: 'center',
      marginTop: theme.spacing(3),
    },
    paymentButton: {
      width: '100%',
      padding: theme.spacing(1.5),
      fontWeight: 'bold',
    },
    counterButton: {
      width: '100%',
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: theme.palette.grey[900],
      },
      padding: theme.spacing(1.5),
      fontWeight: 'bold',
    },
    orderSuccess: {
      textAlign: 'center',
      marginBottom: theme.spacing(3),
    },
    orderNumber: {
      fontWeight: 'bold',
      fontSize: '1.5rem',
      color: theme.palette.secondary.main,
    },
    orderAgainBtn: {
      marginTop: theme.spacing(3),
    },
    statusCard: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
    statusPending: {
      borderLeft: `4px solid ${theme.palette.warning.main}`,
    },
    statusAccepted: {
      borderLeft: `4px solid ${theme.palette.success.main}`,
    },
    statusContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: theme.spacing(2),
    },
    statusIcon: {
      fontSize: '2rem',
    },
    statusMessage: {
      fontWeight: 500,
    },
    statusProgress: {
      marginTop: theme.spacing(2),
    },
    orderStep: {
      padding: theme.spacing(2, 0),
    },
    stepperRoot: {
      backgroundColor: 'transparent',
      padding: 0,
      marginBottom: theme.spacing(3),
    },
    mapContainer: {
      width: '100%',
      height: 'auto',
      minHeight: 300,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        minHeight: 250,
      },
    },
    fullWidthMap: {
      width: '100%',
      border: '1px solid #eee',
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
    }
  }));

  // Function to check if order has been accepted
  const checkOrderAcceptance = async () => {
    if (!newOrder || !newOrder.id) {
      return;
    }
    
    setCheckingOrderStatus(true);
    try {
      const response = await axios.get(
        `https://menuapi.menulive.in/api/temporders/${newOrder.id}/?merchantCode=${merchantCode}`
      );
      // const response = await axios.get(
      //   `https://inventory-service-gthb.onrender.com/api/temporders/${newOrder.id}/?merchantCode=${merchantCode}`
      // );
      
      if (response.data && response.data.orderStatus === "ACCEPTED") {
        setOrderAccepted(true);
     
        setDetailView(true);
      }
    } catch (error) {
      console.error('Error checking order status:', error);
    } finally {
      setCheckingOrderStatus(false);
    }
  };

  useEffect(() => {
    if (newOrder && newOrder.id) {
      checkOrderAcceptance();
      window.statusCheckInterval = setInterval(() => {
        checkOrderAcceptance();
      }, 30000);
      return () => {
        if (window.statusCheckInterval) {
          clearInterval(window.statusCheckInterval);
          window.statusCheckInterval = null;
        }
      };
    }
  }, [newOrder]);

  const paymentStyles = usePaymentStyles();
  
  const OrderStatusIndicator = () => {
    return (
      <Card className={`${paymentStyles.statusCard} ${orderAccepted 
        ? paymentStyles.statusAccepted 
        : paymentStyles.statusPending}`}
      >
        <Box className={paymentStyles.statusContent}>
          {orderAccepted ? (
            <CheckCircle className={paymentStyles.statusIcon} style={{ color: "#388e3c" }} />
          ) : (
            <AccessTime className={paymentStyles.statusIcon} style={{ color: "#f57c00" }} />
          )}
          <Box>
            <Typography variant="h6" className={paymentStyles.statusMessage}>
              {order && order.orderType === 'Pick Up' 
                ? (orderAccepted 
                    ? "Your order is ready for pickup!" 
                    : "Waiting for restaurant to confirm your order...")
                : (orderAccepted 
                    ? "Restaurant has accepted your order!" 
                    : "Waiting for restaurant to accept your order...")
              }
            </Typography>
            {!orderAccepted && (
              <Typography variant="body2" color="textSecondary">
                This usually takes 1-2 minutes. Please wait.
              </Typography>
            )}
          </Box>
        </Box>
        
        {!orderAccepted && (
          <Box className={paymentStyles.statusProgress}>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </Card>
    );
  };


  return (
    <Box
      id="paymentroot"
      ref={rootRef}
      className={[styles.root1, styles.navy]}
      style={{
        backgroundColor: state.selectedBgColor || "white",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Box className={[styles.main1, styles.center, paymentStyles.paymentRoot]}>
          <Paper className={paymentStyles.paymentContainer} elevation={3}>
            {!orderDetails && loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : (
              <>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="h1"
                  id="title2"
                  className={paymentStyles.pageTitle}
                >
                  {detailview || isPaymentAllowed
                    ? t({ id: "order_placed" })
                    : t({ id: "process_payment" })}
                </Typography>

                <Divider style={{ marginBottom: 16 }} />

                {!detailview && orderDetails && orderDetails.totalPrice ? (
                  <Card variant="outlined" style={{ marginBottom: 16 }}>
                    <CardContent>
                      <BillSummary
                        totalPrice={orderDetails.totalPrice}
                        taxPrice={orderDetails.taxPrice}
                        t={t}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  ""
                )}

                {(detailview || isPaymentAllowed) && orderAccepted && (
                  <Box className={paymentStyles.orderSuccess}>
                    <Typography variant="h5" component="div" style={{ 
                      marginTop: 10,
                      marginBottom: 10,
                      color: "#388e3c", 
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ marginRight: 8 }}>✅</span>
                      Order Confirmed
                    </Typography>
                  </Box>
                )}
                {(detailview || isPaymentAllowed) && (
                  <OrderStatusIndicator />
                )}

                {false && (detailview || isPaymentAllowed) ? (
                  <Box className={paymentStyles.orderSuccess}>
                    <Typography variant="h6" component="div">
                      Token #
                      <span className={paymentStyles.orderNumber}>{orderDetails.number}</span>
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}

                {upiId && isScan !== "true" ? (
                  <Typography 
                    variant="h6"
                    align="center"
                    style={{ fontWeight: "bold", margin: "10px 0" }}
                  >
                    {!detailview ? t({ id: "scan_to_pay" }) : ""}
                  </Typography>
                ) : (
                  ""
                )}

                {!detailview ? (
                  <div>
                    {upiId && isScan !== "true" ? (
                      <Box className={paymentStyles.qrContainer}>
                        <SafeQRCode
                          value={paymentUrl}
                          style={{
                            height: "180px",
                            maxWidth: "180px",
                            width: "180px",
                            marginTop: "16px",
                            marginBottom: "16px",
                          }}
                        />
                      </Box>
                    ) : (
                      ""
                    )}
                    
                    {upiId && isScan === "true" && !detailview ? (
                      <Box 
                        display="flex" 
                        justifyContent="center" 
                        alignItems="center" 
                        mt={3} 
                        mb={3}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          href={paymentUrl}
                          target="_blank"
                          style={{ fontSize: "18px", fontWeight: "bold", padding: "10px 24px" }}
                        >
                          UPI Pay
                        </Button>
                      </Box>
                    ) : (
                      " "
                    )}
                    
                    <Box className={paymentStyles.buttonContainer}>
                      {upiId && !detailview && (
                        <SafeButton
                          variant="contained"
                          color="primary"
                          className={paymentStyles.paymentButton}
                          onClick={handlePaymentSafe}
                          fullWidth
                        >
                          {t({ id: "payment_done" })}
                        </SafeButton>
                      )}

                      <SafeButton
                        variant="contained"
                        className={paymentStyles.counterButton}
                        onClick={handleCounterSafe}
                        fullWidth
                      >
                        {t({ id: "pay_at_counter" })}
                      </SafeButton>
                      <SafeButton
                        variant="contained"
                        className={paymentStyles.counterButton}
                        onClick={handleCounterSafe}
                        fullWidth
                      >
                        UPI
                      </SafeButton>
                    </Box>
                  </div>
                ) : (
                  ""
                )}
                
                {detailview || isPaymentAllowed ? (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    {false && (
                      <SafeQRCode
                        value={encodeURI(summaryPath1)}
                        style={{
                          height: "150px",
                          maxWidth: "150px",
                          width: "150px",
                          marginTop: "20px",
                        }}
                      />
                    )}
                    
                    {/* Show pickup instructions if this is a pickup order */}
                    {(detailview || isPaymentAllowed) && orderAccepted && order && order.orderType === 'Pick Up' && (
                      <Box 
                        my={3}
                        p={3}
                        style={{
                          border: '2px solid #4CAF50',
                          borderRadius: '8px',
                          backgroundColor: '#F1F8E9',
                          textAlign: 'center'
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2E7D32',
                            marginBottom: '8px'
                          }}
                        >
                          <RestaurantMenu style={{ marginRight: '8px' }} />
                          Pickup Instructions
                        </Typography>
                        <Typography>
                          Your order is confirmed and will be ready for pickup soon.
                        </Typography>
                        <Typography style={{ marginTop: '8px', fontWeight: 'bold' }}>
                          Please collect your order from the restaurant counter.
                        </Typography>
                        {orderDetails && orderDetails.number && (
                          <Typography style={{ marginTop: '16px', fontSize: '20px' }}>
                            Order #: <span style={{ fontWeight: 'bold', color: '#2E7D32' }}>{orderDetails.number}</span>
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Show map/tracking only when order is accepted and not pickup */}
                    {(detailview || isPaymentAllowed) && orderAccepted && order && order.orderType !== 'Pick Up' && (
                      <Box 
                        my={3}
                        className={paymentStyles.mapContainer}
                        boxShadow={3}
                        borderRadius="borderRadius"
                        overflow="hidden"
                        style={{
                          border: '2px solid #e0e0e0',
                          position: 'relative'
                        }}
                      >
                        <Typography
                          variant="h6"
                          style={{
                            backgroundColor: '#f5f5f5',
                            padding: '10px 16px',
                            borderBottom: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{ 
                            backgroundColor: '#4caf50', 
                            width: '10px', 
                            height: '10px', 
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}></span>
                          Live Tracking
                        </Typography>
                        {/* <TrackingScreen className={paymentStyles.fullWidthMap} /> */}
                      </Box>
                    )}

                    <SafeButton
                      variant="contained"
                      color="primary"
                      className={paymentStyles.orderAgainBtn}
                      onClick={() => handleBack()}
                    >
                      Order Again
                    </SafeButton>
                  </Box>
                ) : (
                  ""
                )}

                {false &&
                isScan === "true" &&
                (detailview || isPaymentAllowed) ? (
                  <Box textAlign="center" mt={2}>
                    <Typography variant="subtitle1">( OR )</Typography>
                    <Box mt={2}>
                      <Button
                        href={encodeURI(summaryPath1)}
                        target="_blank"
                        color="primary"
                        variant="outlined"
                      >
                        Click Here
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  " "
                )}
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
