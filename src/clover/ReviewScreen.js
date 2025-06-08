import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { addToOrder, removeFromOrder } from '../actions';
import { setPaymentType, generateQrCode, getCheckoutUrl } from '../actions';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useStyles } from '../styles';
import App from "../App";
import SignUp from './SignUp';
import { useHistory } from "react-router-dom"; 
import Axios from 'axios';
import config,{ getParameterByName,merchantCode} from '../util';

export default function ReviewScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { orderItems, itemsCount, totalPrice, taxPrice, orderType } = state.order;
  const selectedCurrency = state.selectedCurrency;
  
  let { setting } = state.userSetting;
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [addons, setAddons] = useState([]);
  let loggedUser = sessionStorage.getItem("customerInfo");
  loggedUser = loggedUser && JSON.parse(loggedUser);
  const [openSign, setOpenSign] = useState(loggedUser&&loggedUser.user?true:false);
  const history = useHistory();
  let { userInfo } = state.userData;
  const getCurrency = userInfo ? userInfo.currency : "";
  const getPercent = setting ? setting.taxPercent : "";
  let items = [];
  let addonsItems = {};
  let currSymbol= {
    'usd':"$",
    'inr':"₹"
  }
    const baseURL = config.baseURL;
   console.log(orderItems);
   console.log(userInfo);

  if (orderItems.length) {
    orderItems.forEach((oi) => {
      items.push({
        quantity: oi.quantity,
        "item":{"id": oi._id},
        price: oi.price * 100 + (oi.price * getPercent / 100) * 100
      });
      //let itemsAdons= {};
      //itemsAdons[oi._id] = oi.addons
      addonsItems[oi._id]= oi.addons;
      return true;
    });
  }

  const closeHandler = () => {
    setIsOpen(false);
  };



  const productClickHandler = (p) => {
    let existingOrder = orderItems.filter(o => o._id === p._id);
    setProduct(p);
    setAddons(JSON.parse(p.sub_pro));
    if (existingOrder.length) {
      setQuantity(existingOrder[0].quantity);
    } else {
      setQuantity(1);
    }
    setIsOpen(true);
  };

  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  // let metadata = {};
  // items.forEach((item) => {
  //   metadata[item.inventory_id] = JSON.stringify(addonsItems);
  // });

  const procedToCheckoutHandler = () => {
    let runningOrder = localStorage.getItem('runningOrder');
   
    if (loggedUser !== null && runningOrder) {
      runningOrder = JSON.parse(runningOrder);
      let orderInit = {
        "metadata":runningOrder.metadata,
        "email":loggedUser.customer.email,
        "currency": userInfo.currency
      }
      console.log(orderInit);
      let ordItems = [];
      ordItems = orderItems.map(oi => {return {"item":{"id":oi._id},"price": oi.price*100, "quantity":oi.quantity}});
      ordItems={"items": ordItems};
      console.log(ordItems);
      let modifiers=addonsItems;
      console.log(modifiers);

      let finalOrder = [orderInit,ordItems,modifiers];
      localStorage.setItem("finalOrder",JSON.stringify(finalOrder));
      //placeFinalOrderToClover(finalOrder);
      history.push("/payment?"+ window.location.href.split('?')[1]);
     // history.push("/complete?"+ window.location.href.split('?')[1]);
    } else {
      setOpenSign(true); 
    }
    //props.setIsPaneOpen(false);
  };


const placeFinalOrderToClover = async (finalOrder) => {
    try {
      let merchantDtl=JSON.parse(localStorage.getItem('userInfo'));
      let subPath = "/api/clover/ecom/orders?merchantCode=";
      Axios.post(`${baseURL}${subPath}${merchantDtl.merchantCode}`,finalOrder).then(res=>{
         history.push("/complete?"+ window.location.href.split('?')[1]);
      });
    }
    catch (error) {
      console.log(error);

    }
  };


  const adAddons = (adId) => {
    let existingItem = product;
    let adOns = JSON.parse(existingItem.sub_pro).map((ad) => {
      if (ad._id === adId) {
        ad.quantity = ad.quantity + 1;
      }
      return ad;
    });
    setAddons(adOns);
    existingItem.sub_pro = JSON.stringify(adOns);
    setProduct(existingItem);
  };

  const removeAddons = (adId) => {
    let existingItem = product;
    let adOns = JSON.parse(existingItem.sub_pro).map((ad) => {
      if (ad._id === adId) {
        ad.quantity = ad.quantity - 1;
      }
      return ad;
    });
    setAddons(adOns);
    existingItem.sub_pro = JSON.stringify(adOns);
    setProduct(existingItem);
  };

  return (
    <Box className={[styles.centerWithScroll]}>
      <Box className={[styles.main, styles.center]} style={{ justifyContent: "start" }}>
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
          maxWidth={state.widthScreen ? 'sm' : 'xs'}
        >
          <DialogTitle className={styles.center}>
            Add {product.name}
          </DialogTitle>
          <Box className={[styles.row, styles.center,styles.countHolder]}>
            <Button className={styles.minus}
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput }}
              className={styles.largeNumber}
              type="number"
              min={1}
              variant="filled"
              value={quantity}
            />
            <Button className={styles.add}
              variant="contained"
              color="primary"
              onClick={(e) => setQuantity(quantity + 1)}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box style={{ margin: "10px" }}>
            <h5 style={{ textAlign: "center" }}>{addons.length >= 1 ? "Add-ons" : ""}</h5>
            {addons.length >= 1 ? addons.map(li => (
              <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", padding: "3px 15px", fontSize: "20px", flexWrap: "wrap" }}>
                {li.name} <div className={styles.btn_group}>
                  <span>{currSymbol[selectedCurrency]} {li.price} </span>
                  <span className={styles.addons}>
                    <button className={styles.minus1} onClick={() => removeAddons(li._id)}><RemoveIcon /></button>
                    {li.quantity}
                    <button className={styles.plus} onClick={() => adAddons(li._id)}> <AddIcon sx={{ fontSize: "1px" }} /></button>
                  </span>
                </div>
              </div>
            ))
              : ""}
          </Box>
          <Box className={[styles.row, styles.around]} >
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="outlined"
              color="primary"
              size="large"
              className={[styles.largeButton, styles.card]}
            >
              {orderItems.find((x) => x.name === product.name) ? 'Remove' : 'Cancel'}
            </Button>
            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              ADD
            </Button>
          </Box>
        </Dialog>
        <Box >
          <Typography
            gutterBottom
            className={styles.title3}
            variant="h5"
            component="h5"
            id="title1"
          >
            Review your cart
          </Typography>
        </Box>
        <Box style={{width:"100%"}} className={[styles.center]}>
          <Grid container>
            {orderItems.map((orderItem) => (
              <Grid item lg={12} md={12} sm={12} xs={12} key={orderItem.name}>
                <Card
                  className={[styles.card, styles.editCard]}
                  onClick={() => productClickHandler(orderItem)}
                >
                  <CardActionArea>
                    <CardContent>
                      <Box className={[styles.row, styles.between, styles.itemsCenter]}>
                        <div>
                          <Typography
                            gutterBottom
                            variant="h6"
                            className={styles.reviwText}
                            component="p"
                          >
                            {orderItem.name}
                          </Typography>
                          {addonsItems[orderItem._id].map(mod=> {
                            return <span>{mod.name+','}</span>
                          })}
                        </div>
                        <div className='amount' style={{ position: "absolute", left: "50%" }}>
                          <h3>{orderItem.quantity} x {currSymbol[selectedCurrency]}{orderItem.price}</h3>
                        </div>
                        <div>
                          <Button variant="contained"  className={styles.editBtn} 
                          >Edit</Button>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Box style={{ position: "absolute", bottom: "15px",width:"100%" }}>
        <Box>
          <Box className={[styles.bordered, styles.space]} style={{ textAlign: 'center', fontSize: '20px', lineHeight: "20px" }}>
            Tax: {currSymbol[selectedCurrency]}{taxPrice} | Total: {currSymbol[selectedCurrency]}{totalPrice} | Items: {itemsCount}
          </Box>
          <Box className={[styles.row, styles.around]} style={{width:"100%"}}>
            <Button
              onClick={procedToCheckoutHandler}
              variant="contained"
              color="primary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
              
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    
      {openSign && !loggedUser && <Dialog open={true} fullWidth maxWidth="sm">
  <SignUp log={true} setOpenSign={setOpenSign} procedToCheckoutHandler={procedToCheckoutHandler}/>
</Dialog>}

    </Box>
  );
}
