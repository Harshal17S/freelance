
import React, { useContext, useEffect,useState } from 'react';
import Axios from 'axios';
import { Box, Button, CardMedia, CircularProgress, Typography, Dialog,
  DialogTitle, } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Store } from '../Store';
import QRCode from "react-qr-code";
import {
  clearOrder,

} from '../actions';
import { setPaymentType, getStripePay} from '../actions';
import config,{ getParameterByName,merchantCode} from '../util';
import waitImg from '../assets/image/wait.gif';

export default function CompleteOrderScreen(props) {
 const baseURL = config.baseURL
  const payURL = "https://pay.digitallive24.com";
  const { state, dispatch } = useContext(Store);
  const { selectedCurrency, order, newQr, fetchQr,newURL } = state;
  let paytimer = null;
  console.log(newQr);
  const styles = useStyles();
   let { userInfo } = state.userData;
  const [openForm,setOpenForm] = useState(false);
  const [openSign,setOpenSign] = useState(false);
  const [isPickUp,setIsPickUp] = useState(false);
  const [isDeliver,setIsDeliver] =useState(false);
  const [userName,setUserName] = useState("");
  const [number,setNumber] =useState("");
  const [schedule,setSchedule]= useState("");
  const [address,setAddress] =useState("");
  let { setting } = state.userSetting;
  const themeColor = userInfo?.themeColor || '#ffbc01';  
  const themeTxtColor = userInfo?.themeTxtColor || '#000'; 
  const customersInfo =sessionStorage.getItem("customerInfo")?JSON.parse(sessionStorage.getItem("customerInfo")):"";
  console.log(customersInfo);

    
  const getCurrency = userInfo ? userInfo.currency : "";
  const getPercent = setting ? setting.taxPercent : "";

  useEffect(() => {
    console.log(order);
    if (order && order.orderItems.length ) {
        let strpItems = [];
        //*************STRIPE ITEMS**********
        // order.orderItems.forEach(o => {
        //   strpItems.push({
        //     price_data:{
        //       currency:getCurrency,
        //       unit_amount:o.price * 100 + (o.price * getPercent / 100) * 100,
        //       product_data:{
        //         name: o.name 
        //       }
        //     },
        //     quantity:o.quantity

        //   });
        // });

        //*************CLOVER ITEMS**********
        let finalOrder = JSON.parse(localStorage.getItem('finalOrder'));
        order.orderItems.forEach(o => {
          let modPrice=0;
          let mod = finalOrder[2][o._id].map(mod=> {
                            modPrice +=  mod.price * 100 + (mod.price * getPercent / 100) * 100
                            return mod.name
                          });
          strpItems.push({
            name: o.name +' (Modifiers: '+ mod.join(',')+' )',
            price:  o.price * 100 + (o.price * getPercent / 100) * 100 + modPrice,
            unitQty:o.quantity
          });
        });

       let sucUrl=(window.location != window.parent.location)?document.referrer+'/order_now': window.location.origin+'/complete?'+window.location.href.split('?')[1];
       let canUrl=(window.location != window.parent.location)?document.referrer+'/cancel': window.location.origin+'/cancel?'+window.location.href.split('?')[1];
       //getStripePay(dispatch,{...strpItems},sucUrl,canUrl)
       //getStripeCheckout(sucUrl, canUrl, strpItems);

       //clover payload
       let clvrPL = {
        "customer":{
          "firstName":customersInfo.customer.firstName,
           "lastName":customersInfo.customer.lastName,
           "email":customersInfo.customer.email,
           "phoneNumber":customersInfo.customer.phone,
           "id":"A7BHGYWFKE4Z2"
        },
       "redirectUrls":{
          "success": sucUrl,
          "failue":canUrl,
           "cancel":canUrl
       },
       "shoppingCart":
       {"lineItems":strpItems},
       "total":strpItems.reduce((partSum, item) => partSum + item.price, 0)*1000,
       "subtotal":strpItems.reduce((partSum, item) => partSum + item.price, 0)*1000,
       "totalTaxAmount":0
     };
       console.log('sending for hosted checkout', clvrPL);
       getHostedClvrCheckout(clvrPL);

    }
  }, []);

  const getHostedClvrCheckout = async (clvrPL) => {
    try {
      localStorage.removeItem('finalSummary');
      let subPath = "/api/clover/ecom/philip/checkout-url?merchantCode="+merchantCode;
      const { data } = await Axios.post(`${baseURL}${subPath}`,clvrPL);
      console.log('stripe host url', data);
      if (data  && data.href) {
        localStorage.setItem('checkoutSessionId', data.checkoutSessionId);
        if (paytimer) clearInterval(paytimer);
        setTimeout(function(){
          if(window.location != window.parent.location){
           window.parent.location.href =data.href;
         }else{
           window.location.href =data.href;
         }
          
        },5*1000);
       
      }

    }
    catch (error) {
      console.log(error);

    }
  };

  const getStripeCheckout = async (sucUrl,canUrl,items) => {
    try { 
      let subPath = "/api/clover/ecom/philip/checkout-url?sucUrl="+sucUrl+"&canUrl="+canUrl;
      const { data } = await Axios.post(`${baseURL}${subPath}`,{line_items:items});
      console.log('stripe host url', data);
      if (data  && data.strpUrl) {
        if (paytimer) clearInterval(paytimer);
        setTimeout(function(){
          if(window.location != window.parent.location){
           window.parent.location.href =data.strpUrl;
         }else{
           window.location.href =data.strpUrl;
         }
          
        },5*1000);
       
      }

    }
    catch (error) {
      console.log(error);

    }
  };

  const handlePickUp =()=>{
      // setIsPickUp(true);
      // setOpenForm(true);
      setOpenSign(false);
      // setOrderType(dispatch,"Pick Up");
    }
    const handleDelivery =()=>{
      setOpenSign(false);
      // setIsDeliver(true);
      // setOpenForm(true);
      // setOrderType(dispatch,"Delivery");
    }

console.log(newURL);
  return (
    <>
      <Box style={{textAlign:"center",height:"100vh",backgroundColor:themeColor}}>
      <div style={{display:"flex", height:"100vh",flexDirection:"column", verticalAlign:"middle", textAlign:"center", justifyContent:'center'}}>
      <div><img src={waitImg}  style={{height:"100px", width:"110px"}}/></div>
      <h1>Generating bill, please wait...</h1>
      </div>
      </Box>
    </>
  );
}
