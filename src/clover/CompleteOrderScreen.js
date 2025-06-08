import React, { useContext, useEffect, useState } from 'react';
import { NumericKeyboard } from 'react-numeric-keyboard';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Store } from '../Store';
import { Alert } from '@material-ui/lab';
import {  getCheckoutUrl,getUserData } from '../actions';
import Axios from 'axios';
import HomeScreen from './SelectPaymentScreen';
import config,{ getParameterByName,merchantCode} from '../util';
import waitImg from '../assets/image/wait.gif'; 
import successImg from '../assets/image/success.gif'; 


export default function CompleteOrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
   let { userInfo } = state.userData;
  const { selectedCurrency, order, newURL } = state;
  const [newOrderProcessing, setNewOrderProcessing]= useState(true);
  const baseURL = config.baseURL;
   const themeColor = userInfo?.themeColor || '#ffbc01';

  
  useEffect(() => {
    //setTimeout(()=> setNewOrderProcessing(false),10*1000);
    //placeFinalOrderToClover();
    let sessionId = localStorage.getItem("checkoutSessionId");
    findOrderAndPaymentDetails(sessionId);
  }, []);

  const findOrderAndPaymentDetails = async(sessionId) => {
    try {
      if(localStorage.getItem('finalSummary')){
        let summary = JSON.parse(localStorage.getItem('finalSummary'));
        document.getElementById("receipt").href="https://www.clover.com/r/"+summary.order.id;
      }
      let merchantDtl=JSON.parse(localStorage.getItem('userInfo'));
      let subPath = "/api/clover/ecom/payment-order-by-session?merchantCode=";
      Axios.get(`${baseURL}${subPath}${merchantDtl.merchantCode}&sessionId=${sessionId}`).then(res=>{
          console.log('order placed successfully!!',res);
          localStorage.setItem('finalSummary', JSON.stringify(res.data));
          setNewOrderProcessing(false);
          document.getElementById('merchant-address').innerHTML=res.data.merchantDtl;
          document.getElementById("receipt").href="https://www.clover.com/r/"+res.data.order.id;
        });
    }
    catch (error) {
      console.log(error);

    }

  }

  const placeFinalOrderToClover = async () => {
    try {
      let merchantDtl=JSON.parse(localStorage.getItem('userInfo'));
      let finalOrder = JSON.parse(localStorage.getItem('finalOrder'));
      let subPath = "/api/clover/ecom/orders?merchantCode=";
      Axios.post(`${baseURL}${subPath}${merchantDtl.merchantCode}`,finalOrder).then(res=>{
         //history.push("/complete?"+ window.location.href.split('?')[1]);
          console.log('order placed successfully!!',res);
          setNewOrderProcessing(false);
        });
    }
    catch (error) {
      console.log(error);

    }
  }

  const getStripeCheckout = async (runningOrder) => {
    try {
      
      
      let merchantDtl=JSON.parse(localStorage.getItem('userInfo'));
      let subPath = "/api/clover/ecom/orders?merchantCode=";
      Axios.post(`${baseURL}${subPath}${merchantDtl.merchantCode}`,runningOrder).then(res=>{
         setNewOrderProcessing(false);
      });
    }
    catch (error) {
      console.log(error);

    }
  };

  return (
    <Box style={{textAlign:"center",height:"100vh",backgroundColor:themeColor}}>
      {newOrderProcessing && <div style={{display:"flex", height:"100vh",flexDirection:"column", verticalAlign:"middle", textAlign:"center", justifyContent:'center'}}>
      <div><img src={waitImg}  style={{height:"100px", width:"110px"}}/></div>
      <h1>Confirming your order, please wait...</h1>
      </div>
      }
      {!newOrderProcessing && 
      <div style={{display:"flex", height:"100vh",flexDirection:"column", verticalAlign:"middle", textAlign:"center", justifyContent:'center'}}>
      <div><img src={successImg}  style={{height:"100px", width:"100px", borderRadius:"40px"}}/></div>
      <h1 style={{color:'green'}}>Hurrah!! Your order placed, it will be ready in 20 mnts(appx.)...</h1>
         <h1>Collect your order from:</h1>
        <h2 id="merchant-address"></h2>
       <h3>Find your receipt here <a href="#" id="receipt">Order Receipt</a> </h3>
      </div>

      }
    </Box>
  );

}
