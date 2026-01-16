import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const isloggedin = Boolean(localStorage.getItem("userdata"));
  const handleregister = () => {
    history.push("/register");
  };
  const handlelogin = () => {
    history.push("/login");
  };
  const handlelogout = () => {
    localStorage.clear();
    history.push("/products");
  };
  const handleexplore = () => {
    history.push("/products");
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={handleexplore}
      >
        Back to explore
      </Button>
      {!isloggedin && !hasHiddenAuthButtons && (
        <>
          <Button onClick={handleregister}>Register</Button>
          <Button onClick={handlelogin}>Login</Button>
        </>
      )}
      {isloggedin && <Button onClick={handlelogout}>Logout</Button>}
      {children}
    </Box>
  );
};

export default Header;
