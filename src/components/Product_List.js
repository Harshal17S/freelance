import React from 'react';
import { useStyles } from '../styles';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import CurrencySymbol from './CurrencySymbol';

export default function ProductList(props) {
  const styles = useStyles();
  let selCatId= props.selectedCat.id;
  console.log(props.categories)
  let adOnCats =[];
  props.categories.filter(cat=> cat.isAddOn && adOnCats.push(cat.id));
  console.log(adOnCats);
  return (
        <Grid container spacing={1} id="pro_continer" style={{ overflow: 'visible', height: 'auto' }}>
        { props.items?.filter(pro=> (
          (!props.selectedCat && adOnCats.indexOf(pro.category) == -1) 
          || 
          (pro.category== selCatId))&& pro.inStock).map( it => {
         return ( <Grid item key={it.id}>
                          <Card
                            className={styles.card}
                            onClick={() => props.productClickHandler(it)}
                            style={{ width: "150px",padding:"5px" }}
                          >
                              <CardMedia
                                component="img"
                                image={it.image}
                                className={styles.media}
                                onError={props.imageOnErrorHandler}
                              />

                              {false && it["cat_type"] ?
                                <div className={styles.veg_img}>
                                    <img
                                      src={it.cat_type.toUpperCase() === "VEG"?"/images/veg.png":"/images/Non-veg.png"}
                                      width="30px"
                                      height="30px"
                                    />
                                </div> : " "
                              }

                              <CardContent className={styles.cardFooter}>
                                <Box className={styles.foot}>
                                  <Typography
                                    gutterBottom
                                    className={styles.prod_title}
                                    variant="h6"
                                    component="p"
                                  >
                                    {it.name}
                                  </Typography>
                                    <div className="pro_price">
                                      <h3 style={{ margin: "0px" }}>
                                        <CurrencySymbol/>{it.price?it.price:'?'}
                                      </h3>
                                    </div>
                                   
                                </Box>
                              </CardContent>
                          </Card>
                          </Grid>
                        )})}
          
        </Grid>
  );
}
