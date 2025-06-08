import React,{ useState } from 'react';
import { useStyles } from '../styles';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {Box} from "@material-ui/core";
import CurrencySymbol from './CurrencySymbol';

export default function Varieties(props) {
  const styles = useStyles();
  if(!props.orderItem.varietyPrices||
    props.orderItem.varietyPrices == "\"\"" || 
    props.orderItem.varietyPrices == "{}")
    {
      return null;
    }
  
  let varieties = JSON.parse(props.varieties);
  let varNames= Object.keys(varieties);
  let selectedList =Object.keys(props.orderItem.sub_pro.variety);
  let selVarArr = selectedList.length?selectedList:
  props.handleVarieties(varNames[0],varieties[varNames[0]])
  
  return (
    <div style={{ textAlign: "center", marginTop:"15px",width:'100%' }} data-index={1}>
    <h5 ><i style={{color:'#fff'}}>{props.t({ id: "choose_your" })}</i>{" "} {props.t({ id: "select_size" })}</h5>
    
    <ToggleButtonGroup
        value={selVarArr}
        exclusive
        aria-label="text alignment"
        style={{display:"inline-block",textAlign:"center",margin:"5px" }}
      >

        {varNames.map((varName, index) => (

          <ToggleButton
            style={{borderLeft:"1px solid #ccc", display: "inline-block",padding:"20px",fontSize:"1.0em", backgroundColor: "white" }}
            value={varName}
            onClick={()=>props.handleVarieties(varName,varieties[varName])}
            aria-label="left aligned"
          >
            <div style={{ display: "block", width: "100%" }}>{varName}</div>
            <div
              style={{ color: "#000", fontWeight: "bold", fontSize: "1.0em" }}
            >
              <CurrencySymbol />{varieties[varName]}
            </div>
          </ToggleButton>

        ))}
     </ToggleButtonGroup></div>
  );
}
