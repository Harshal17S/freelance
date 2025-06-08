import React, { useContext, useEffect, useState } from "react";
import config, { getParameterByName, merchantCode } from "../util";
import { Store } from "../Store";
// import './OrderScreenTheme.css';
import './OrderScreenTheme.css';
import Chip from "@mui/material/Chip";
import axios from "axios";
import Slider from "react-slick";
import SearchBar from '../components/SearchBar'; 
import { addToOrder, clearOrder, removeFromOrder } from "../actions";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  ClickAwayListener,
  Slide,
  MenuList,
  MenuItem,
  Zoom,
  Popper,
  Grow,
  Paper,
    Fab,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Alert } from "@material-ui/lab";
import { useStyles } from "../styles";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import ReviewScreen from "./ReviewScreen";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import Categories from "./Categories"
import onlineLogo from '../assets/image/matari-gold-logo.svg';
import bgImg from '../assets/image/bg.jpg';

export default function OrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { orderItems, itemsCount, totalPrice, taxPrice, orderType } =
    state.order;
  const {promos} = state.order;
  const selectedCurrency = state.selectedCurrency;
  const [totalProducts, setTotalProducts] = useState([]);
  const [totalAddons, setTotalAddons] = useState([]);
  const [itemGroup, setItemGrorp] = useState([]);
  const [filterItmGrp, setFilterItmGrp] = useState([]);
  const [itemGrpId, setItemGrpId] = useState("");
  const [addonsGroup, setAddonsGroup] = useState([]);
   const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [addons, setAddons] = useState([]);
  const [subPro, setSubPro] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categoryProductMap, setCategoryProductMap] = useState({});
  const [currAdd, setCurrAdd]  = useState("");
  const baseURL = config.baseURL;
  const anchorRef = React.useRef(null);
  let { setting } = state.userSetting;
  let { userInfo } = state.userData;
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  let currSymbol= {
    'usd':"$",
    'inr':"₹"
  }

   const [product, setProduct] = useState([]);

  const closeHandler = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    console.log("---getting adons---");

    if (!totalAddons.length && userInfo) {
      axios
        .get(
          `${baseURL}/api/clover/product-modifiers?merchantCode=${merchantCode}`
        )
        .then((res) => {
          let adon = res.data.map((ad) => {
            ad["quantity"] = 0;
            return ad;
          });

          setTotalAddons(adon);
        });
    }
    document.getElementById("footer").style.display = "none";
  }, []);
  
  const getCurrentAddrss = () => {
     let lat = getParameterByName('lat') && getParameterByName('lat')!='null'?getParameterByName('lat'):15.4618532824293 ;
     let long = getParameterByName('long') && getParameterByName('long') != 'null'?getParameterByName('long'):74.9999533120186;
     console.log(lat);
     if(lat && long){
     axios
      .get(`https://dev.virtualearth.net/REST/v1/Locations/${lat},${long}?o=json&key=ArW_TkF5xKfdKeIe4Ac-IQaAI7Mm3FLkRbPaj0g5EqEvF01MqV5JMR-ABy2BxrPd`)
      .then((res) => {
        console.log(res);
        if(res.data.resourceSets[0]?.resources[0].name ){
        setCurrAdd(res.data.resourceSets[0].resources[0].name );
        localStorage.setItem('address', res.data.resourceSets[0].resources[0].name);
        }
      })
       .catch((error) => {
        console.log(error);
       })

       }
  }
 
  useEffect(() => {
    //enable for only delivery
    //getCurrentAddrss();

    axios
      .get(`${baseURL}/api/clover/products?merchantCode=${merchantCode}`)
      .then((res) => {
        const products = res.data;
        setTotalProducts(products);

        // Create mapping of category IDs to products
        const map = {};
        const categorySet = new Set();

        products.forEach((product,i) => {
          if (
            product.category &&
            product.category.elements &&
            product.category.elements.length > 0
          ) {
            if(!selectedCat && i==1){
              setSelectedCat(product.category?.elements[0]?.id||"");
            }
            const categoryId = product.category.elements[0].id;
            const categoryName = product.category.elements[0].name;

            if (!map[categoryId]) {
              map[categoryId] = {
                name: categoryName,
                products: [],
              };
            }
            map[categoryId].products.push(product);
            categorySet.add(categoryId);
          }
        });

        setCategoryProductMap(map);
        setLoadingProducts(false);
        document.getElementById("order-root").style.backgroundImage='url('+bgImg+')';
      })
      .catch((error) => {
        setLoadingProducts(false);
        setErrorProducts("Failed to load products");
      });
  }, [baseURL, merchantCode]);

  const categoryClickHandler = (cat) => {
    console.log(cat);
    setSelectedCat(cat);
    setIsCategoryMenuOpen(false);
  };

  const productClickHandler = (p) => {
    console.log(p);

    console.log(orderItems);
    let existingOrder = orderItems.filter((o) => o.id === p.id);
    console.log(existingOrder);
    setProduct(p);

    if (existingOrder.length) {
      setQuantity(existingOrder[0].quantity);
    } else {
      setQuantity(1);
    }

    if (p.modifierGroups) {
      let adGrp = p.modifierGroups.elements.length
        ? p.modifierGroups.elements
        : [];
      console.log(adGrp);
      setAddonsGroup(adGrp);
      let adItems = [];
      adGrp.filter((it) => {
        totalAddons.filter((ad) => {
          if (ad.category === it.id) {
            adItems.push(ad);
          }
        });
      });
      console.log(adItems);
      setAddons(adItems);
    } else if (p.add_ons) {
      console.log(p.add_ons.split(","));
      let adongrp = [];
      p.add_ons.split(",").map((i) => {
        addonsGroup.map((ad) => {
          if (i === ad.id) {
            adongrp.push(ad);
          }
        });
      });
      let adItms = [];
      adongrp.map((ag) => {
        totalProducts.map((pro) => {
          if (ag.id === pro.category) {
            console.log(pro);
            pro["quantity"] = 0;
            adItms.push(pro);
          }
        });
      });
      setAddons(adItms);
    }

    setIsOpen(true);
  };
  console.log(addons);
  const handleAddonClick = (addon) => {
    setSelectedAddons((prev) => {
      if (prev.includes(addon._id)) {
        return prev.filter((id) => id !== addon._id);
      } else {
        return [...prev, addon._id];
      }
    });
  };

  const addToOrderHandler = () => {
    product["sub_pro"] = JSON.stringify(subPro.map((li) => li));
    product["addons"] = selectedAddons.map((id) =>
      addons.find((addon) => addon._id === id)
    );

    addToOrder(dispatch, { ...product, quantity });

    console.log(product);
    let adons = totalAddons.map((ad) => {
      ad.quantity = 0;
      return ad;
    });

    setTotalAddons(adons);
    setAddons([]);
    setIsOpen(false);
    setQuantity(1);
    setSubPro([]);
    setSelectedAddons([]);
  };

  const cancelOrRemoveFromOrder = () => {
    let adons = totalAddons.map((ad) => {
      ad.quantity = 0;
      return ad;
    });

    setTotalAddons(adons);
    setAddons([]);
    setSubPro([]);
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const previewOrderHandler = () => {
    props.history.push(`/select-payment?` + window.location.href.split("?")[1]);
  };
 
  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const itemGroupHandle = (itmgrpId) => {
    setItemGrpId(itmgrpId);
  };

  let ItemsWithGrp = filterItmGrp.length ? filterItmGrp : totalProducts;

  return (
    <Box
      className={styles.root}
      style={{ padding: "0px!important", backgroundColor: "#543A20" }} // Updated background color
      id={"order-root"}
    >
    <div style={{height:"50px",width:"100%",display:"flex",justifyContent:"space-between",padding:"5px"}}>
    <div style={{paddingTop:"1px",maxWidth:"150px", color: "##654321", fontfamily: 'Pacifico', fontWeight: 500}}>
      PickUp at<br/>
      {'Matari Cafe, Canton'}
    </div>
    <img style={{maxWidth:"80px"}} src={onlineLogo} />
    <div style={{width:"100px"}}></div>
    </div>
      {!isPaneOpen && orderItems.length ? <div
        className='cart'
      >
        <ShoppingBasketIcon
          height="170px"
          width="170px"
          onClick={() => setIsPaneOpen(true)}
          style={{ color: "#FFFFFF" }}
        />
        <span
          style={{
            color: "#FFFE25",
            fontSize: "1.2em",
            position: "absolute",
            top: "4px",
            left: "32px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {itemsCount}
        </span>
      </div>:""}
      <div className={styles.promo} style={{padding:"0px 10px", maxHeight:"200px", overflow:"hidden"}}>
        <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
          <div >
            <img style={{borderRadius:"10px"}} src="./images/banner-1.JPG" className={styles.promoImg} />
          </div>
          <div >
            <img style={{borderRadius:"10px"}} src="./images/banner-2.JPG" className={styles.promoImg} />
          </div>
          <div >
            <img style={{borderRadius:"10px"}} src="./images/banner-3.JPG" className={styles.promoImg} />
          </div>
          <div >
            <img style={{borderRadius:"10px"}} src="./images/banner-4.JPG" className={styles.promoImg} />
          </div>
        </Slider>
      </div>
     {false && <div id="search-hold" style={{margin:"10px",textAlign:"center",width:"100%",display:"flex",
    justifyContent:"center",position:"absolute",top:"60px"}}>
      <SearchBar style={{maxWidth:"300px"}}
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery}
                  placeholder={"Search menu items..."}
                  
                /></div>}
       <Categories 
        catPros={categoryProductMap} 
        selectedCat={selectedCat}
        imageOnErrorHandler={imageOnErrorHandler}
        categoryClickHandler={categoryClickHandler}
        />
      <SlidingPane
        className="slide-pane-review"
        overlayClassName="some-custom-overlay-class"
        isOpen={isPaneOpen}
        onRequestClose={() => {
          setIsPaneOpen(false);
        }}
      >
        <div >
          <ReviewScreen setIsPaneOpen={setIsPaneOpen} />
        </div>
      </SlidingPane>
      <Dialog
        onClose={closeHandler}
        aria-labelledby="max-width-dialog-title"
        open={isOpen}
        maxWidth={"50%"}
      >
        <DialogTitle className={styles.center}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", color: "#543A20" }}>
            Add {product.name}
          </h2>
        </DialogTitle>
        <Box className="customize-box" style={{ display: "flex", flexDirection: "row" }}>
          <Box style={{ flex: "0 0 40%" }}>
            <Card
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                alt={product.name}
                onError={imageOnErrorHandler}
                image={`https://cloverstatic.com/menu-assets/items/${product._id}.jpeg`}
                style={{ width: "100%", height: "auto", maxHeight: "500px", marginBottom: "20px", paddingLeft: "20px" }}
              />
            </Card>
          </Box>
          <Box style={{ flex: "0 0 60%", overflowY: "auto" }}>
            <Box style={{ padding: "10px" }}>
              <Typography
                variant="h5"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#543A20" }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#543A20" }}
              >
                {currSymbol[selectedCurrency]} {product.price}
              </Typography>
              <Box className={[styles.countRow, styles.center, styles.countHolder]} style={{ marginTop: "10px" }}>
                <Button
                  id="minus_btn"
                  variant="contained"
                  disabled={quantity === 1}
                  onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
                  style={{ marginRight: "10px", backgroundColor: "#CE9760", color: "#FFFFFF" }} // Updated primary color
                >
                  <RemoveIcon />
                </Button>
                <TextField
                  inputProps={{ className: styles.largeInput }}
                  InputProps={{
                    bar: true,
                    inputProps: {
                      className: styles.largeInput,
                    },
                  }}
                  className="largeNumber"
                  type="number"
                  variant="filled"
                  min={1}
                  value={quantity}
                />
                <Button
                  id="plus_btn"
                  variant="contained"
                  onClick={(e) => setQuantity(quantity + 1)}
                  style={{ marginLeft: "10px", backgroundColor: "#CE9760", color: "#FFFFFF" }} // Updated primary color
                >
                  <AddIcon sx={{ fontSize: "1px" }} />
                </Button>
              </Box>
            </Box>
            <Box style={{ margin: "10px" }}>
              {addonsGroup.length
                ? addonsGroup.map((addGroup) => (
                  <Box key={addGroup.id}>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", color: "#543A20" }}>
                      {addGroup.name.toUpperCase()}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                    >
                      {addons
                        .filter((addon) =>
                          addGroup.modifierIds.split(",").includes(addon._id)
                        )
                        .map((itm) => (
                          <Card
                            className={`addon-card ${selectedAddons.includes(itm._id)
                              ? "selected"
                              : ""
                              }`}
                            key={itm._id}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              height: "auto",
                              minHeight:"50px",
                              width: "auto",
                              minWidth:"120px",
                              margin: "10px",
                              border: "1px solid #CE9760", // Updated primary color for border
                              justifyContent: "center",
                              alignItems: "center",
                              padding:"4px 10px",
                              backgroundColor: selectedAddons.includes(itm._id)
                                ? "#CE9760" // Updated primary color for selected state
                                : "#6B4E2A", // Slightly lighter shade of background color
                              cursor: "pointer",
                            }}
                            onClick={() => handleAddonClick(itm)}
                          >
                            <CardContent
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontFamily: "'Poppins', sans-serif", color: "#FFFFFF" }}>
                                <strong>{itm.name}</strong>
                              </span>
                              <span style={{ marginTop: "5px", fontFamily: "'Poppins', sans-serif", color: "#FFFFFF" }}>
                                {currSymbol[selectedCurrency]} {itm.price}
                              </span>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </Box>
                ))
                : ""}
            </Box>
            <Box
              className={[styles.row, styles.around]}
              style={{ marginBottom: "5px" }}
            >
              <Button
                onClick={cancelOrRemoveFromOrder}
                variant="outlined"
                color="primary"
                size="large"
                className={[styles.largeButton, styles.card]}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#543A20",
                  borderColor: "#CE9760", // Updated primary color for border
                }}
              >
                {orderItems.find((x) => x.name === product.name)
                  ? "Remove"
                  : "Cancel"}
              </Button>
              <Button
                onClick={addToOrderHandler}
                variant="contained"
                color="primary"
                size="large"
                className={styles.largeButton}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: "#CE9760", // Updated primary color
                  color: "#FFFFFF",
                }}
              >
                ADD
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
       {false && !isPaneOpen && <Zoom in={true}>
        <Fab 
          aria-label="categories"
          style={{ 
            position: 'fixed', 
            bottom:'30px', 
            right:'30px', 
            color: "#000000",
            backgroundColor: "#543A20", // Updated background color
            zIndex: 1000,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)'    
          }}
          onClick={() => setIsCategoryMenuOpen(true)}
          ref={anchorRef}
        >
          <RestaurantMenuIcon />
        </Fab>
      </Zoom>}
      <Popper open={isCategoryMenuOpen} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{overflow:'auto',maxHeight:"400px",zIndex:"9999999999"}}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setIsCategoryMenuOpen(false)}>
                <MenuList autoFocusItem={isCategoryMenuOpen} id="menu-list-grow">
                  {Object.keys(categoryProductMap).map((category) => (
                    <MenuItem 
                      key={category} 
                      onClick={() => categoryClickHandler(category)}
                      style={{ display: 'flex', alignItems: 'center', backgroundColor: '#543A20', color: "#FFFFFF", fontFamily: "'Poppins', sans-serif" }} // Updated background color
                    >
                      {categoryProductMap[category].name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Grid container style={{height:"calc(100vh - 450px)"}}>
        {Object.keys(categoryProductMap).filter(catId => (searchQuery || catId == selectedCat)).map((categoryId) => {
          const { name, products } = categoryProductMap[categoryId];

          return (
            <React.Fragment key={categoryId}>
              <Grid container spacing={2} rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 3, lg: 4 }}>
                {loadingProducts ? (
                  <CircularProgress />
                ) : errorProducts ? (
                  <Alert severity="error">{errorProducts}</Alert>
                ) : (
                  products.filter(p => p.name.toLowerCase().indexOf(searchQuery.toLowerCase()) != -1).map((it) => (
                    <React.Fragment key={it._id}>
                      <Slide direction="up" in={true} style={{textAlign:"center"}}>
                        <Grid item xs={6} lg={3} md={4} sm={11}>
                         <Card
  onClick={() =>
    it.userId
      ? productClickHandler(it)
      : itemGroupHandle(it._id)
  }
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    minHeight: "320px",
    border: "1px solid #CE9760",
    backgroundColor: "#F3E4C8",
    borderRadius: "8px",
    padding: "10px"
  }}
>
  <CardActionArea>
    <CardContent style={{ padding: "0" }}>
      <div style={{
        width: "100%",
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px",
        background: "#fff",
        borderRadius: "6px",
        overflow: "hidden"
      }}>
        <img
          src={`https://cloverstatic.com/menu-assets/items/${it._id}.jpeg`}
          onError={imageOnErrorHandler}
          alt={it.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
        />
      </div>
      <Typography
        variant="body1"
        style={{
          fontWeight: 600,
          fontSize: "16px",
          color: "#000000",
          marginBottom: "8px"
        }}
      >
        {it.name}
      </Typography>
      {it.price && (
        <Typography
          variant="body2"
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#444",
            marginBottom: "10px"
          }}
        >
          ${parseFloat(it.price).toFixed(2)}
        </Typography>
      )}
      <div style={{
        alignSelf: "flex-end",
        border: "1px solid #aaa",
        borderRadius: "4px",
        padding: "2px 10px",
        width: "fit-content",
        cursor: "pointer"
      }}
        onClick={(e) => {
          e.stopPropagation();
          productClickHandler(it);
        }}
      >
        <AddIcon style={{ color: "#000" }} />
      </div>
    </CardContent>
  </CardActionArea>
</Card>
                        </Grid>
                      </Slide>
                    </React.Fragment>
                  ))
                )}
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>

      <Box
        style={{
          display: "none!important",
          position: "fixed",
          bottom: "0px",
          width: "96%",
        }}
        className="orderscreen_foot"
      >
        <Box>
          <Box
            className={[styles.bordered, styles.space]}
            style={{
              textAlign: "center",
              fontSize: "20px",
              lineHeight: "20px",
              display: "none",
              color: "#FFFFFF",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Tax: {currSymbol[selectedCurrency]}
            {taxPrice} | Total: {currSymbol[selectedCurrency]}
            {totalPrice} | Items: {itemsCount}
          </Box>
          <Box
            id="footer"
            style={{ display: "none!important" }}
            className={[styles.row, styles.around, styles.space]}
          >
            <Button
              onClick={() => {
                clearOrder(dispatch);
              }}
              variant="outlined"
              style={{ display: "none!important", fontFamily: "'Poppins', sans-serif", color: "#543A20", borderColor: "#CE9760" }} // Updated colors
              className={styles.largeButton}
              id="choose_clbtn"
            >
              Remove
            </Button>

            <Button
              onClick={previewOrderHandler}
              variant="contained"
              color="primary"
              style={{ display: "none!important", fontFamily: "'Poppins', sans-serif", backgroundColor: "#CE9760", color: "#FFFFFF" }} // Updated primary color
              disabled={orderItems.length === 0}
              className={styles.largeButton}
              id="nextbtn"
            >
              NEXT
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}