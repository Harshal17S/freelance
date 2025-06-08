import React, { useContext, useEffect, useState } from 'react';
import config,{ getParameterByName,merchantCode} from '../util';
import { Store } from '../Store';
import axios from "axios";
import Slider from "react-slick";


import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';

import {
  addToOrder,
  clearOrder,
  removeFromOrder,
  getUserData
} from '../actions';
// import {getUserData,getUserSettings} from './actions';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  Slide,
  TextField,
  Typography,
} from '@material-ui/core';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Alert } from '@material-ui/lab';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import ReviewScreen from './ReviewScreen';

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function OrderScreen(props) {
  
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;

  const {
    orderItems,
    itemsCount,
    totalPrice,
    taxPrice,
    orderType,
  } = state.order;
  console.log(orderItems);
  const selectedCurrency = state.selectedCurrency;
  
 let cat_time =null;
  console.log(state.userSetting);

  const[totalProducts,setTotalProducts]=useState([]);

  const [totalAddons,setTotalAddons]=useState([]);
  const [itemGroup,setItemGrorp]=useState([]);
  const[filterItmGrp,setFilterItmGrp]=useState([]);
  const[itemGrpId,setItemGrpId]=useState("");
  
  const[addonsGroup,setAddonsGroup]=useState([]);
  
  
  const [catId,setCatId]=useState("")
    const [categoryName, setCategoryName] = useState('');
    const [foodName, setFoodName] = useState("");
    const [tags, setTags] = useState([]);
    const [setCategories] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageURL, setImageURL] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isVegOnly, setIsVegOnly] = useState(false);
    const [addons,setAddons]=useState([]);
  const [subPro,setSubPro]=useState([]);
  const [selectedLogo, setSelectedLogo] = useState('../images/logo.png');
  const[isPaneOpen,setIsPaneOpen]=useState(false);
  
  
    
    const baseURL = config.baseURL;
    console.log(products);
  
   

    let filteredProducts = [];
    if (products) {
      filteredProducts = products.filter(p => ((isVegOnly && p.cat_type.toUpperCase() === "VEG" && p.inStock) || !isVegOnly && p.inStock));
    }
    
    console.log(filteredProducts);
   let {setting} = state.userSetting;
   let {userInfo}=state.userData;
      console.log(setting,userInfo);
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  
    if(userInfo){
      let body = document.getElementsByTagName("body");
     body[0].style.backgroundImage = `url(${userInfo.sokBGImg})  !important`;
     body[0].style.backgroundPosition= "center  !important";
     body[0].style.backgroundSize= "cover  !important";
     body[0].style.backgroundRepeat="no-repeat  !important";
     // setTimeout(() => {
     //   let reName=document.getElementById("name");
     //   let textcolor = document.getElementById("title");
     //   textcolor.style.color = setting.color_primary;
     //   reName.style.color = setting.color_primary;
     // }, 10);
    }
    const [product, setProduct] = useState([]);
    console.log(product);
  
    const closeHandler = () => {
      setIsOpen(false);
    };
  
    const vegHandler = () => {
      console.log(products);
      setIsVegOnly(!isVegOnly);
    }
  
  
    useEffect(()=>{
      console.log('---getting adons---');
      if(!addonsGroup.length && userInfo){
        axios.get(`${baseURL}/api/clover/modifiers?merchantCode=${merchantCode}`)
        .then(res=>setAddonsGroup(res.data))
      }
      if(!totalAddons.length && userInfo){
        axios.get(`${baseURL}/api/clover/product-modifiers?merchantCode=${merchantCode}`)
        .then(res=>{
          let adon=res.data.map(ad=>{
            ad["quantity"]=0
          return ad
          })
  
          setTotalAddons(adon);
        })
      }
      if(!itemGroup.length){
        axios.get(`${baseURL}/api/clover/products/itemGroups?merchantCode=${merchantCode}`)
        .then(res=>setItemGrorp(res.data))
      }
      document.getElementById('footer').style.display='none';
    },[])
    
    useEffect(()=>{
        axios.get(`${baseURL}/api/clover/products?merchantCode=${merchantCode}`)
        .then(res=>setTotalProducts(res.data))
    },[])
  
    useEffect(()=>{
      console.log(itemGroup);
      if(itemGroup.length && !itemGroup[0]["cat_type"]){
        let items=[]
        itemGroup.filter(it=>{
         filteredProducts.map(p=>{
                    if(p.itemGroup.id===it.id){
                      items.push(it) ;
                    }
                  })
        })
        console.log([...new Set(items)]);
        setFilterItmGrp([...new Set(items)])
      }else if(products&&products.length){
        // setFilterItmGrp(itemGroup.filter(i=>i.category===catId?catId:categories[0]._id?categories[0]._id:categories[0].id));
        setFilterItmGrp(products);
      }
    },[catId])


 
  
  
    const productClickHandler = (p) => {
      console.log(p);
  
      console.log(orderItems);
      let existingOrder = orderItems.filter(o => o.id === p.id);
      console.log(existingOrder);
      setProduct(p);
      
      if (existingOrder.length) {
        setQuantity(existingOrder[0].quantity);
      } else {
        setQuantity(1);
      }
      
            if(existingOrder.length > 0){
                  if(existingOrder[0].sub_pro){
  
                                    if(existingOrder[0]["category"]){
                                      let adongrp=[];

                                      existingOrder[0].add_ons.split(",").map(i=>{
                                        addonsGroup.map(ad=>{
                                          if(i===ad.id){
                                            adongrp.push(ad);
                                          }
                                        })
                                      })
                                      console.log('---',adongrp); 
                                      console.log(totalProducts);
                                      let adItms=[]
                                    adongrp.map(ag=>{
                                              totalProducts.map(pro=>{
                                                    if(ag.id===pro.category){
                                                      console.log(pro);
                                                      pro["quantity"]=0;
                                                        adItms.push(pro);
                                                    }
                                                  })
                                            });
                                                    let subP=[]
                                                    let exItem=[]
                                                  let exAd= JSON.parse(existingOrder[0].sub_pro);
  
                                                  adItms.map(p=>{
                                                        exAd.map(li=>{
                                                          if(p.id===li.id){
                                                            p.quantity=li.quantity;
                                                            subP.push(p);
                                                          }   
                                                      })
                                                      console.log(p);
                                                          exItem.push(p);
                                                    });
                                                    console.log(subP);
                                                    setSubPro(subP);
                                                    console.log(exItem);
                                                    setAddons(exItem);
                                    }else{
                                      let subP=[]
                                      let exItem=[]
                                    let exAd= JSON.parse(existingOrder[0].sub_pro);
  
                                        totalAddons.map(p=>{
                                          exAd.map(li=>{
                                            if(p._id===li._id){
                                              p.quantity=li.quantity;
                                              subP.push(p);
                                            }   
                                        })
                                        console.log(p);
                                            exItem.push(p);
                                      });
                                        console.log(subP);
                                        setSubPro(subP);
                                        console.log(exItem);
                                        setAddons(exItem);
                                    }
                                          
                  }
            }else if(p.modifierGroups){  
              
              let adGrp= p.modifierGroups.elements.length?p.modifierGroups.elements:[];
              console.log(totalAddons);
              let adItems=[]
              adGrp.filter(it=>{
                        totalAddons.filter(ad=>{
                          if(ad.category===it.id){
                            adItems.push(ad);
                          }
                        });
                   })
                         console.log(adItems);
                setAddons(adItems);
              }else if(p.add_ons){
                console.log(p.add_ons.split(","));
                          let adongrp=[];
                          p.add_ons.split(",").map(i=>{
                            addonsGroup.map(ad=>{
                              if(i===ad.id){

                                adongrp.push(ad);
                              }
                            })
                          }) 
                          console.log('--------relative groups----', adongrp);
                          console.log(totalProducts);
                          let adItms=[]
                        adongrp.map(ag=>{
                                  totalProducts.map(pro=>{
                                        if(ag.id===pro.category){
                                          console.log(pro);
                                          pro["quantity"]=0;
                                            adItms.push(pro);
                                        }
                                      })
                                });
                     setAddons(adItms);
              }
  
          
      setIsOpen(true);
    };
    console.log(addons);
  
    const addToOrderHandler = () => {
          product["sub_pro"]=JSON.stringify(subPro.map(li=>li));
  
          addToOrder(dispatch, { ...product, quantity });
  
          console.log(product);
        let adons= totalAddons.map(ad=>{
            ad.quantity=0;
          return ad
          })
  
          setTotalAddons(adons);
          setAddons([]);
          setIsOpen(false);
          setQuantity(1);
          setSubPro([]);
          // setAddons([]);
    };
    const cancelOrRemoveFromOrder = () => {
      let adons= totalAddons.map(ad=>{
        ad.quantity=0;
      return ad
      })
  
      setTotalAddons(adons);
      setAddons([]);
      setSubPro([]);
      removeFromOrder(dispatch, product);
      setIsOpen(false);
    };
    const previewOrderHandler = () => {
      props.history.push(`/select-payment?` + window.location.href.split('?')[1]);
    };
  
    // useEffect(()=>{
    //   getUserData(dispatch);
    // },[]);
  
    console.log(!categories);
    
    
  
    
    const categoryClickHandler = (cat_name, cat_id) => {
      console.log(cat_id);
      setCatId(cat_id);
      setCategoryName(cat_name);
      listProducts(dispatch, cat_id);
      setQuantity(1);
    };
  
  
    const removeAddons=(itemId)=>{
      let filterItems=addons.filter(i=>i._id===itemId);
      let existingItem =subPro.filter(p=>p._id===itemId);
      console.log(subPro);
      console.log(existingItem);
      if(existingItem.length === 0){
        filterItems[0].quantity = filterItems[0].quantity > 0?filterItems[0].quantity-1:filterItems[0].quantity;
      }
      console.log(filterItems);
  
      const items  = existingItem.length > 0?
                      subPro.map((x) =>{
                        if(x._id === existingItem[0]._id){
                          console.log(x.quantity,existingItem[0].quantity);
                          x.quantity = x.quantity > 0 ? x.quantity-1 : x.quantity;
                        }
                        return x;
                      }):[...subPro,filterItems[0]];
         
            setSubPro(items);     
    }
  
    const adAddons=(itemId)=>{
          let filterItems=addons.filter(i=>i._id===itemId);
          let existingItem =subPro.filter(p=>p._id===itemId);
          console.log(filterItems);
          console.log(existingItem);
          if(existingItem.length === 0){
            filterItems[0].quantity= filterItems[0].quantity+1;
          }
          console.log(filterItems);
  
          const items  = existingItem.length > 0 ?
                          subPro.map((x) =>{
                            if(x._id === itemId){
                              console.log("object");
                              x.quantity += 1;
                            }
                            return x;
                          }):[...subPro,filterItems[0]];
                    console.log(items);
             
                setSubPro(items);     
    }
  
    const imageOnErrorHandler = (event) => {
      event.currentTarget.src = "./images/blank.jpg";
    }
  
    const itemGroupHandle =(itmgrpId)=>{
         setItemGrpId(itmgrpId);
    }
  
    let  ItemsWithGrp = filterItmGrp.length?filterItmGrp:products;
  return (
    <Box className={styles.root} style={{backgroundColor: state.selectedBgColor}}>
{/*   <Box className={styles.center} style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>    
    <img src={selectedLogo} height='60px' width='210px' />
       
      </Box> */}
      
      <div style={{position:'fixed',top:'14px',right:'20%',cursor:"pointer"}}>
      
      <ShoppingBasketIcon  height='70px' width='70px'  onClick={()=>setIsPaneOpen(true)} />
      <span style={{color:'red',fontSize:'1.2em',position:'absolute',top: '-11px',left:'19px'}}>{itemsCount}</span>
       </div>
       <div style={{display:'none'}} className={styles.promo}>
      <Slider {...settings} autoplay={true} autoplaySpeed={2000} >
        <div>
        <img src="./images/sld1.jpeg" className={styles.promoImg}/>
        </div>
        <div><img src="./images/sld2.jpeg" className={styles.promoImg}/></div>
        <div><img src="./images/sld3.jpeg" className={styles.promoImg}/></div>
      </Slider>
      </div>
      <Slider {...settings}>
        <div className={styles.categoryContainer} >

          {categories && categories.map((category) => (

          <div className={styles.categoryItem} onClick={() => categoryClickHandler(category.name, category._id?category._id:category.id)} >
             { category.image ?
            <>
             <div className={styles.imageHolder}>
                <img className={styles.image} alt="ab" src={`${baseURL}/` + category.image} onError={imageOnErrorHandler} />
              </div>

              <div>
                {category.name}
              </div>
              </>
              :
              <div className='chip' style={{background:catId===(category._id?category._id:category.id)?"rgb(254 91 10)":"#014701",}} >{category.name}</div>}
            </div>
           
          

          ))
        }
        </div>
      </Slider>

      <SlidingPane
        className="some-custom-class"
        overlayClassName="some-custom-overlay-class"
        isOpen={isPaneOpen}
        width="95%"
        onRequestClose={() => {
          // triggered on "<" on left top click or on outside click
          setIsPaneOpen(false);
        }}
      >
       <div style={{padding:"20px"}}>
          <ReviewScreen setIsPaneOpen={setIsPaneOpen} />
       </div>

      </SlidingPane>

      <Box className={styles.main}>
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
          // maxWidth="sm"
          maxWidth={state.widthScreen ? 'sm' : 'xs'}
        > 
          <DialogTitle className={styles.center}>
            Add {product.name}
          </DialogTitle>
          
          <Box className={[styles.countRow, styles.center]}>
    
            <Button className={styles.minus}
               id='minus_btn'
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}>
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput }}
              InputProps={{
                bar: true,
                inputProps: {
                  className: styles.largeInput,
                },
              }}
              // className={styles.largeNumber}
              className='largeNumber'
              type="number"
              variant="filled"
              min={1}
              value={quantity}
            />

            <Button className={styles.add}
              id='plus_btn'
              variant="contained"
              color="primary"
              onClick={(e) => setQuantity(quantity + 1)}
            >

              <AddIcon sx={{ fontSize:"1px"}}/>
            </Button>
          </Box>
          <Box style={{margin:"10px"}}>
            <h5 style={{textAlign:"center"}}>{addons.length?"Add-ons":""}</h5>
            <div>
            { addons.length? addons.map(itm=> {
                    return(
                        <div style={{display:"flex",justifyContent:"space-between",alignContent:"center",padding:"3px 15px",fontSize:"20px",flexWrap:"wrap"}}>
                          {itm.name} <div className={styles.btn_group} id='btn_group'>
                        <span>{selectedCurrency} {itm.price} </span>
                                <span className={styles.addons} id='addons'>
                                <button className={styles.minus1} onClick={()=>removeAddons(itm._id)}><RemoveIcon /></button>
                                {itm.quantity} 
                                <button className={styles.plus} onClick={()=>adAddons(itm._id)}> <AddIcon sx={{ fontSize:"1px"}} /></button>
                                </span>
                              </div> 
                      </div> 
            )})
              :""}</div>
          </Box>
          <Box className={[styles.row, styles.around]} style={{marginBottom:"20px"}}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="outlined"
              color="primary"
              size="large"
              className={[styles.largeButton, styles.card]}
            >
              {orderItems.find((x) => x.name === product.name)
                ? 'Remove'
                : 'Cancel'}
            </Button>

            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              ADD 
            </Button>
          </Box>
        </Dialog>







        <Grid container>
          <Grid item md={12} xs={12}>
            <Typography
              gutterBottom
              className={[styles.title, styles.catTitleBox]}
              variant="h2"
              component="h2"
              id='title1'
            >
              {categoryName || 'All Menu'}
              {false&&<div className={styles.vegBtn} style={{ float: "right" }}>
                <FormGroup>
                  <FormControlLabel control={<Switch size='medium' defaultUnChecked color='success' />} onChange={vegHandler} style={{ color: "green", fontWeight: "400px" }} label="Only Veg" />
                </FormGroup>
              </div>}
            </Typography>

            <Grid container spacing={1}>
              {loadingProducts ? (
                <CircularProgress />
              ) : errorProducts ? (
                <Alert severity="error">{errorProducts}</Alert>
              ) : (
                ItemsWithGrp.map((it) =>{
                  return (<>
                  <Slide key={it.name} direction="up" in={true}>
                    <Grid item xl={2} lg={3} md={3} sm={12} xs={12}>
                      <Card
                        className={styles.card}
                        onClick={() =>it["userId"]?productClickHandler(it):itemGroupHandle(it.id)}
                      >
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt={it.name}
                            onError={imageOnErrorHandler}
                            image={`https://cloverstatic.com/menu-assets/items/${it._id}.jpeg`}
                            className={styles.media}
                          />
                          {
                            it.price?  <div style={{ backgroundColor: "#ea1e2c",position:"absolute",  width: "100px", right: "2px", padding: "3px",top:'0px',fontSize:'1.2em' }}>
                              <h3 style={{ margin: "0px" }}>{selectedCurrency}{it.price}</h3>
                            </div>:""
                          }
                          <CardContent className={styles.cardFooter}>
                            <Box className={styles.foot}>
                              <Typography
                                gutterBottom
                                className={styles.prod_title}
                                variant="h6"
                                color="primary"
                                component="p"
                                style={{lineHeight:1}}
                              >
                                {it.name}
                              </Typography>
                              {/* <Typography
                                variant="subtitle1"
                                className={styles.prod_cal}
                                component="p"
                              >
                                {product.calorie} Cal
                              </Typography> */}
                            </Box >
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </Slide>

                <Dialog
                onClose={()=>setItemGrpId("")}
                aria-labelledby="max-width-dialog-title"
                fullScreen="sm"
                open={itemGrpId===it.id}
                fullWidth={true}
                // maxWidth="sm"
                      maxWidth={state.widthScreen ? 'lg' : 'md'}
                      > 
                       <AppBar sx={{ position: 'relative',marginBottom:"18px" }}>
                              <Toolbar>
                                {/* <IconButton
                                  edge="start"
                                  color="error"
                                  style={{fontSize:"18px"}}
                                  onClick={()=>setItemGrpId("")}
                                  aria-label="close"
                                >
                                Back
                                </IconButton> */}
                                <Typography style={{marginLeft:"25px"}} color="secondary" sx={{ ml: 2, flex: 1 }} variant="h5" component="h5">
                                  {it.name}
                                </Typography>
                                <div style={{position:'fixed',top:'14px',right:'20%'}}>
                                  <ShoppingBasketIcon style={{color:"#ffffff"}}  height='70px' width='70px'  />
                                  <span style={{color:'rgb(234,30,44)',fontSize:'1.2em',position:'absolute',top: '-11px',left:'19px'}}>{itemsCount}</span>
                                  </div>
                              </Toolbar>
                            </AppBar>

                          <Grid container spacing={1}  sx={{ height:"80%",padding:"15px" }}>

                            {
                              filterItmGrp.filter(p=>p.id===itemGrpId).map((item) =>{
                               return item.items.elements.filter(p=>p.available).map((product)=>{
                                return (
                                <>
                                <Slide key={product.name} direction="up" in={true}>
                                  <Grid item xl={2} lg={3} md={3} sm={12} xs={12}>
                                    <Card
                                      className={styles.card}
                                      onClick={() => productClickHandler(product)}
                                    >
                                      <CardActionArea>
                                        <CardMedia
                                          component="img"
                                          alt={product.name}
                                          onError={imageOnErrorHandler}
                                          image={`${baseURL}/` + product.image}
                                          className={styles.media}
                                        />
                                        <div style={{ backgroundColor: "white",  width: "auto", position: "absolute", bottom: "14px", right: "2px", padding: "5px",fontSize:'1.2em' }}>
                                          <h3 style={{ margin: "0px" }}>{selectedCurrency}{(product.price/100).toFixed(2)}</h3>
                                        </div>
              
                                        <div className={styles.veg_img} >
                                          {/* {product.cat_type.toUpperCase() === "VEG" ?
                                            <img
                                              src="/images/veg.png"
                                              width="30px" height="30px"
                                            />
                                            : <img src="/images/Non-veg.png" width="30px" height="30px" />
              
                                          } */}
              
                                        </div>
                                        <CardContent className={styles.cardFooter}>
                                          <Box className={styles.foot}>
                                            <Typography
                                              gutterBottom
                                              className={styles.prod_title}
                                              variant="h6"
                                              color="primary"
                                              component="p"
                                              style={{width:"150px"}}
                                            >
                                              {product.name}
                                            </Typography>

                                            <Typography
                                              gutterBottom
                                              variant="p"
                                              color=""
                                              component="p"
                                            >
                                                {product.calories}cal
                                            </Typography>
                                          </Box >
                                        </CardContent>
                                      </CardActionArea>
                                    </Card>
                                  </Grid>
                                </Slide>
                                </>)})
                                 })
                            }

                          </Grid>
                            <Box style={{display:"flex",justifyContent:"space-between",alignItems:"center",position: "fixed",bottom:"0px",width: "95%",padding:"28px"}} > 
                              <Button
                              variant="contained"
                              onClick={()=>setItemGrpId("")}
                              color="error"
                              className={styles.largeButton}
                              id='choose_clbtn'
                              >Back</Button>

                              <Button
                              variant="contained"
                              onClick={()=>setItemGrpId("")}
                              className={styles.largeButton}
                              color="primary"
                              id='nextbtn'
                              >Next</Button>
                            </Box>
                      </Dialog>
              </>
                )
            })
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
style
      <Box  style={{display:'none!important',position:"fixed",bottom:"0px",width:"96%"}} className='orderscreen_foot'  >
        <Box>
          <Box className={[styles.bordered, styles.space]} style={{ textAlign: 'center', fontSize: '20px', lineHeight: "20px",display:'none' }}>
           { /*My Order - {orderType} |*/} Tax: {selectedCurrency}{taxPrice} | Total: {selectedCurrency}{totalPrice} |
            Items: {itemsCount}
          </Box>
          <Box  id='footer' style={{display:'none!important'}} className={[styles.row, styles.around, styles.space]}>
            <Button
              onClick={() => {
                clearOrder(dispatch);
                // props.history.push('/choose?' + window.location.href.split('?')[1]);
              }}
              variant="outlined"
             style={{display:'none!important'}}
              className={styles.largeButton}
              id='choose_clbtn'
            >
              Remove  
            </Button>

            <Button
              onClick={previewOrderHandler}
              variant="contained"
              color="primary"
              style={{display:'none!important'}}
              disabled={orderItems.length === 0}
              className={styles.largeButton}
              id='nextbtn'
            >
              NEXT
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
