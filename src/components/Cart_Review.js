import React ,{ useContext }from 'react';
import { useStyles } from '../styles';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import BackButton from './Back_Button';
import {Box,Button} from "@material-ui/core";
import CurrencySymbol from './CurrencySymbol';
import { Store } from "../Store";

export default function CartReview(props) {
  const { state, dispatch } = useContext(Store);
  let { userInfo } = state.userData;

  console.log(userInfo);

  const themeColor = userInfo?.themeColor || '#ffbc01';  
  const themeTxtColor = userInfo?.themeTxtColor || '#000'; 

  const styles = useStyles();
  let t = props.t;
  let oItems = props.orderItems;

  return (
    <Box style={{minHeight:"500px",padding:"5px 10px", background: themeColor}}>
    <div className="cart_header">
    <BackButton handleClick={()=>props.setIsCartOpen(false)}/>
          <span style={{marginLeft:'70px', color: themeTxtColor}}>{t({ id: "my_order" })}</span>
        </div>
          <div
            className="cart_items"
            style={{ maxHeight: "680px",minHeight:'400px',width:"100%",padding:"10px", overflowY: "auto" }}
          >
            <table cellPadding="2px" cellSpacing="5px" id="tab1" style={{borderCollapse: 'collapse'}}>
              <thead>
                <tr  style={{
                            borderBottom: "2px solid #FFBC00",
                            fontSize: "15px",
                          }}>
                  <th  colSpan="2">{t({ id: "items" })}</th>
                  <th >{t({ id: "quantity" })}</th>
                 <th >{t({ id: "edit" })}</th>
                 
                </tr>
              </thead>
              <tbody>
                {oItems.length
                  ? oItems.map((oItem) => {
                      const subPro = oItem.sub_pro;
                      console.log(subPro);
                      const subProAdOnNames =
                        subPro.addons
                          ? subPro.addons.map((subPro) => subPro.name)
                          : [];
                      const subProInstruction =
                        subPro && subPro.cookInstructions
                          ? subPro.cookInstructions
                          : [];
                      const subProVarieties =
                        subPro && subPro.variety && Object.keys(subPro.variety).length
                          ? Object.keys(subPro.variety)[0]
                          : "";
                      const addonTotalPrice =
                        subPro && subPro.addons
                          ? subPro.addons.reduce((acc, val) => {
                              if (val.price) {
                                return acc + parseFloat(val.price);
                              }
                              return acc;
                            }, 0)
                          : 0;
                      return (
                        <tr
                          style={{
                            borderBottom: "2px solid #FFBC00",
                            fontSize: "15px",
                          }}
                        >
                          <td>
                            <b>{oItem.name} </b>
                            <br />
                              <Chip
                                label={subProVarieties.toUpperCase()}
                                className="chip-txt-var"
                              />
                            
                           
                              <Chip
                                label={subProAdOnNames.join(", ").toUpperCase()}
                                className="chip-txt"
                                
                              />
                           
                           
                              <Chip
                                label={subProInstruction.join(', ').toUpperCase()}
                                className="chip-txt-inst"
                              />
                           
                           
                          </td>
                          <td></td>
                          <td><b style={{fontSize:"1.2em"}}>{oItem.quantity}</b>
                            <br/><CurrencySymbol/>
                            {(Number(oItem.price) || 0) +
                              (subPro && subPro.addons
                                ? subPro.addons.reduce(
                                    (acc, val) =>
                                      acc + (Number(val.price) || 0),
                                    0
                                  )
                                : 0)}
                              
                          </td>
                           <td><EditIcon
                              className="cart_edit"
                              onClick={() => (props.productClickHandler(oItem,true),props.setIsCartOpen(false))}
                            /></td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </table>
        
        </div>
        <Box id="footorder" className={[styles.row, styles.around]}>
            <Button
              onClick={()=>props.setIsCartOpen(false)}
              size="large"
              variant="outlined"
              style={{
                backgroundColor: "#FFF !important",
                color: themeTxtColor,
                padding: "6px 22px!important",
                border: '2px solid #000',
                borderRadius: "32px"
              }}
            >
              { t({ id: "cancel" })}
            </Button>

            <Button
              disabled={!oItems.length}
              onClick={props.procedToCheckoutHandler}
              variant="contained"
              size="large"
              className={styles.rightlargeButton}
              id="btcart_next"
            >
             {t({ id: "checkout" })}
            </Button>
          </Box>
         
          </Box>
  );
}
