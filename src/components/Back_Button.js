import React from 'react';
//import { useStyles } from '../styles';

export default function BackButton(props) {
 // const styles = useStyles();
  return (
    <div
        style={{
          height: "50px",
          width:'50px',
          position:'absolute',
          zIndex:9999
        }}
      >
        <span
          onClick={() => props.handleClick()}
        >
          <img
            src="images/back-btn.png"
            alt="back"
            style={{ width: "35px", height: "35px", margin: "5px" }}
          />
        </span>
        
      </div>

  );
}
