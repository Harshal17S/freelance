import React, { useContext, useState } from 'react';
import { Store } from '../Store';

import { Box, Card, CardActionArea, Typography } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { useStyles } from '../styles';
import QRCode from "react-qr-code";
import Logo from '../components/Logo';

export default function HomeScreen(props) {
  const { state } = useContext(Store);
console.log(state);
let {userInfo}= state.userData;
  let {loading,setting,error} = state.userSetting;
  console.log(setting);
   if(setting){
     let body = document.getElementsByTagName("body");
    body[0].style.backgroundColor = setting.color_tirnary;

    setTimeout(() => {
            let reName=document.getElementById("name");
            let textcolor = document.getElementById("title");
            textcolor.style.color = setting.color_primary;
            reName.style.color = setting.color_primary;
          }, 10);

   }

 

  const getParameterByName = (e, t = window.location.href) => {
    e = e.replace(/[\[\]]/g, "\\$&"); var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
    return n ? n[2] ? decodeURIComponent(n[2].replace(/\+/g, " ")) : "" : null
  }

  const isScan = getParameterByName("isScan");
  const restName = getParameterByName("upiName");

  
  const styles = useStyles();
  return (
    <Card >
      <CardActionArea onClick={() => props.history.push('/choose?' + window.location.href.split('?')[1])}>
        <Box className={[styles.root, styles.red]} >

          <Box className={[styles.main, styles.center]}>
           <Typography id="name" style={{fontSize:"25px"}} >
              {userInfo?userInfo.customer:""}
            </Typography>
            <Typography className={[styles.bold, styles.title3]} variant="h1" component="h1" id='title'

            >
              WELCOME! <br />
            </Typography><br /><br />

            <Box className='choose_card' style={{ display: "flex", justifyContent: "space-around", width: "100%", alignItems: "center" }}>
              <div style={{ color: "rgb(126, 43, 43)", width: "200px", height: "200px", fontSize: "25px", fontWeight: "bolder", backgroundColor: "white", padding: "10px", boxShadow: "0px 0px 7px black", borderRadius: "10px" }}>
                Touch To Order<br />
                <TouchAppIcon style={{ fontSize: "120px", color: "#465c46" }} ></TouchAppIcon>
              </div>
              <div className='order_qrcode' style={{ backgroundColor: "white", padding: "10px", height: "200px", width: "200px", boxShadow: "0px 0px 7px black", borderRadius: "10px" }}>
                <h4 style={{ color: "#7e2b2b" }}>Order From Mobile</h4>
                <QRCode
                  size={456}
                  style={{ height: "100px", maxWidth: "100px", width: "100px", marginBottom: "50px" }}
                  value={window.location.href.replace("isScan=false","isScan=true")}
                  viewBox={`0 0 456 456`}
                />
              </div>
            </Box>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}

{/* <Box className={[styles.main, styles.center]}>

<Typography className={[styles.bold, styles.title3]} variant="h1" component="h1" id='title'
 }
>
  WELCOME! <br />
  ORDER <br />HERE <br/>

  <TouchAppIcon fontSize="large" ></TouchAppIcon>
</Typography><br /><br />

</Box>
<Box className={styles.center}>
<div>
  <h4 style={{color:"#7e2b2b"}}>Order From Mobile</h4>
  <QRCode
    size={456}
    style={{ height: "100px", maxWidth: "60%", width: "60%" ,marginBottom:"50px" }}
    value={window.location.href}
    viewBox={`0 0 456 456`}
  />
</div>
</Box> */}