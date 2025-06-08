import React,{useContext} from "react";
import { useStyles } from '../styles';
import { Store } from '../Store';
import axios from "axios";
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
    ImageList,
    ImageListItem,
    ImageListItemBar,
    List,
    ListItem,
    Slide,
    TextField,
    Typography,
  } from '@material-ui/core';

  function AddMoreScreen(props){
    const styles = useStyles();
    const { state, dispatch } = useContext(Store);

    return(
        <Box className={styles.root} style={{backgroundColor: state.selectedBgColor}}>
            <h1>ADD-More items</h1>
        </Box>
    )
}

export default AddMoreScreen;