
import React, { useContext, useEffect,useState } from 'react';
import Axios from 'axios';
import { Box, Button, CardMedia, CircularProgress, Typography, Dialog,
  DialogTitle, } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Store } from '../Store';
// import { closeQrCode,setOrderType,getCheckoutUrl } from '../actions';
//import QRCode from "react-qr-code";
import {
  clearOrder,

} from '../actions';
import { setPaymentType, fetchCheckoutFormFromPayU } from '../actions';
import config,{ getParameterByName,merchantCode} from '../util';


export default function PaymentScreen(props) {
  
 //const baseURL = config.baseURL
 // const payURL = "https://pay.digitallive24.com";
  const { state, dispatch } = useContext(Store);
  const { selectedCurrency, order, newQr, fetchQr,newURL } = state;
  let paytimer = null;
  ///console.log(newQr);
  const styles = useStyles();

  //console.log(fetchQr);
  //console.log(newQr);
  
  const [openForm,setOpenForm] = useState(false);
  const [openSign,setOpenSign] = useState(false);
  const [isPickUp,setIsPickUp] = useState(false);
  const [isDeliver,setIsDeliver] =useState(false);
  const [userName,setUserName] = useState("");
  const [number,setNumber] =useState("");
  const [schedule,setSchedule]= useState("");
  const [address,setAddress] =useState("");

  const customerInfo =sessionStorage.getItem("customerInfo")?JSON.parse(sessionStorage.getItem("customerInfo")):null;
  console.log(customerInfo);
  
  useEffect(() => {
    if (order && order.orderItems.length) {
      let products =order.orderItems.reduce((accum="",cur)=> {
  return accum += cur.name +", ";
}, "");
      let amountTotal = order.orderItems.reduce((accum=0,cur)=> {
  return accum += cur.price;
}, 0);
     
      fetchCheckoutFormFromPayU(dispatch, {
          items: products,
          amount: amountTotal,
          txnid:'22dw222',
          surl: window.location.origin + '/complete?' + window.location.href.split('?')[1],
          furl: window.location.origin + '/review?' + window.location.href.split('?')[1],
          fname: customerInfo.customer.firstName,
          lname: customerInfo.customer.lastName,
          email: customerInfo.customer.email,
          phone: customerInfo.customer.phone
        });
  //  }
// let orderItem =order.orderItems.map(o=>{
//                   return{
//                     name:o.name,
//                     price:o.price,
//                     unitQty:o.quantity,
//                     id:o.id
//                   }
//                 })
// console.log(orderItem);
// let data ={customer:{email: "ravi@gmail.com", firstName: "Ravi", id: "T3NPM7GNH7HST"},
//                         shoppingCart: {lineItems:orderItem}
//          }

//      getCheckoutUrl(dispatch,{...data})
    }
  }, []);

  console.log(order);
  // useEffect(()=>setOpenSign(true),[])


  // const checkPaymentStatus = async (payId) => {
  //   try {
  //     const { data } = await Axios.get(`${payURL}/api/payIntentStatus/${payId}`);
  //     console.log(data);
  //     if (data && data.length && data[0].payStatus.toUpperCase() === "PAID") {
  //       if (paytimer) clearInterval(paytimer);
  //       return props.history.push('/complete?' + window.location.href.split('?')[1]);
  //     }

  //   }
  //   catch (error) {
  //     console.log(error);

  //   }
  // };

  // const previewOrderHandler = () => {
  //   if (paytimer) clearInterval(paytimer);
  //   props.history.push(`/complete?` + window.location.href.split('?')[1]);
  // };



  // function startTimer(newQr) {
  //   var duration = 60 * 10;
  //   var timer = duration, minutes, seconds;
  //   if (paytimer) clearInterval(paytimer);
  //   paytimer = setInterval(function () {


  //     let display = document.getElementById('time');
  //     minutes = parseInt(timer / 60, 10);
  //     seconds = parseInt(timer % 60, 10);

  //     minutes = minutes < 10 ? "0" + minutes : minutes;
  //     seconds = seconds < 10 ? "0" + seconds : seconds;
  //     display.innerHTML = minutes + ":" + seconds;

  //     if (--timer < 0) {
  //       timer = duration;
  //       if (paytimer) clearInterval(paytimer);
  //       console.log("Qr Expired");

  //       return props.history.push(`/select-payment?` + window.location.href.split('?')[1]);
  //     }

  //     if (seconds % 10 === 0 && newQr.data && newQr.data.payIntent) {
  //       console.log("hello");
  //       checkPaymentStatus(newQr.data.payIntent);
  //     }
  //   }, 1000);

  // }

  // if (!paytimer && newQr && newQr.data && newQr.data.url) {
  //   startTimer(newQr);
  // }


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
      <Box className={[styles.root, styles.navy]} style={{ backgroundColor: state.selectedBgColor }}>
        <h1 id="payform">{"Please wait, processing your payment..."}</h1>
          
      </Box>
    </>
  );
}


 // <Dialog
      //     // onClose={()=> setOpenSign(false)}
      //     aria-labelledby="max-width-dialog-title"
      //     open={openSign}
      //     fullWidth={true}
      //     // maxWidth="xs"
      //     maxWidth={state.widthScreen ? 'sm' : 'xs'}
      //   >
      //      <DialogTitle className={styles.center}>
      //       Choose Order Type
      //     </DialogTitle>
      //   <div 
      //   style={{height:"250px",textAlign:"center"}}
      //   >
      //       {/* <div> */}
      //       <button onClick={handlePickUp} style={{height:"48px",width:"174px",margin:"5px" ,
      //       backgroundColor:"transparent",color:"#000", border:"none",border:"none",cursor:"pointer",fontSize: "18px",fontWeight: "bold"}
      //     }>Pay Here</button><br/>
      //       <button onClick={handleDelivery} style={{height:"48px",width:"174px",margin:"0px 0px 0px 2px" ,
      //       backgroundColor:"transparent",color:"#000", border:"none",border:"none",cursor:"pointer",fontSize: "18px",fontWeight: "bold"}}>Cash on Delivery</button>
      //       {/* </div> */}
      //   </div>
      //   </Dialog>

      //   <Dialog
      //     //onClose={ setOpenSign(false);}
      //     aria-labelledby="max-width-dialog-title"
      //     open={openForm}
      //     fullWidth={true}
      //     // maxWidth="xs"
      //     maxWidth={state.widthScreen ? 'sm' : 'xs'}
      //   >
      //      <DialogTitle className={styles.center}>
      //       {/* Enter Details */}
      //       Order Type {order?order.orderType:""}
      //     </DialogTitle>
      //     <div style={{height:"auto",padding:"20px"}}>
      //             <span>
      //               <label style={{fontWeight: "bold"}} >Name <span style={{color:"red"}}>*</span>  </label>
      //               <input className='userInput' placeholder='Name' type='text' onChange={(e)=>setUserName(e.target.value)} />
      //             </span><br/>

      //           <span>
      //           <label style={{fontWeight: "bold"}} >Phone No <span  style={{color:"red"}}>*</span> </label>
      //           <input type='text' className='userInput' placeholder='Mobile No'  onChange={(e)=>setNumber(e.target.value)} />
      //           </span><br/>

      //        { (isPickUp&&!isDeliver)&&<span>
      //           <label style={{fontWeight: "bold"}} >Schedule <span  style={{color:"red"}}>*</span>  </label>
      //           <input type='datetime-local'  className='userInput'  onChange={(e)=>setSchedule(e.target.value)} />
      //           </span>}{ (isPickUp&&!isDeliver)&&<br/>}

      //         { (isDeliver&&!isPickUp) && <span>
      //           <label style={{fontWeight: "bold"}} >Address <span  style={{color:"red"}}>*</span>  </label>
      //           <input type='text' className='userInput' placeholder='Address'  onChange={(e)=>setAddress(e.target.value)} />
      //           </span>}
                
      //           {/* <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"25px",marginBottom:"5px"}}>
      //             <button className='c_btn'
      //              onClick={handleCancle}
      //              >Cancel</button>
      //             <button className='s_btn' onClick={handleSubmit}>Submit</button>
      //           </div> */}
            
           
      //     </div>
      //   </Dialog>
      //   <div style={{height:"600px",width:"100%"}}>
      //   {
      //     newURL&&newURL.data &&newURL.data.href?<iframe src={newURL.data.href}  style={{height:"100%",width:"100%"}}></iframe>:""
      //   }
      //   {/* <iframe src="https://sandbox.dev.clover.com/checkout/57f98c2a-0048-4c46-ac39-f7581f6cc4a7?mode=checkout"  style={{height:"100%",width:"100%"}}></iframe> */}
      //   </div>

      //   {/* <Box className={styles.root1}>

      //     {newQr && newQr.data && newQr.data.url && <div><div style={{ backGround: 'red' }} className={styles.timer}>QR Code expired in  <span id="time" className={styles.timerSize}> </span>  minutes!</div>

      //       <div className={styles.qrCode}>
      //         <CardMedia
      //           component="img"
      //           image={newQr.data && newQr.data.image_url ? newQr.data.image_url : ""}
      //           className={styles.qr_img}

      //         />

      //       </div></div>}

      //     {newQr && newQr.data && newQr.data.url &&
      //       <div>
      //         <h4 className={styles.qrTitle}>Scan with your mobile's camera to pay</h4>
      //         <div className={styles.qrCodeGen} >
      //           <QRCode
      //             size={256}
      //             style={{ height: "auto", maxWidth: "50%", width: "300" }}
      //             value={newQr.data.url}
      //             viewBox={`0 0 256 256`}
      //           />
      //         </div></div>}

      //   </Box> */}

       
      //   <Box className={[styles.row, styles.around, styles.space]}>
      //     <Button
      //       onClick={() => {
      //         if (paytimer) clearInterval(paytimer);
      //         clearOrder(dispatch);
      //         props.history.push('/?' + window.location.href.split('?')[1]);
      //       }}
      //       variant="outlined"
      //       color="primary"
      //       className={styles.largeButton}
      //     >
      //       Cancel Order
      //     </Button>
      //     {false&&<a href="https://link.dev.clover.com/urlshortener/4qpScT" 
      //       style={{backgroundColor:"#228800",border:"1px solid #228800",minHeight:"50px",color:"#fff",padding:"10px 20px",textDecoration:"none",borderRadius:"4px"}}
      //       >Checkout Now {selectedCurrency}{order?order.totalPrice:""}</a>}
      //     <Button
      //       onClick={previewOrderHandler}
      //       variant="contained"
      //       color="primary"
      //       className={styles.largeButton}
      //     >
           
      //       {/* BACK */}NEXT
      //     </Button>
      //   </Box>