import React, { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Paper, Box, Button, Dialog} from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { useStyles } from './styles';
import HomeIcon from '@mui/icons-material/Home';
import GradingIcon from '@mui/icons-material/Grading';
import RedeemIcon from '@mui/icons-material/Redeem';
import PlaceIcon from '@mui/icons-material/Place';
import { Menu, MenuItem,Tabs,Tab } from '@mui/material'; // Ensure proper import from Material-UI
import { getUserData, getUserSettings, validateCustomerToken } from './actions';
import ChooseScreen from './screens/ChooseScreen';
import HomeScreen from './screens/HomeScreen';
import OrderScreen from './screens/OrderScreen';
import QueueScreen from './screens/QueueScreen';
import ReviewScreen from './screens/ReviewScreen';
import PaymentScreen from './screens/PaymentScreen';
import AdminScreen from './screens/AdminScreen';
import ProfileDetails from './screens/ProfileDetails';

import SelectPaymentScreen from './screens/SelectPaymentScreen';
import CompleteOrderScreen from './screens/CompleteOrderScreen';
import SignUp from './screens/SignUp';

import CL_ChooseScreen from './clover/ChooseScreen';
import CL_HomeScreen from './clover/HomeScreen';
import CL_OrderScreen from './clover/OrderScreen';
import CL_QueueScreen from './clover/QueueScreen';
import CL_ReviewScreen from './clover/ReviewScreen';
import CL_PaymentScreen from './clover/PaymentScreen';
import CL_AdminScreen from './clover/AdminScreen';
import CL_SelectPaymentScreen from './clover/SelectPaymentScreen';
import CL_CompleteOrderScreen from './clover/CompleteOrderScreen';
import CL_SignUp from './clover/SignUp';
import CL_ProfileDetails from './clover/ProfileDetails';

import './App.css';
import config, { getParameterByName, merchantCode } from './util';

let themes = [
  {
    typography: {
      h1: { fontWeight: 'bold' },
      h2: { fontSize: '2rem', color: 'black' },
      h3: { fontSize: '1.8rem', fontWeight: 'bold', color: 'black' },
    },
    palette: {
      primary: { main: '#F3CC43' },
      secondary: { main: '#118e16', contrastText: '#ffffff' },
    },
  },
  {
    typography: {
      h1: { fontWeight: 'bold' },
      h2: { fontSize: '2rem', color: 'black' },
      h3: { fontSize: '1.8rem', fontWeight: 'bold', color: 'black' },
    },
    palette: {
      primary: { main: '#672b2b' },
      secondary: { main: '#118e16', contrastText: '#f4afaf' },
    },
  },
];

let themeInx = getParameterByName('theme')||sessionStorage.getItem('theme');
sessionStorage.setItem('theme',themeInx);
themeInx = themeInx&&themeInx.length ? parseInt(themeInx) : 0;
const theme = createTheme(themes[themeInx]);

function App({ log }) {
  const { state, dispatch } = useContext(Store);
  const history = useHistory(); // Add this hook
  const styles = useStyles();
  const [signDialog, setSignDialog] = useState(false);
  const [guest, setGuest] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabSel, setTabSel] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabSel(newValue);
  }
  const handleClose = () => {
    setMenuOpen(false);
  };
  let { userInfo } = state.userData;
  let {signInInfo} = state.signInData;

   useEffect (() => {
    if(getParameterByName('token')){
      console.log('--checking token---');
      validateCustomerToken(dispatch,getParameterByName('token'),getParameterByName('merchantCode'));
     
      setTimeout(()=>{
      const url = new URL(window.location);
      const params = new URLSearchParams(url.search);
      params.delete("token");
      console.log(params);
      console.log(window.location.href);
     window.location.href=window.location.origin+'?'+params;
      },1500)
    }
  },[])
  useEffect(async() => {
    const isHomePage = window.location.pathname === '/';
   
    await getUserData(dispatch);
    
  }, [dispatch]);

  const handleDialog = () => {
    setSignDialog(false);
    setGuest(true);
  };

  const handleLogout = () => {
    sessionStorage.clear("customerInfo");
    localStorage.removeItem('userInfo');
    setSignDialog(true);
  };
  const goto =(subpath) =>{
      history.push('/'+subpath+'?' + window.location.href.split('?')[1]);
  }
  const goToProfileHandler = () => {
    const loginData = sessionStorage.getItem('customerInfo')
      ? JSON.parse(sessionStorage.getItem('customerInfo'))
      : null;
    if (loginData !== null) {
      setAnchorEl(null); // close the menu if open
      history.push('/profile?' + window.location.href.split('?')[1]);
      window.location.reload();
      //window.location.href = `/profile`; // force reload
    } else {
      setAnchorEl(null);
      setSignDialog(true); // prompt sign up if not logged in
    }
  };

  let customerInfo = sessionStorage.getItem("customerInfo")
    ? JSON.parse(sessionStorage.getItem("customerInfo"))
    : null;
   
  let runningOrder =localStorage.getItem('runningOrder');

  if((userInfo && !userInfo.length) && localStorage.getItem('userInfo'))
  {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }
  return (
    <BrowserRouter>
        <>
          <Helmet>
            <title>Online Order</title>
          </Helmet>
          <Dialog
            aria-labelledby="max-width-dialog-title"
            open={signDialog}
            fullWidth={true}
            maxWidth={state.widthScreen ? 'sm' : 'xs'}
          >
            <div >
            {userInfo && userInfo.posProviderName && userInfo.posProviderName.toUpperCase() === 'CLOVER' && 
              <CL_SignUp handleDialog={handleDialog} setOpenSign={setSignDialog}  />
            }
             {userInfo && !userInfo.activeProviderId && <SignUp handleDialog={handleDialog} setOpenSign={setSignDialog} />}
            </div>
          </Dialog>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth={state.widthScreen ? 'xl' : 'sm'}>
              <Paper style={{overflow:"hidden"}}>
                <span>
                  {customerInfo ? (
                    // Show menu icon after login
                    <span
                      className="menu_icon"
                      id="menu-button"
                      onClick={(event) => setAnchorEl(event.currentTarget)} // Set anchor element for the menu
                      style={{ zIndex: 9999, marginRight: '20px', cursor: 'pointer' }}
                    >
                      {/* Replace with actual menu icon */}
                      <i className="fas fa-bars"></i>
                    </span>
                  ) : (
                    // Show sign-up icon before login
                    <span
                      className="sign_btn"
                      id="login-button"
                      onClick={() => setSignDialog(true)}
                      style={{ zIndex: 9999, marginRight: '20px', cursor: 'pointer' }}
                    >
                      {/* Replace with actual sign-up icon */}
                      <i className="fas fa-user-plus"></i>
                    </span>
                  )}

                  {/* Material-UI Menu */}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)} // Close menu on click outside
                    style={{ zIndex: 1300 }} // Ensure high enough z-index for visibility
                  >
                    <MenuItem onClick={() => console.log('Navigate to Past Orders')}>
                      All Orders
                    </MenuItem>
                    <MenuItem onClick={goToProfileHandler}>
                      Your Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </span>
                {userInfo && !userInfo.activeProviderId && (
                  <div>
                    <Route path="/home" component={HomeScreen} exact />
                    <Route path="/admin" component={AdminScreen} exact />
                    <Route path="/queue" component={QueueScreen} exact />
                    <Route path="/choose" component={ChooseScreen} exact />
                    <Route path="/order" component={OrderScreen} exact />
                    <Route path="/" component={SelectPaymentScreen} exact />
                    <Route path="/review" component={ReviewScreen} exact />
                    <Route
                      path="/select-payment"
                      component={SelectPaymentScreen}
                      exact
                    />
                    <Route path="/payment" component={PaymentScreen} exact />
                    <Route
                      path="/complete"
                      component={CompleteOrderScreen}
                      exact
                    />
                    <Route path="/signup" component={SignUp} exact />
                    <Route path="/profile" component={ProfileDetails} exact />
                  </div>
                )}
                {userInfo &&
                  userInfo.posProviderName &&
                  userInfo.posProviderName.toUpperCase() === 'CLOVER' && (
                    <div>
                      <Route path="/home" component={CL_HomeScreen} exact />
                      <Route path="/admin" component={CL_AdminScreen} exact />
                      <Route path="/queue" component={CL_QueueScreen} exact />
                      <Route path="/choose" component={CL_ChooseScreen} exact />
                      <Route path="/order"  component={CL_OrderScreen} exact />
                      <Route path="/" component={CL_SelectPaymentScreen} exact />
                      <Route path="/review" component={CL_ReviewScreen} exact />
                      <Route
                        path="/select-payment"
                        component={CL_SelectPaymentScreen}
                        exact
                      />
                      <Route path="/payment" component={CL_PaymentScreen} exact />
                      <Route
                        path="/complete"
                        component={CL_CompleteOrderScreen}
                        exact
                      />
                      <Route path="/signup" component={CL_SignUp} exact />
                      <Route path="/profile" component={CL_ProfileDetails} exact />
                    </div>
                  )}
                 
              </Paper>
               <Tabs
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "#3A2A1A", // Coffee-brown background matching the image
    borderTop: "2px solid #5C4033", // Slightly lighter brown border for contrast
    borderBottom: "none",
    borderRadius: "16px 16px 0 0", // Rounded top corners only
    padding: "10px 0", // Padding for better spacing
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.15)", // Softer shadow for depth
  }}
  className="footer-tab"
  value={tabSel}
  onChange={handleTabChange}
  aria-label="tabs footer"
  TabIndicatorProps={{
    style: {
      display: "none", // Disable default indicator
    },
  }}
>
  <Tab
    onClick={() => goto('home')}
    icon={<HomeIcon style={{ fontSize: "24px", color: tabSel === 0 ? "#3A2A1A" : "#FFFFFF" }} />} // Brown when selected, white otherwise
    style={{
      color: "#FFFFFF", // White text to match the image
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      textTransform: "none", // Remove uppercase
      minWidth: "0", // Allow tighter spacing
      padding: "8px 16px", // Better touch area
      position: "relative", // For pseudo-element positioning
      backgroundColor: tabSel === 0 ? "#FFFFFF" : "transparent", // White background when selected
      borderRadius: tabSel === 0 ? "16px 16px 0 0" : "0", // Rounded top corners when selected
      transition: "background-color 0.3s ease, border-radius 0.3s ease", // Smooth transition
    }}
    sx={{
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-16px", // Position the semi-circle above the tab
        left: "50%",
        transform: "translateX(-50%)",
        width: "32px", // Width of the semi-circle
        height: "16px", // Half the height since it's a semi-circle
        backgroundColor: tabSel === 0 ? "#FFFFFF" : "transparent", // Match the tab background
        borderRadius: "16px 16px 0 0", // Semi-circle shape
        transition: "background-color 0.3s ease", // Smooth transition
      },
    }}
  />
  <Tab
    onClick={() => goto('orders')}
    icon={<GradingIcon style={{ fontSize: "24px", color: tabSel === 1 ? "#3A2A1A" : "#FFFFFF" }} />}
    style={{
      color: "#FFFFFF",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      textTransform: "none",
      minWidth: "0",
      padding: "8px 16px",
      position: "relative",
      backgroundColor: tabSel === 1 ? "#FFFFFF" : "transparent",
      borderRadius: tabSel === 1 ? "16px 16px 0 0" : "0",
      transition: "background-color 0.3s ease, border-radius 0.3s ease",
    }}
    sx={{
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "32px",
        height: "16px",
        backgroundColor: tabSel === 1 ? "#FFFFFF" : "transparent",
        borderRadius: "16px 16px 0 0",
        transition: "background-color 0.3s ease",
      },
    }}
  />
  <Tab
    onClick={() => goto('stores')}
    icon={<PlaceIcon style={{ fontSize: "24px", color: tabSel === 2 ? "#3A2A1A" : "#FFFFFF" }} />}
    style={{
      color: "#FFFFFF",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      textTransform: "none",
      minWidth: "0",
      padding: "8px 16px",
      position: "relative",
      backgroundColor: tabSel === 2 ? "#FFFFFF" : "transparent",
      borderRadius: tabSel === 2 ? "16px 16px 0 0" : "0",
      transition: "background-color 0.3s ease, border-radius 0.3s ease",
    }}
    sx={{
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "32px",
        height: "16px",
        backgroundColor: tabSel === 2 ? "#FFFFFF" : "transparent",
        borderRadius: "16px 16px 0 0",
        transition: "background-color 0.3s ease",
      },
    }}
  />
  <Tab
    onClick={() => goto('rewards')}
    icon={<RedeemIcon style={{ fontSize: "24px", color: tabSel === 3 ? "#3A2A1A" : "#FFFFFF" }} />}
    style={{
      color: "#FFFFFF",
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      textTransform: "none",
      minWidth: "0",
      padding: "8px 16px",
      position: "relative",
      backgroundColor: tabSel === 3 ? "#FFFFFF" : "transparent",
      borderRadius: tabSel === 3 ? "16px 16px 0 0" : "0",
      transition: "background-color 0.3s ease, border-radius 0.3s ease",
    }}
    sx={{
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "32px",
        height: "16px",
        backgroundColor: tabSel === 3 ? "#FFFFFF" : "transparent",
        borderRadius: "16px 16px 0 0",
        transition: "background-color 0.3s ease",
      },
    }}
  />
</Tabs>
            </Container>
          </ThemeProvider>
        </>
      </BrowserRouter>
  );
}

export default App;