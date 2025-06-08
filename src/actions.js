import Axios from 'axios';
import config,{ getParameterByName,merchantCode} from './util';
import {
  SET_CUSTOMER_ID,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
  ORDER_SET_TYPE,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  SCREEN_SET_WIDTH,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  GENERATE_URL_REQUEST,
  GENERATE_URL_SUCCESS,
  GENERATE_URL_FAIL,
   FETCH_QRCODE_REQUEST,
  FETCH_QRCODE_SUCCESS,
  FETCH_QRCODE_FAIL,
  
  GENERATE_QRCODE_REQUEST,
 GENERATE_QRCODE_SUCCESS,
 GENERATE_QRCODE_FAIL,

FETCH_USERDATA_REQUEST,
FETCH_USERDATA_SUCCESS,
FETCH_USERDATA_FAIL,

FETCH_USERSETTING_REQUEST,
FETCH_USERSETTING_SUCCESS,
FETCH_USERSETTING_FAIL,

 USER_SIGNUP,
 USER_SIGNUP_SUCCESS,
 USER_SIGNUP_FAIL,

 USER_SIGNIN,  
 USER_SIGNIN_SUCCESS, 
 USER_SIGNIN_FAIL,
 PAY_INIT,  
 PAYNOW_SUCCESS, 
 PAYNOW_FAIL,
FETCH_PROMOS_SUCCESS
} from './constants';
import { useContext } from 'react';
import { Store } from './Store';
//let baseServer = window.location.href.indexOf('localhost') > 0 ?'https://menuapi.kickorder.net':window.location.origin;


    let merchantDtl=JSON.parse(localStorage.getItem('userInfo'));
  //   const baseURL = window.location.href.indexOf('localhost') > 0 ?'https://menuapi.kickorder.net':window.location.origin;
  //   // const baseURL = "https://online.menulive.in/";
  // const cmsURL="https://cms.digitallive24.com";
  // const payURL="https://pay.digitallive24.com";
//const userName=getParameterByName('userName');

  //  console.log(baseURL);

// export const userSingnUp = async (dispatch)=>{
//   dispatch({type:USER_SIGNUP});
//   try{
//     const {data}= await Axios.post(`https://apps.digitallive24.com/apps/customers`);
//    return dispatch({
//       type: USER_SIGNUP_SUCCESS,
//       payload:data,
//     });
//   }
//   catch(error){
//   return  dispatch({
//       type:USER_SIGNUP_FAIL,
//       payload:error.message,
//     });

// }
// }

// export const userSingnIn = async (dispatch)=>{
//         dispatch({type:USER_SIGNIN});
//         try{
//           const {data}= await Axios.post(`https://apps.digitallive24.com/apps/customers/login`);
//         return dispatch({
//             type: USER_SIGNIN_SUCCESS,
//             // payload:data,
//           });
//         }
//         catch(error){
//         return  dispatch({
//             type:USER_SIGNIN_FAIL,
//             // payload:error.message,
//           });

//       }
// }





export const generateQrCode= async (dispatch,orderData)=>{
        dispatch({type:GENERATE_QRCODE_REQUEST});
        try{
          const {data}= await Axios.post(`${config.baseURL}/api/new-order-qr`,orderData);
          console.log(data);
         return dispatch({
            type: GENERATE_QRCODE_SUCCESS,
            payload:data,
          });
        }
        catch(error){
        return  dispatch({
            type:GENERATE_QRCODE_FAIL,
            payload:error.message,
          });

      }
   };


export const getUserData= async (dispatch)=>{
    dispatch({type:FETCH_USERDATA_REQUEST});
    sessionStorage.setItem('merchantCode',merchantCode);
    try{
        // const {data}= await Axios.get(`${cmsURL}/api/users/user-public-data/${userName}`);
        const {data}= await Axios.get(`${config.baseURL}/api/settings/merchants/${merchantCode}/open`);
        console.log(data);
        merchantDtl=data;
        localStorage.setItem('userInfo', JSON.stringify(merchantDtl));
        // getUserSettings(dispatch,data[0]._id);
     
        return dispatch({
            type: FETCH_USERDATA_SUCCESS,
            payload:data,
        });
    }
    catch(error){
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error: Please check your connection.');
        } else if (error.response && error.response.status === 404) {
            console.error('Error 404: Resource not found.');
        } else {
            console.error(error);
        }
        return dispatch({
            type:FETCH_USERDATA_FAIL,
            payload:error.message,
        });
    }
};

export const getUserSettings= async (dispatch,id)=>{
    console.log(merchantDtl);
        dispatch({type:FETCH_USERSETTING_REQUEST});
        try{
          const {data}= await Axios.get(`${config.cmsUrl}/api/user/settings-pub/${id}`);
          console.log(data.message);
         return dispatch({
            type: FETCH_USERSETTING_SUCCESS,
            payload:data.message,
          });
        }
        catch(error){
        return  dispatch({
            type:FETCH_USERSETTING_FAIL,
            payload:error.message,
          });

      }
   };

export const validateCustomerToken= async (dispatch,token,merchantCode)=>{
    console.log('checking toekn',token);           
try {
            const response = await Axios.post(`${config.authapi}/customer/validate-token`,{merchantCode:merchantCode},{
      headers: {
    'Authorization': 'Bearer '+token
  }});
            
            if(response && response.data.user){
                dispatch({
                    type: USER_SIGNIN_SUCCESS,
                    payload: response.data.user,
                });
                sessionStorage.setItem("customerInfo", JSON.stringify(response.data.user));
            }
        } catch (error) {
            
            console.log('error');
        }
   };

export const getCheckoutUrl= async (dispatch,orderData)=>{
        dispatch({type:GENERATE_URL_REQUEST});
        try{
          let subPath = "/api/ecom/orders?merchantCode=";
          if(merchantDtl&& merchantDtl.posProviderName && merchantDtl.posProviderName.toUpperCase() == 'CLOVER' ){
            subPath = "/api/clover/ecom/orders?merchantCode=";
          }
          const {data}= await Axios.post(`${config.baseURL}${subPath}${merchantCode}`,orderData);
          console.log(data);
         return dispatch({
            type: GENERATE_URL_SUCCESS,
            payload:data,
          });
        }
        catch(error){
        return  dispatch({
            type:GENERATE_URL_FAIL,
            payload:error.message,
          });
      }
   };

export const fetchCheckoutFormFromPayU= async (dispatch,bdy)=>{
        dispatch({type:FETCH_QRCODE_REQUEST});
        try{
          const {data}= await Axios.post(`${config.payUrl}/api/payu/payform`,bdy);
          console.log(data);
          document.getElementById('payform').innerHTML='<div>'+data+'</div>';
          setTimeout(()=> document.forms['payment_post'].submit(),500);
         return true;
        }
        catch(error){
        return  error;
      }
   };

export const getStripePay= async (dispatch,orderData, sucUrl,canUrl)=>{
        dispatch({type:GENERATE_URL_REQUEST});
        try{
          let subPath = "/api/ecom/orders?merchantCode=";
          if(merchantDtl&& merchantDtl.posProviderName && merchantDtl.posProviderName.toUpperCase() == 'CLOVER' ){
            subPath = "/api/clover/ecom/philip/checkout-url?sucUrl="+sucUrl+"&canUrl="+canUrl;
          }
          const {data}= await Axios.post(`${config.baseURL}${subPath}`,{line_items:orderData});
          console.log(data);
         return dispatch({
            type: PAYNOW_SUCCESS,
            payload:data,
          });
        }
        catch(error){
        return  dispatch({
            type:PAYNOW_FAIL,
            payload:error.message,
          });
      }
   };


export const fetchQrData= async (dispatch,bdy)=>{
        dispatch({type:FETCH_QRCODE_REQUEST});
        try{
          const {data}= await Axios.post(`${config.baseURL}/api/fetch-order-qr`,bdy);
          console.log(data);
         return data;
        }
        catch(error){
        return  error;
      }
   };
   export const closeQrCode= async (dispatch,bdy)=>{
        dispatch({type:GENERATE_QRCODE_REQUEST});
        try{
          const {data}= await Axios.post(`${config.baseURL}/api/close-order-qr`,bdy);
          console.log(data);
         return dispatch({
            type: GENERATE_QRCODE_SUCCESS,
            payload:data,
          });
        }
        catch(error){
        return  dispatch({
            type:GENERATE_QRCODE_FAIL,
            payload:error.message,
          });

      }
   };

export const listCategories = async (dispatch) => {
  console.log(merchantDtl);
  let subPath = "/api/categories?merchantCode=";
  if(merchantDtl&& merchantDtl.posProviderName && merchantDtl.posProviderName.toUpperCase() == 'CLOVER' ){
    subPath = "/api/clover/categories?merchantCode=";
  }
  dispatch({ type: CATEGORY_LIST_REQUEST });
  if(merchantDtl&& merchantDtl.merchantCode){
   const promores= await Axios.get(`${config.baseURL}/api/promos/?merchantCode=${merchantDtl.merchantCode}`);
      console.log(promores);
      dispatch({
            type: FETCH_PROMOS_SUCCESS,
            payload:promores.data,
        });
  }

  try {
    // USPIZZA-KEMP
    const { data } = await Axios.get(config.baseURL+subPath+merchantCode);
    return dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listProducts = async (dispatch, category = '' ) => {
  console.log(merchantDtl);
  console.log(category);
   let subPathCat = "/api/categories/";
   let subPathProd = "/api/products?merchantCode=";
  if(merchantDtl&& merchantDtl.posProviderName && merchantDtl.posProviderName.toUpperCase() == 'CLOVER' ){
    subPathCat = "/api/clover/categories/";
    subPathProd= "/api/clover/products?merchantCode=";
  }
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    if(category){
      const {data}  = await Axios.get(`${config.baseURL}${subPathCat}${category}?merchantCode=${merchantCode}`);
      return dispatch({
       type: PRODUCT_LIST_SUCCESS,
       payload:data,
     });

     }else{
      const {data} = await Axios.get(`${config.baseURL}${subPathProd}${merchantCode}`);
      return dispatch({
       type: PRODUCT_LIST_SUCCESS,
       payload:data,
     });
     }
  } catch (error) {
    return dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const createOrder = async (dispatch, order) => {
  
  dispatch({ type: ORDER_CREATE_REQUEST });
  // if(order){order.userId=userDetails[0]._id}
  try {
    const { data } = await Axios.post(`${config.baseURL}/api/temporders?merchantCode=${merchantCode}`, order);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message,
    });
  }
};


export const setCustomerId= async (dispatch,customerId)=>{
  return dispatch({
    type: SET_CUSTOMER_ID,
    payload: customerId,
  });

}

export const setOrderType = async (dispatch, orderType) => {
  return dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};
export const setPaymentType = async (dispatch, paymentType) => {
  return dispatch({
    type: ORDER_SET_PAYMENT_TYPE,
    payload: paymentType,
  });
};
export const clearOrder = async (dispatch) => {
  return dispatch({
    type: ORDER_CLEAR,
  });
};

export const addToOrder = async (dispatch, item) => {
  return dispatch({
    type: ORDER_ADD_ITEM,
    payload: item,
  });
};
export const removeFromOrder = async (dispatch, item) => {

// const {item} =await Axios.delete(`${baseURL}/api/orders/${item}`)
  return dispatch({
    type: ORDER_REMOVE_ITEM,
    payload: item,
  });
};

export const listQueue = async (dispatch) => {
  console.log(merchantDtl);
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`${config.baseURL}/api/order/queue/${merchantDtl[0]._id}`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_QUEUE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_QUEUE_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listOrders = async (dispatch) => {
console.log(merchantDtl);
let subPathOrd = "/api/orders?merchantCode=";
  if(merchantDtl&& merchantDtl.posProviderName && merchantDtl.posProviderName.toUpperCase() == 'CLOVER' ){
    subPathOrd = "/api/clover/orders?merchantCode=";
  }
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`${config.baseURL}${subPathOrd}${merchantCode}`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.message,
    });
  }
};
