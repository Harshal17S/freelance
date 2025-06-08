import React from 'react';
import { useStyles } from '../styles';
import Slider from "react-slick";
export default function Categories(props) {
  const styles = useStyles();
  console.log(props.pgSets);
  return (
     <Slider>
        <div className={styles.categoryContainer} >
          {props.categories &&
            props.categories.filter(cat=> cat.isOrderableAlone || !cat.isAddOn).map((cat) => (
              <div
                className={styles.categoryItem}
                style={{borderColor:props.selectedCat.id == cat.id?props.pgSets.themeColor:"#000"}}
                onClick={() =>
                  props.categoryClickHandler(cat)
                }
              >
                <div className={styles.imageHolder} style={{width:'auto',backgroundColor:"transparent"}} >
                  <img
                    className={styles.image +" "+ 'cat-img'}
                    alt={cat.name}
                    onError={props.imageOnErrorHandler}
                    src={cat.image}
                    style={{border:"2px solid #ccc"}}
                  />
                </div>
                <div className='cat-name'>{cat.name}</div>
              </div>
            ))}
        </div>
      </Slider>
  );
}
