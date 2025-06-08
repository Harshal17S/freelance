import React,{ useState,useContext } from 'react';
import { useStyles } from '../styles';
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Varieties from "./Varieties";
import Adons from "./AddOns";
import CookInstructions from './CookInstructions';
import Checkbox from "@mui/material/Checkbox";
import CurrencySymbol from './CurrencySymbol';
import Slider from "react-slick";
import { Store } from "../Store";
import {Box,Button,Card,CardActionArea,CardContent,CardMedia,DialogTitle,Grid,Slide,TextField,Typography,
} from "@material-ui/core";

export default function OrderCustomize(props) {
  const styles = useStyles();
  let t= props.t;
  const { state, dispatch } = useContext(Store);
  let {customizeInWizard} = state;
  console.log(props.orderItem);
  let prodAdOnCats= props.categories.filter(cat => props.orderItem.add_ons.indexOf(cat.id) != -1)
  const [customInstr, setCustomInstr] = useState("");
  let isEditOrdItem = props.orderItems.filter(om=> om.id== props.orderItem.id).length;
  let minTtlAdon=0;
  function getMinAdon(total, cat) {
  return total + (cat.hasOwnProperty("minAddOnAllowed")?cat.minAddOnAllowed:1);
}
  minTtlAdon=prodAdOnCats.reduce(getMinAdon,0);
  console.log('minTotal',minTtlAdon);
  
  const handleCookInstr = (instr) => {
    let prod = {...props.orderItem};
    let ciIndx = -1; 
    prod.sub_pro.cookInstructions.filter((ci, i) => {return ci == instr?ciIndx=i:false});
    console.log(ciIndx);
    if(ciIndx != -1){
      prod.sub_pro.cookInstructions.splice(ciIndx,1);
    }else{
      prod.sub_pro.cookInstructions.push(instr);
    }
    console.log(prod);
    props.setOrderItem(prod);
  };

  const onAdOnItemSelectChange = (AoI, isRemove) => {
    console.log(AoI);
    let prod = {...props.orderItem};
    let AoIndx = -1; 
    prod.sub_pro.addons.map((ao, i) => {return ao.id == AoI.id?AoIndx=i:false});
    console.log(AoIndx);
    if(AoIndx != -1){
      prod.sub_pro.addons.splice(AoIndx,1);
    }else if((AoIndx == -1) && !isRemove) {
      prod.sub_pro.addons.push(AoI);
    }
    console.log(prod);
    props.setOrderItem(prod);
  }
var settings = {
    dots: customizeInWizard?true:false,
    infinite: false,
    speed: 500,
    slidesToShow: customizeInWizard?1:prodAdOnCats.length+2,
    slidesToScroll: 1,
    swipeToSlide: true,
    lazyLoad:customizeInWizard?true:false,
    vertical:customizeInWizard?false:true
  };
 const handleVarieties = (varNm,varPrc) => {
    let prod = {...props.orderItem};
    prod.sub_pro.variety = {};
    prod.sub_pro.variety[varNm]= varPrc;
    props.setOrderItem(prod);
  }


  // if(!customizeInWizard){
  //     Slider = (child)=> <>{child}</>;
  // }

  let { userInfo } = state.userData;

  const themeColor = userInfo?.themeColor || '#ffbc01';  
  const themeTxtColor = userInfo?.themeTxtColor || '#000'; 
  
  return (
        <Box className="custom_window" style={{ backgroundColor: themeColor}}> 
        <Slider {...settings}>
         <div id="titorder" className={customizeInWizard?styles.center:styles.centerAutoFit}  data-index={0}>

            <Card
              className={styles.cardd}
              id="card-img"
              style={{
                width: "342px",
                minHeight: "230px",
                height:"auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop:"10px"
              }}
            >
              <CardMedia
                component="img"

                alt={props.orderItem.name}
                image={props.orderItem.image}
                className={styles.mediaMd}
                onError={props.imageOnErrorHandler}
               
              />
              <h4>{props.orderItem.name}</h4>
              <span style={{padding:"10px"}}>{props.orderItem.description}</span>
              <h4><CurrencySymbol />
              <span> {props.orderItem.price}</span></h4>
            </Card>
             
              <div id="btnorder" className={[styles.countRow, styles.center]}>
         {false&&<h2 ><i style={{color:themeTxtColor}}>{props.t({ id: "choose_your_quantity" })}</i></h2>}
            <Button
              className={styles.minus}
              id="minus_btn"
              variant="contained"
              color="primary"
              disabled={props.quantity === 1}
              onClick={(e) => props.quantity > 1 && props.setQuantity(props.quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput }}
              InputProps={{
                bar: true,
                inputProps: {
                  className: styles.largeInput,
                  style: { color: themeTxtColor }
                },
              }}
              className="largeNumber"
              type="number"
              variant="filled"
              min={1}
              value={props.quantity}
              style={{ color: themeTxtColor}}
            />

            <Button
              className={styles.add}
              id="plus_btn"
              variant="contained"
              style={{ color: "#fff"}}
           
              onClick={(e) => props.setQuantity(props.quantity + 1)}
            >
              <AddIcon sx={{ fontSize: "1px" }} style={{color: "#fff"}} />
            </Button>
          </div>
        
         <Varieties 
          varieties= {props.orderItem.varietyPrices} 
          t={t}
          orderItem = {props.orderItem}
          handleVarieties= {handleVarieties}
          />
          </div>
            
          {prodAdOnCats.map((cat, i) => 
          {

            return <div className={customizeInWizard?styles.center:styles.centerAutoFit} >
          <Adons cat={cat} 
            onSelectionChange={onAdOnItemSelectChange} 
            items={props.items}
            orderItem = {props.orderItem}
             t={t}
             baseURL={props.baseURL}
             customizeInWizard={customizeInWizard}
             imageOnErrorHandler={props.imageOnErrorHandler}/>
           </div>} )}
          
          <CookInstructions t={props.t} 
          cookInst={props.orderItem.cookInstructions} 
          orderItem = {props.orderItem}
          t={t}
          customInstr={customInstr}
          setCustomInstr={setCustomInstr}
          handleCookInstr={handleCookInstr}
          minTtlAdon={minTtlAdon}
          customizeInWizard={customizeInWizard}/>

        </Slider>

          <Box id="footorder" className={[styles.row, styles.around]}>
            <Button
              onClick={()=>{isEditOrdItem?props.removeOrderItm(): props.setIsCustomizeOpen(false)}}
              size="large"
              variant="outlined"
              style={{
                backgroundColor: themeColor,
                color: themeTxtColor,
                padding: "6px 22px!important",
                border: '2px solid #000',
                borderRadius: "32px"
              }}
            >
              {isEditOrdItem? t({ id: "remove" }):t({ id: "cancel" })}
            </Button>

            <Button
              onClick={()=>props.addToOrderHandler(customInstr)}
              variant="contained"
              size="large"
              className={styles.rightlargeButton}
              id="btcart"
              disabled={(minTtlAdon > props.orderItem['sub_pro']['addons'].length)}
            >
              {isEditOrdItem?t({ id: "update" }):t({ id: "add" })}
            </Button>
          </Box>
        </Box>
  );
}
