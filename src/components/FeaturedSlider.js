import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import Axios from 'axios';
import {merchantCode} from '../util';

function FeaturedSlider(props) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true
  };
 console.log('---------------------', props.promos);


  return (
    <div className="slider-container">
      <Slider {...settings}>
     
       {props.promos.map(promo => 
        <div style={{padding:"10px"}}><img src={promo.url} style={{width:"100%",borderRadius:"30px",padding:"10px", maxHeight:"300px"}}/></div>
       )
        }
    
      </Slider>
    </div>
  );
}


export default FeaturedSlider;
