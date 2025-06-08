import React from 'react';
import { useStyles } from '../styles';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CurrencySymbol from './CurrencySymbol';

export default function BillSummary(props) {
  const styles = useStyles();
  let t = props.t;
  let oItems = props.orderItems;
  return (
    <div>
        <div className="cart_sub" id="cart_s">
          
          <div className="cart_items" id="item2">
            <h3
              id="h3"
              style={{
                fontSize: "25px",
                marginTop: "14px",
                marginLeft: "21px",
              }}
            >
              {t({ id: "bill_summary" })}
            </h3>
            <table style={{ width: "100%", fontSize: "1.2em" }} id="tab1">
              <tr>
                <td>{t({ id: "subtotal" })} :</td>
                <td align="end">
                  <CurrencySymbol/> {(props.totalPrice - props.taxPrice).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td>{t({ id: "tax" })} :</td>
                <td align="end">
                  <CurrencySymbol/> {props.taxPrice.toFixed(2)}
                </td>
              </tr>
              {false &&<tr>
                <td>Discount :</td>
                <td align="end"><CurrencySymbol/> 0.00</td>
              </tr>}
            </table>
            <div style={{ position: "relative", top: "20px" }} id="total">
              <table
                style={{
                  width: "100%",
                  fontSize: "20px",
                  marginBottom: "30px",
                }}
              >
                <tr>
                  <td>
                    {" "}
                    {t({ id: "total_amt" })} :
                  </td>
                  <td align="end" style={{fontSize:"2em"}}><b>
                    <CurrencySymbol/>
                    {props.totalPrice.toFixed(2)} </b>
                  </td>
                </tr>
              </table>
              
            </div>
          </div>
         
        </div>
          </div>
  );
}
