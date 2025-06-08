import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useLocation } from 'react-router-dom';

import {
  addToOrder,
  clearOrder,
  listCategories,
  listProducts,
  removeFromOrder,
  getUserData,
} from "../actions";

import {
  Box,
  CircularProgress,
  Dialog,
  Slide,
  Fab,
  IconButton,
  useMediaQuery,
  useTheme,
  Zoom,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";

import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'; // Add this import
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'; // Add this import

import { useStyles } from "../styles";
import CartReview from "../components/Cart_Review";
import OrderCustomize from "../components/Order_Customize";
import CartButton from "../components/Cart_Button";
import BackButton from '../components/Back_Button';
import Categories from '../components/Categories';
import ProductList from '../components/Product_List';
import SearchBar from '../components/SearchBar'; // Import SearchBar
import FeaturedSlider from '../components/FeaturedSlider'; // Add this import
import config, { getParameterByName, merchantCode } from "../util";
import ReserveTable from './ReserveTable';
import SlidingPane from "react-sliding-pane";
import SignUp from './SignUp';
import { useIntl } from "react-intl";
import onlineLogo from '../assets/image/matari-gold-logo.svg';

export default function OrderScreen(props) {
  const styles = useStyles();
  const { formatMessage: t, locale, setLocale } = useIntl();
  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  let {customizeInWizard} = state;
  const [orderItem, setOrderItem] = useState(null);
  let pgSets = {customizeInWizard};
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;
  const { orderItems = [], itemsCount = 0, totalPrice = 0, taxPrice = 0, orderType = '' } =
    state.order || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedCat, setSelectedCat] = useState("");
  const[isReservePaneOpen, setReservePaneOpen]= useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
  const [isVegOnly, setIsVegOnly] = useState(false); // Uncomment this line
  //const [isVegOnly, setIsVegOnly] = useState(false);
  //dialogs state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const anchorRef = React.useRef(null);
  const baseURL = config.baseURL;
  //let {setting} = state.userSetting;
  let { userInfo } = state.userData;
  let { promos } = state.promos;
  const themeColor = userInfo?.themeColor || '#ffbc01';  
  const themeTxtColor = userInfo?.themeTxtColor || '#000';  
  let loggedUser = sessionStorage.getItem("customerInfo");
  const [isOpenSign, setOpenSign] = useState(false);
  const selectedCurrency = state.selectedCurrency;
    let userData =localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null;
  // if (userData) {
  //   let body = document.getElementsByTagName("body");
  //   //body[0].style.backgroundColor = setting.color_tirnary;
  //   setTimeout(() => {
  //     let textcolor = document.getElementById("title1");
  //     textcolor.style.color = userData.color_primary;
  //   }, 10);
  // }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Add state for profile menu
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = React.useRef(null);
  // Add this near the top of your component, after the other useStates
  const vegSwitchStyles = {
    vegSwitchBase: {
      color: '#e0e0e0',
      '&$checked': {
        color: '#4CAF50 !important',
      },
      '&$checked + $track': {
        backgroundColor: '#4CAF50 !important',
      },
    },
    vegChecked: {},
    greenTrack: {
      backgroundColor: '#4CAF50 !important',
      opacity: 0.7,
    },
  };

  useEffect(() => {
     listCategories(dispatch);
     listProducts(dispatch);
  }, []);

  const getCurrentAddrss = () => {

    //https://dev.virtualearth.net/REST/v1/Locations/15.465810,75.005360?o=json&key=ArW_TkF5xKfdKeIe4Ac-IQaAI7Mm3FLkRbPaj0g5EqEvF01MqV5JMR-ABy2BxrPd
  }

  const closeHandler = () => {
    setIsCustomizeOpen(false);
    setIsCartOpen(false);
  };

  const vegHandler = () => {
    setIsVegOnly(!isVegOnly);
  };

  const categoryClickHandler = (cat) => {
    console.log(cat);
    setSelectedCat(cat);
    setIsCategoryMenuOpen(false);
  };

  const addToOrderHandler = (customInstr) => {
    //Set price if variety price availabe
    let varName = Object.keys(orderItem.sub_pro.variety);
    orderItem.price = varName.length
        ? parseFloat(orderItem.sub_pro.variety[varName[0]])
        : orderItem.price;

    customInstr.length && orderItem.sub_pro.cookInstructions.push(customInstr);
    console.log(orderItem);
    
    addToOrder(dispatch, { ...orderItem, quantity });
    setIsCustomizeOpen(false);
    setOrderItem(null);
    let isEditOrdItem = orderItems.filter(om => om.id == orderItem.id).length;
    isEditOrdItem && setIsCartOpen(true);
  };

  const productClickHandler = (p, isEditOrder) => {
    if (!isEditOrder) {
      p['sub_pro'] = {};
      p.sub_pro['addons'] = [];
      p.sub_pro['variety'] = {};
      p.sub_pro['cookInstructions'] = [];
    }
    setOrderItem(p);
    setIsCartOpen(false);
    setIsCustomizeOpen(!isCustomizeOpen);
  };

  const removeOrderItm = () => {
    setIsCustomizeOpen(false);
    setOrderItem(null);
    removeFromOrder(dispatch, orderItem);
  };

  const procedToCheckoutHandler = () => {
    let loginData = sessionStorage.getItem('customerInfo');
    loginData = JSON.parse(loginData);
    if (loginData !== null) {
      props.history.push("/payment?" + window.location.href.split('?')[1]);
    } else {
      setOpenSign(true);
      setIsCartOpen(false);
    }
  };

  const previewOrderHandler = () => {
    props.history.push("/payment?" + window.location.href.split("?")[1]);
  };

  const handleCart = (cartItems) => {
    console.log("Cart");
    if (cartItems == 0) return;
    setIsCartOpen(true);
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const handleBack = () => {
    if (isCartOpen || isCustomizeOpen) {
      setIsCartOpen(false);
      setIsCustomizeOpen(false);
    } else {
      props.history.push(`/choose?` + window.location.href.split("?")[1]);
    }
  };

  const handleToggle = () => {
    setIsCategoryMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setIsCategoryMenuOpen(false);
  };

  // Add handler for profile menu
  const handleProfileMenuToggle = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const handleProfileMenuClose = (event) => {
    if (profileRef.current && profileRef.current.contains(event.target)) {
      return;
    }
    setProfileMenuOpen(false);
  };

  const filteredProducts = products ? products.filter(product => 
    (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (!isVegOnly || (isVegOnly && product.cat_type.toLowerCase() === 'veg'))
  ) : [];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "./images/blank.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // get address or coords from SelectPaymentScreen
  const query = new URLSearchParams(props.location.search);
  const addressParam = query.get('address') || userData?.address;
  const latParam = query.get('lat');
  const lngParam = query.get('lng');
  const [displayAddress, setDisplayAddress] = useState("");
  // determine label based on orderType
  const isPickup = orderType?.toLowerCase().includes('pick');
  const headerLabel = isPickup ? 'Pickup at: ' : 'Delivery at: ';
  // reverse geocode if coords provided
  useEffect(() => {
    
    if (!isPickup && (latParam && lngParam)) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latParam}&lon=${lngParam}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) setDisplayAddress(data.display_name);
        })
        .catch(() => setDisplayAddress(addressParam));
    }
    if (isPickup && userData.location) {
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userData.location.coordinates[0]}&lon=${userData.location.coordinates[1]}&format=json`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.display_name) setDisplayAddress(data.display_name);
        })
        .catch(() => setDisplayAddress(addressParam));
    }
  }, []);



  return (
    <Box className={styles.root} style={{ 
      backgroundColor: "#fff",
      height: "100vh", 
      overflow: "auto",
      msOverflowStyle: "none",  /* IE and Edge */
      scrollbarWidth: "none",   /* Firefox */
      "&::-webkit-scrollbar": { 
        display: "none"         /* Chrome, Safari, Opera*/
      }
    }}>
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      <SlidingPane
        className="some-custom-class"
        overlayClassName="some-custom-overlay-class"
        isOpen={isReservePaneOpen}
        width="50%"
        onRequestClose={() => {
          setReservePaneOpen(false);
        }}
      >
        <div style={{ padding: "10px" }}>
          <ReserveTable setReservePaneOpen={setReservePaneOpen} /> 
        </div>
      </SlidingPane>

      {/* Fixed header section */}
      <Box style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0, 
        backgroundColor: '#fff',
        zIndex: 1000,
        boxShadow: 'none'
      }}>
        {/* Navigation Bar */}
        <AppBar position="static" style={{ 
          backgroundColor: 'transparent', 
          color: themeTxtColor, 
          boxShadow: 'none',
          width: '100%'
        }}>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color:"#818080" }}>
            {/* dynamic title with address */}
            <div style={{ flex: 1, textAlign: 'left', paddingLeft: '16px', fontWeight: 'bold' }}>
              {headerLabel + displayAddress}
            </div>
            {/* logo on right */}
            <div style={{ flex: 1, textAlign: 'right', paddingRight: '16px' }}>
              <img src={state.logoImg} alt="Restaurant Logo" style={{ height: '50px' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'right', paddingRight: '16px' }}></div>
          </Toolbar>
        </AppBar>

        {/* Profile Menu - Fixed positioning */}
        <Popper 
          open={profileMenuOpen} 
          anchorEl={profileRef.current} 
          role={undefined} 
          transition 
          disablePortal
          placement="bottom-end"
          style={{ zIndex: 1100 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ 
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                marginTop: '5px'
              }}
            >
              <Paper elevation={3}>
                <ClickAwayListener onClickAway={handleProfileMenuClose}>
                  <MenuList autoFocusItem={profileMenuOpen}>
                    {!loggedUser ? (
                      <MenuItem onClick={() => {
                        setOpenSign(true);
                        setProfileMenuOpen(false);
                      }}>LogIn</MenuItem>
                    ) : (
                      <>
                        <MenuItem onClick={() => props.history.push("/profile?" + window.location.href.split('?')[1])}>
                          My Profile
                        </MenuItem>
                        <MenuItem onClick={() => props.history.push("/orders?" + window.location.href.split('?')[1])}>
                          My Orders
                        </MenuItem>
                        <MenuItem onClick={() => {
                          sessionStorage.removeItem("customerInfo");
                          window.location.reload();
                        }}>
                          Sign Out
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

         {/* FeaturedSlider */}
        <FeaturedSlider 
          baseURL={baseURL}
          promos = {promos||[]}
        />

        {/* wrapper - improved spacing and alignment */}
        <Box
          style={{ 
            display: 'flex',
            alignItems: 'center',
            marginTop:"10px"
          }}
        >
          {/* Heading with adjusted margins */}
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h2" 
              style={{ 
                margin: '0 20px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1rem' : '1.5rem',
              }}
            >
              {(selectedCat && selectedCat.name) || t({ id: "explore_menu" })}
            </Typography>


          
          {/* Search and Veg container with minimized gap */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ marginLeft: isMobile ? 'auto' : "10vw" }}
            >
              {/* Search Bar */}
              <Box
                style={{ 
                  width: isMobile ? '40vw' : '50vw',
                }}
              >
                <SearchBar 
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery}
                  placeholder={t({ id: 'search_menu' }) || "Search menu items..."}
                  themeColor={themeColor}
                />
              </Box>
              
              {/* Simplified Veg toggle */}
              <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ 
                  marginLeft: isMobile ? "8px" : '5px',
                  padding: '0 4px',
                }}
              >
                <Box 
                  display="flex" 
                  alignItems="center"
                  justifyContent="center"
                >
                </Box>
                <Switch
                  checked={isVegOnly}
                  onChange={vegHandler}
                  size="small"
                  style={{
                    color: isVegOnly ? '#4CAF50' : "red",
                    margin: 0,
                    padding: 0,
                    height: 24,
                  }}
                  classes={{
                    switchBase: vegSwitchStyles.vegSwitchBase,
                    checked: vegSwitchStyles.vegChecked,
                    track: isVegOnly ? vegSwitchStyles.greenTrack : '',
                  }}
                />
                 <Typography 
                    variant="body2" 
                    style={{
                      fontWeight: 'bold',
                      color: '#7f7c7c',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                    }}
                  >
                    VEG 
                  </Typography>
              </Box>
            </Box>
        </Box>
      </Box>

      {/* Content area - adjust the top padding based on the more compact header */}
      <Box style={{ 
        overflowX:"hidden",
        height: "calc(100vh - 450px)",
        marginTop: "269px",
        overflow: 'auto',
        msOverflowStyle: "none",  /* IE and Edge */
        scrollbarWidth: "none"    /* Firefox */
      }}>
        
        
        {/* ProductList - direct without extra wrapper */}
        <ProductList 
          items={filteredProducts} 
          baseURL={baseURL}
          pgSets={pgSets}
          imageOnErrorHandler={imageOnErrorHandler}
          productClickHandler={productClickHandler}
          categories={categories ? categories : []}
          selectedCat={selectedCat}
          style={{ backgroundColor: themeColor }}
          t={t}
        />
      </Box>

      <Dialog 
        onClose={closeHandler}
        aria-labelledby="max-width-dialog-title"
        open={isCartOpen || isCustomizeOpen || isOpenSign}
        fullWidth={true}
        maxWidth={'xl'}
      >
        {isCustomizeOpen && <OrderCustomize 
          orderItem={orderItem} 
          setOrderItem={setOrderItem}
          baseURL={baseURL}
          imageOnErrorHandler={imageOnErrorHandler}
          quantity={quantity}
          categories={categories}
          setQuantity={setQuantity}
          orderItems={orderItems}
          items={products ? products : []}
          setIsCustomizeOpen={setIsCustomizeOpen}
          addToOrderHandler={addToOrderHandler}
          removeOrderItm={removeOrderItm}
          t={t}
          style={{ backgroundColor: themeColor }}
        />}

        {isCartOpen && <CartReview 
          t={t}  
          orderItems={orderItems}
          setIsCartOpen={setIsCartOpen}
          productClickHandler={productClickHandler}
          categories={categories ? categories : []}
          procedToCheckoutHandler={procedToCheckoutHandler}
          style={{ backgroundColor: themeColor }}
        />}

        {isOpenSign && <SignUp 
          log={isOpenSign} 
          setOpenSign={setOpenSign}  
          procedToCheckoutHandler={procedToCheckoutHandler}
        />}
      </Dialog>

      {itemsCount? <CartButton 
        itemsCount={itemsCount} 
        handleCart={handleCart}
        setIsCartOpen={setIsCartOpen}
        themeColor={themeColor}
      />:null}         

      {/* Floating Category Button - Enhanced */}
      <Zoom in={true}>
        <Fab 
          aria-label="categories"
          style={{ 
            position: 'fixed', 
            bottom: isMobile ? '80px' : '30px', 
            right: isMobile ? '20px' : '30px', 
            backgroundColor: themeColor, 
            color: themeTxtColor, 
            zIndex: 1000,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)'    
          }}
          onClick={handleToggle}
          ref={anchorRef}
        >
          <RestaurantMenuIcon />
        </Fab>
      </Zoom>

      <Popper open={isCategoryMenuOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{overflow:'auto',maxHeight:"400px"}}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={isCategoryMenuOpen} id="menu-list-grow">
                  {categories && categories.map((category) => (
                    <MenuItem 
                      key={category.id} 
                      onClick={() => categoryClickHandler(category)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        marginRight: '10px' 
                      }}>
                        <img 
                          src={getImageUrl(category.image)} 
                          alt={category.name} 
                          onError={imageOnErrorHandler} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      {category.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}
