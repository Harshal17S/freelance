import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { addToOrder, removeFromOrder} from '../actions';
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
import Logo from '../components/Logo';
import { useHistory } from "react-router-dom"; 
import { setPaymentType, generateQrCode, getCheckoutUrl } from '../actions';
// import Slider from "react-slick";
import config,{ getParameterByName,merchantCode} from '../util';
export default function ReviewScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    orderItems,
    itemsCount,
    totalPrice,
    taxPrice,
    orderType,
  } = state.order;
  let {setting} = state.userSetting;
    console.log(setting);
  const selectedCurrency = state.selectedCurrency;
  console.log(selectedCurrency);
  const history = useHistory();
  
  // const isPaymentAllowed = getParameterByName("isPaymentAllowed");
  let isPaymentAllowed = setting?setting.isPaymentAllowed:"";
  console.log(isPaymentAllowed);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [addons,setAddons]=useState([]);
  const [openSign,setOpenSign] =useState(false);
  
    let {userInfo}=state.userData;
  const getCurrency = userInfo? userInfo.currency:"";
  const getPercent = setting? setting.taxPercent:"";
  let items = [];
  if (orderItems.length) {
    orderItems.map((o) => {
      items.push({
        price_data: {
          currency: getCurrency,
          product_data: {
            name: o.name
          },
          unit_amount: o.price * 100 + (o.price * getPercent / 100) * 100
        },
        quantity: o.quantity
      })
    });
  }
  const closeHandler = () => {
    setIsOpen(false);
  };
  const productClickHandler = (p) => {
    console.log(orderItems);
    let existingOrder = orderItems.filter(o => o._id == p._id);
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

  const procedToCheckoutHandler = () => {
     
    props.history.push('/payment?' + window.location.href.split('?')[1]);
    
  };


  //  if(setting){
  //    setTimeout(() => {
  //     let textcolor = document.getElementById("title1");
  //     textcolor.style.color = setting.color_primary;
  //   }, 10);
    
  // }

  const adAddons = (adId)=>{
    console.log(product,adId);
    let existingItem= product;
    let adOns = JSON.parse(existingItem.sub_pro).map((ad)=>{
                                                            if(ad._id === adId){
                                                                ad.quantity=ad.quantity+1;
                                                            }
                                                            return ad;
                                                     })
        console.log(adOns);
        setAddons(adOns);
        existingItem.sub_pro=JSON.stringify(adOns);
        setProduct(existingItem);

  }

 const removeAddons = (adId)=>{
  console.log(product,adId);
  let existingItem= product;
  let adOns = JSON.parse(existingItem.sub_pro).map((ad)=>{
                                                          if(ad._id===adId){
                                                              ad.quantity=ad.quantity-1;
                                                          }
                                                          return ad;
                                                   })
      console.log(adOns);
      setAddons(adOns);
        existingItem.sub_pro=JSON.stringify(adOns);
        setProduct(existingItem);

 }

console.log(orderItems)


  return (
    <Box className={[styles.root]} >
      <Box className={[styles.main, styles.center]} style={{justifyContent:"start"}}>
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
          // maxWidth="xs"
          maxWidth={state.widthScreen ? 'sm' : 'xs'}
        >
          <DialogTitle className={styles.center}>
            Add {product.name}
          </DialogTitle>
          <Box className={[styles.row, styles.center]}>
            <Button className={styles.minus}
            id='minus_btn'
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
            id='order_count'
              inputProps={{ className: styles.largeInput }}
              className={styles.largeNumber}
              type="number"
              min={1}
              variant="filled"
              value={quantity}
            />
            <Button className={styles.add}
             id='plus_btn'
              variant="contained"
              color="primary"
              onClick={(e) => setQuantity(quantity + 1)}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box style={{margin:"10px"}}>
            <h5 style={{textAlign:"center"}}>{addons.length>=1?"Add-ons":""}</h5>
            { addons.length>=1?addons.map(li=> (
              <div style={{display:"flex",justifyContent:"space-between",alignContent:"center",padding:"3px 15px",fontSize:"20px",flexWrap:"wrap"}}>
                {li.name} <div className={styles.btn_group} id='btn_group'>
                    <span>{selectedCurrency} {li.price} </span>
                            <span className={styles.addons} id='addons'>
                            <button className={styles.minus1} onClick={()=>removeAddons(li._id)}><RemoveIcon /></button>
                            {li.quantity} 
                            <button className={styles.plus} onClick={()=>adAddons(li._id)}> <AddIcon sx={{ fontSize:"1px"}} /></button>
                            </span>
                           </div> 
              </div> 
            ))
              :""}
          </Box>
          <Box className={[styles.row, styles.around]} style={{marginBottom:"20px"}}>

            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="outlined"
              color="primary"
              size="large"
              className={[styles.largeButton, styles.card]}
            >
              {orderItems.find((x) => x.name === product.name)
                ? 'Remove'
                : 'Cancel'}
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
        <Box className={[styles.center, styles.around]}>
          {/* <img src={state.selectedLogo} height='90px' width='100px' /> */}
          <Typography
            gutterBottom
            // className={styles.title}
            className={styles.title3}
            variant="h3"
            component="h3"
            id="title1"
          >
            Review my {orderType} order
          </Typography>
        </Box>
        <Box  style={{overflowY:"auto",height:"500px"}}>
        <Grid container >
          {orderItems.map((orderItem) =>{
            
            const subProArray =orderItem.sub_pro?JSON.parse(orderItem.sub_pro):[];
            const subProNames = subProArray ? subProArray.map(subPro => subPro.name) : [];
            console.log(subProArray)
            return(
            
            <Grid item md={12} sm={12} xs={12} key={orderItem.name}>
              <Card
                className={[styles.card, styles.editCard]}
                onClick={() => productClickHandler(orderItem)}
              >
                
                <CardActionArea  >
                  <CardContent>
                    <Box className={[styles.row, styles.between,styles.itemsCenter]}>
                      <div>
                        <Typography
                          gutterBottom
                          variant="h6"
                          className={styles.reviwText}
                          component="p"
                        >
                     <b>{orderItem.name}</b> <br />  <i>  {subProNames.length > 0 ? "Addons:" + subProNames.join(', ') : subProNames} </i> <br /> <i>{orderItem.cookInstructions ? "Instructions:" + orderItem.cookInstructions : ""}</i>

                        </Typography>
                      </div>
                      <div className='amount' style={{position:"absolute",left:"50%"}}>
                        <h3>{orderItem.quantity} x {selectedCurrency}{orderItem.price + (subProArray ? subProArray.reduce((acc, val) => acc + val.price, 0) : 0)}</h3>
                      </div>
                      <div>
                        <Button variant="contained" color="primary" className={styles.editBtn}>Edit</Button>
                      </div>
                    </Box>
                    {/* <Box className={[styles.row, styles.between]}>
                      <Typography
                        variant="subtitle1"
                        // color="textSecondary"
                        component="p"
                        className={styles.prod_cal1}
                      >
                        {orderItem.calorie} Cal
                      </Typography>
                      <Typography
                        variant="h5"
                        className={styles.reviwText}
                        component="p"
                      >
                         {orderItem.quantity} x {selectedCurrency}{orderItem.price} 
                      </Typography>
                    </Box> */}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )})}
        </Grid>
        </Box>
      </Box>
      <Box style={{position:"fixed",bottom:"15px",width:"92%"}} >
        <Box>
          <Box className={[styles.bordered, styles.space]}style={{ textAlign: 'center', fontSize: '20px', lineHeight: "20px" }}>
             Tax:
            {selectedCurrency}{taxPrice} | Total: {selectedCurrency}{totalPrice} | Items: {itemsCount}
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={() => {
                // props.history.push(`/?` + window.location.href.split('?')[1]);
                props.setIsPaneOpen(false)
              }}
              variant="outlined"
              color="primary"
              className={[styles.largeButton]}
              id='review_clbtn'
            >
              Back
            </Button>

            <Button
              onClick={procedToCheckoutHandler}
              variant="contained"
              color="primary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
              id="review_nxbtn"
            >
               Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
