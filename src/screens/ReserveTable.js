import React, { useState} from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import config, { merchantCode } from "../util";
import axios from "axios"; // Import Axios for making HTTP requests

export default function ReserveTable() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    meal: "",
    timing: "",
    guests: "",
    phoneNumber: "",
  });

  const baseURL = config.baseURL;
  //const merchCode="E2S018YLOT";

  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  
  const userId = userData ? userData.sub : " ";
  
  const [tableData, setTableData] = useState(null);
  const [tableId, setTableId] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // const getTabByUser = `${baseURL}/api/tables?merchantCode=${merchCode}`;
  // console.log(getTabByUser);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update reservationDtl with form data
    setFormData({ ...formData, reservationDtl: { ...formData } });

    // Send booking data to API
    axios
    .post(`${baseURL}/api/tables?merchantCode=${merchCode}`, {
    
        reservationDtl: formData.reservationDtl,
        
      })
      .then((response) => {
        const updatedTableData = response.data; // Replace with your actual response structure
        setTableData(updatedTableData);

        console.log("Booking successful!");
      })
      .catch((error) => {
        // Handle API errors
      });
    console.log(formData); // You can handle form submission logic here
  };

  console.log(tableData);

  return (
    <>
      <h1 className="mainHeading"> Reserve Table</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phonenumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Meal</InputLabel>
          <Select
            label="Meal"
            name="meal"
            value={formData.meal}
            onChange={handleChange}
          >
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Timing"
          name="timing"
          type="time"
          value={formData.timing}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Guests"
          name="guests"
          type="number"
          value={formData.guests}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" type="submit" color="primary">
          Reserve Table
        </Button>
      </form>
    </>
  );
}
