import React from 'react';
import { useStyles } from '../styles';
import Checkbox from "@mui/material/Checkbox";
import {Box,CardMedia} from  "@material-ui/core";
import CurrencySymbol from './CurrencySymbol';

export default function AddOns(props) {
  const styles = useStyles();
  let selectedCount=0;
  let allowedMaxCount = props.cat.maxAddOnAllowed;
  let minCount = props.cat.minAddOnAllowed;
  
        return   <div className={props.customizeInWizard?styles.center:styles.centerAutoFit} > 
        <h3  style={{textAlign:"center",margin:"2px"}}><i style={{color:'#fff'}}>{props.t({ id: "choose_your" })}</i>{" "}{props.cat.name}</h3>
          <div style={{fontWeight:"bold",fontSize:"0.8em",textAlign:"center"}}>{'(Min: '+minCount+ ', Max: '+ allowedMaxCount+')'}</div>
                  <div className={props.customizeInWizard?'add_on_container container_ad':"add_on_container"}>
                    {props.items.filter(itm=> itm.category == props.cat.id).map(itm => 
                    {
                      let isSelected=props.orderItem['sub_pro']['addons'].filter(ao => ao.id == itm.id).length;
                      if(isSelected) {selectedCount= selectedCount+1;}
                     
                      return <div style={{background: isSelected ?'#23B909':""}} className='add_on_item' id={itm.id}
                    onClick={()=>(allowedMaxCount > selectedCount? props.onSelectionChange(itm):props.onSelectionChange(itm,true))}>
                      <CardMedia
                                component="img"
                                image={itm.image}
                                className={styles.mediaSmall}
                                onError={props.imageOnErrorHandler}
                              />
                    <h2 style={{margin:"5px",fontSize:"0.9em"}}> {itm.name} </h2>
                    <div>
                      <h4 style={{margin:"5px"}}>
                        <CurrencySymbol/> <b>{itm.price}</b>
                      </h4>
                    </div>
                  </div>}
      
                    )
                   
                  }
              </div></div>

}
