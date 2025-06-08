import React, { createContext, useReducer } from "react";
import useReducerWithThunk from "use-reducer-thunk";
import Currencies from "./utils/Currencies";
import {
  SET_CUSTOMER_ID,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
  ORDER_SET_SCHEDULE_DATE,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  ORDER_SET_TYPE,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_REQUEST,
  SCREEN_SET_WIDTH,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  GENERATE_URL_REQUEST,
  GENERATE_URL_SUCCESS,
  GENERATE_URL_FAIL,
  GENERATE_QRCODE_REQUEST,
  GENERATE_QRCODE_SUCCESS,
  GENERATE_QRCODE_FAIL,
  FETCH_QRCODE_REQUEST,
  FETCH_QRCODE_SUCCESS,
  FETCH_QRCODE_FAIL,
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
} from "./constants";
import config, { getParameterByName, merchantCode } from "./util";
import { setCustomerId } from "./actions";

export const Store = createContext();

const userCurrency = getParameterByName("currency");
// // const userId=getParameterByName('userid');
const logo = getParameterByName("logo");
// const getPercent =getParameterByName('taxPercent');

console.log(config);

const initialState = {
  widthScreen: true,
  orderList: { loading: true },
  paymentUrl: { loading: true, paymentData: null },
  queueList: { loading: true },
  categoryList: { categories: [], loading: false, error: false },
  productList: { loading: true, products: [] },
  userData: { loading: true, userInfo: [] },
  userSetting: { loading: true },
  order: {
    orderItems: [],
    orderType: "Take Away",
    paymentType: "",
    taxPrice: 0,
    totalPrice: 0,
    itemsCount: 0,
    userId: "",
    orderStatus: "PENDING",
    userId: "",
    orderSource: "Online Order",
    customerId: "",
    scheduleDate: 0,
  },
  newURL: {
    loading: true,
    data: null,
    error: null,
  },
  fetchQr: {
    loading: true,
    data: null,
    error: null,
  },
  selectedCurrency: "",
  selectedLogo: getParameterByName("logo"),
  orderCreate: { loading: true },
  taxPercent: "",
  signInData: { loading: true, signInInfo: [] },
  taxPercent: 0,
  takeAwayTax: 0,
  dineinTax: 0,
  themeColor: "#ffbc01",
  logoImg:"",
  themeTxtColor: "#000",
  customizeInWizard: false,
  isItemInclusiveTax: false,
  promos:[]
};

function reducer(state, action) {
  console.log(state);
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };
    case SET_CUSTOMER_ID:
      return {
        ...state,
        order: { ...state.order, customerId: action.payload },
      };
    case ORDER_SET_TYPE:
      return {
        ...state,
        order: { ...state.order, orderType: action.payload },
      };
    case ORDER_SET_PAYMENT_TYPE:
      return {
        ...state,
        order: { ...state.order, paymentType: action.payload },
      };
    case ORDER_SET_SCHEDULE_DATE:
      return {
        ...state,
        order: { ...state.order, scheduleDate: action.payload },
      };
    case PAYNOW_SUCCESS:
      return {
        ...state,
        paymentUrl: { ...state.paymentUrl, paymentData: action.payload },
      };

    case FETCH_PROMOS_SUCCESS:
      return {
        ...state,
        promos: { ...state.promos, promos: action.payload },
      };
    case CATEGORY_LIST_REQUEST:
      return { ...state, categoryList: { loading: true } };
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: { loading: false, categories: action.payload },
      };
    case CATEGORY_LIST_FAIL:
      return {
        ...state,
        categoryList: { loading: false, error: action.payload },
      };

    case FETCH_USERDATA_REQUEST:
      return { ...state, userData: { loading: true } };
    case FETCH_USERDATA_SUCCESS:
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return {
        ...state,
        order: { ...state.order, userId: action.payload.merchantCode },
        userData: { loading: false, userInfo: action.payload },
        taxPercent: action.payload.taxPerc,
        selectedCurrency: action.payload.currency.toLowerCase(),
        taxPercent: action.payload.taxPerc,
        takeAwayTax: action.payload.takeAwayTax,
        dineinTax: action.payload.dineinTax,
        themeColor: action.payload.themeColor,
        themeTxtColor: action.payload.themeTxtColor,
        customizeInWizard: action.payload.customizeInWizard,
        isItemInclusiveTax: action.payload.isItemInclusiveTax,
        logoImg:action.payload.logoImg
      };
    case FETCH_USERDATA_FAIL:
      return {
        ...state,
        userData: { loading: false, error: action.payload },
      };

    case FETCH_USERSETTING_REQUEST:
      return { ...state, userSetting: { loading: true } };
    case FETCH_USERSETTING_SUCCESS:
      return {
        ...state,
        userSetting: { loading: false, setting: action.payload },
        taxPercent: action.payload.taxPerc,
        takeAwayTax: action.payload.takeAwayTax,
        dineinTax: action.payload.dineinTax,
        themeColor: action.payload.themeColor,
        themeTxtColor: action.payload.themeTxtColor,
        customizeInWizard: action.payload.customizeInWizard,
        selectedCurrency: action.payload.currency.toLowerCase(),
        isItemInclusiveTax: action.payload.isItemInclusiveTax,
        logoImg:action.payload.logoImg
      };
    case FETCH_USERSETTING_FAIL:
      return {
        ...state,
        userSetting: { loading: false, error: action.payload },
      };

    // SIGN DATA
    case USER_SIGNIN:
      return { ...state, signInData: { loading: true } };
    case USER_SIGNIN_SUCCESS:
    case USER_SIGNUP_SUCCESS:
      return {
        ...state,
        signInData: { loading: false, signInInfo: action.payload },
      };
    case USER_SIGNIN_FAIL:
      return {
        ...state,
        signInData: { loading: false, error: action.payload },
      };

    case PRODUCT_LIST_REQUEST:
      return { ...state, productList: { loading: true } };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        productList: { loading: false, products: action.payload },
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...state,
        productList: { loading: false, error: action.payload },
      };
    case ORDER_QUEUE_LIST_REQUEST:
      return { ...state, queueList: { loading: true } };
    case ORDER_QUEUE_LIST_SUCCESS:
      return {
        ...state,
        queueList: { loading: false, queue: action.payload },
      };
    case ORDER_QUEUE_LIST_FAIL:
      return {
        ...state,
        queueList: { loading: false, error: action.payload },
      };
    case ORDER_LIST_REQUEST:
      return { ...state, orderList: { loading: true } };
    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        orderList: { loading: false, orders: action.payload },
      };
    case ORDER_LIST_FAIL:
      return {
        ...state,
        orderList: { loading: false, error: action.payload },
      };
    case ORDER_CREATE_REQUEST:
      return { ...state, orderCreate: { loading: true } };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreate: { loading: false, newOrder: action.payload },
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreate: { loading: false, error: action.payload },
      };
    case ORDER_ADD_ITEM: {
      const item = action.payload;
      const existItem = state.order.orderItems.find(
        (x) => x.name === item.name
      );
      const orderItems = existItem
        ? state.order.orderItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.order.orderItems, item];

      let addonTotalPrice = 0;

      orderItems.map((item) => {
        if(item.sub_pro.addons){
        item.sub_pro.addons.map(
          (ad) => (addonTotalPrice = addonTotalPrice + ad.price)
        );
      }else if(item.addons){
        item.addons.map(
          (ad) => (addonTotalPrice = addonTotalPrice + ad.price)
        );
      }
      });

      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);

      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      console.log(state.taxPercent);
      console.log(state.takeAwayTax);
      function round(x) {
        return Math.ceil(x / 5) * 5;
      }
      let taxPerc =
        state.order.orderType.toLowerCase() == "eat in"
          ? state.taxPercent || state.dineinTax
          : state.taxPercent || state.takeAwayTax;
      let taxPrice = 0;
      let totalPrice = 0;
      taxPrice = taxPerc
        ? Math.round((taxPerc / 100) * (itemsPrice + addonTotalPrice) * 100) /
          100
        : 0;
      if (state.isItemInclusiveTax) {
        totalPrice = Math.round((itemsPrice + addonTotalPrice) * 100) / 100;
      } else {
        totalPrice =
          Math.round((itemsPrice + addonTotalPrice + taxPrice) * 100) / 100;
        console.log(taxPrice);
      }

      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };
    }
    case ORDER_REMOVE_ITEM:
      const orderItems = state.order.orderItems.filter(
        (x) => x.name !== action.payload.name
      );
      let addonTotalPrice = 0;

      orderItems.map((item) => {
        const subProArray =
          typeof item.sub_pro === "string"
            ? JSON.parse(item.sub_pro)
            : item.sub_pro;
        console.log(subProArray);
        subProArray.addons.map(
          (ad) => (addonTotalPrice = addonTotalPrice + ad.price)
        );
      });
      console.log(addonTotalPrice);
      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      console.log(itemsPrice);
      const itemquantity =
        orderItems && orderItems[0]
          ? orderItems[0].quantity * addonTotalPrice
          : 0;
      console.log(itemquantity);

      let taxPerc =
        state.order.orderType.toLowerCase() == "eat in"
          ? state.taxPercent || state.dineinTax
          : state.taxPercent || state.takeAwayTax;
      const taxPrice = taxPerc
        ? Math.round((taxPerc / 100) * itemsPrice * 100) / 100
        : 0;
      const totalPrice =
        Math.round((itemsPrice + addonTotalPrice + taxPrice) * 100) / 100;
      console.log(taxPrice);
      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };

    case ORDER_CLEAR:
      return {
        ...state,
        order: {
          orderItems: [],
          taxPrice: 0,
          totalPrice: 0,
          itemsCount: 0,
        },
      };

    case GENERATE_URL_REQUEST:
      return { ...state, newURL: { loading: true } };
    case GENERATE_URL_SUCCESS:
      return {
        ...state,
        newURL: { loading: false, data: action.payload },
      };
    case GENERATE_URL_FAIL:
      return {
        ...state,
        newURL: { loading: false, data: action.payload },
      };

    case FETCH_QRCODE_REQUEST:
      return { ...state, fetchQr: { loading: true } };
    case FETCH_QRCODE_SUCCESS:
      return {
        ...state,
        fetchQr: { loading: false, data: action.payload },
      };
    case FETCH_QRCODE_FAIL:
      return {
        ...state,
        fetchQr: { loading: false, data: action.payload },
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //const [state, dispatch] = useReducerWithThunk(reducer, initialState, 'example');

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
