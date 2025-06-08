import React ,{ useContext, useState }from 'react';
//import { useStyles } from '../styles';
import Currencies from "../utils/Currencies";
import { Store } from "../Store";
export default function CurrencySymbol(props) {
   const { state, dispatch } = useContext(Store);
  const selectedCurrency = state.selectedCurrency;
  const renderCurrencySymbol = () => {
    return <span dangerouslySetInnerHTML={{ __html: getCurrencyByName(selectedCurrency) }} />;
  };

  const getCurrencyByName=(currency)=> {
    let cur = Currencies.filter(
      (curen) => curen.abbreviation == currency.toUpperCase()
    );
    return cur.length && cur[0].symbol;
  }
  return (
    <span>{renderCurrencySymbol()}</span>
  );
}
