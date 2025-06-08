import React, { useContext } from 'react';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade,

  Typography,
} from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import { Store } from '../Store';
import { setOrderType } from '../actions';

export default function HomeScreen(props) {
  const { state, dispatch } = useContext(Store);
  const styles = useStyles();

    let {setting} = state.userSetting;
    console.log(setting);

    if(setting){
     setTimeout(() => {
      let textcolor = document.getElementById("title1");
      textcolor.style.color = setting.color_primary;
    }, 10);

   }

  
  const chooseHandler = (orderType) => {
    setOrderType(dispatch, orderType);
    props.history.push('/order?' + window.location.href.split('?')[1]);
  };

  
  return (

    <>
      <Fade in={true}>
        <Box className={[styles.root, styles.navy]} style={{ backgroundColor: state.selectedBgColor }} >
          <Box className={[styles.main, styles.center]}>
            {/* <img src={state.selectedLogo} height='90px' width='120px' /> */}
            <Typography
              className={[styles.center, styles.title3]}
              gutterBottom
              variant="h3"
              component="h3"
              id="title1"
            >
              Where will you be eating today?
            </Typography>
            <Box className={styles.cards} id='choose_cards'>
              <Card className={[styles.card, styles.space]} style={{ backgroundColor: "white !important" }}>
                <CardActionArea className='eat_in' onClick={() => chooseHandler('Eat in')}>
                  <CardMedia
                    component="img"
                    alt="Eat in"
                    image="/images/eatin.png"
                    className={styles.media}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h4"
                      color="textPrimary"
                      component="p"

                    >
                      Eat In
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card className={[styles.card, styles.space]}>
                <CardActionArea className='take_out' onClick={() => chooseHandler('Take out')}>
                  <CardMedia
                    component="img"
                    alt="Take Out"
                    image="/images/takeout.png"
                    className={styles.media}
                  />
                  <CardContent className='takeOut'>
                    <Typography
                      gutterBottom
                      variant="h4"
                      color="textPrimary"
                      component="p"
                      className='para'
                    >
                      Take Out
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
          <button onClick={() => {
            props.history.push(`/?` + window.location.href.split('?')[1]);
          }} className='btn btn-dark mx-5 mb-4'id='back_btn' style={{ width: "150px", textAlign: "center",height:"50px" }}>
            CANCEL
          </button>
        </Box>

      </Fade>
    </>

  );
}

{/* <button onClick={() => {
  props.history.push(`/?` + window.location.href.split('?')[1]);
}} className='btn btn-dark ms-4 mb-4' style={{width:"80px",textAlign:"center"}}>
  BACK
</button> */}