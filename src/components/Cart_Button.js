import React from 'react';
//import { useStyles } from '../styles';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function CartButton(props) {
  //const styles = useStyles();
  return (
     <div className="cart_dox" onClick={()=>props.handleCart(props.itemsCount)}>
      <span className="cart_count">
          {props.itemsCount}
        </span>
        <div >
        <ShoppingBagIcon sx={{ cursor: "pointer", color: "white" }} />
        </div>
       
      </div>
  );
}
