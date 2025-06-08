import React from 'react';
import { useStyles } from '../styles';
import Slider from "react-slick";
export default function Categories(props) {
  const styles = useStyles();
    const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      }
    ]
  };
  return (
     <Slider {...settings} style={{height:"95px",marginLeft:"10px",marginBottom:"10px"}}>
      
          {props.catPros &&
            Object.keys(props.catPros).map((cat) => (
              <div
                className={styles.categoryItem}
                style={{display:"flex",flexDirection:"column",justifyContent:"center"}}
                onClick={() =>
                  props.categoryClickHandler(cat)
                }
              >

                <div className={styles.imageHolder} >
                  <img
                    style={{border:`2px solid ${props.selectedCat == cat?"#cda731":"transparent"}`}}
                    className={styles.image +" "+ 'cat-img'}
                    alt={cat.name}
                    onError={props.imageOnErrorHandler}
                    src={`https://cloverstatic.com/menu-assets/items/${props.catPros[cat]._id}.jpeg`}
                  />
                </div>
                <div className='cat-name' style={{color:`${props.selectedCat == cat?"#cda731":"#000"}`,display:"flex",justifyContent:"center"}}>{props.catPros[cat].name}</div>
              </div>
            ))}
      </Slider>
  );
}
