import React ,{ useState } from 'react';
import { useStyles } from '../styles';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {Box,TextField} from  "@material-ui/core";
export default function CookInstructions(props) {
  const styles = useStyles();
  let t= props.t;
  setTimeout(()=>{
    let cartbtn =document.getElementById('btcart');
  if(cartbtn || !props.customizeInWizard){
  cartbtn.style.display='block';
  }
  if(!props.customizeInWizard){
  console.log('-------');
  let slickTrk =document.querySelectorAll('.MuiDialog-container .slick-track')[0];
  let slickList =document.querySelectorAll('.MuiDialog-container .slick-list')[0];
  console.log('-------',slickTrk);
  slickList.className='slick-list '+styles.centerWithScroll;
  slickTrk.className= "slick-track "+styles.fixHeight;
  slickTrk =document.querySelectorAll('.MuiDialog-container .slick-track')[0];
  console.log('-------',slickTrk);
  }
},500);
  
  
  
  return (
     <div className={props.customizeInWizard?styles.center:""}  style={{textAlign: "center", margin:"30px 0px" }} >
     <h3>{t({ id: "select_cook_instruction" })}</h3>
    {props.orderItem.cookInstructions &&<ToggleButtonGroup
        value={props.orderItem.sub_pro.cookInstructions}
        exclusive
        aria-label="text alignment"
      >
        {props.cookInst.split(',').map((key, index) => (
          <ToggleButton
            style={{ display: "inline-block",background:"#fff",borderLeft:"1px solid #ccc" }}
            value={key}

            onClick={()=>props.handleCookInstr(key)}
            aria-label="left aligned"
          >
            <div style={{ display: "block", width: "100%" }}>{key}</div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>}
      <div style={{padding:"10px 50px"}} >
 <TextField
              className="notes"
              type="text"
              variant="outlined"
              min={1}
              style={{fontSize:'1.2em'}}
              value={props.customInstr}
              onChange={(e)=>props.setCustomInstr(e.target.value)}
              fullWidth={true}
              placeholder={t({ id: "add_custom_notes" })}
            />

      </div>
                {(props.minTtlAdon > props.orderItem['sub_pro']['addons'].length)?<h3 style={{textAlign:"center",color:"red"}}>{t({ id: "add_min_order" })}</h3>:""}
      </div>
  );
}
