import { Button, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import Register from "./Register.js";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setformdata] = useState({
    username: "",
    password: "",
  });
  const History = useHistory();
  const handlechange = (e) =>
    setformdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const handleslogin = (e) => {
    e.preventDefault();
    // setformdata({ username: formData.username, password: formData.password });
    login(formData);
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    const url = `${config.endpoint}/api/v1/auth/login`;
    if (!validateInput(formData)) {
      return;
    }
    try {
      const response = await axios.post(
        url,
        { username: formData.username, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        enqueueSnackbar("Login successful", { variant: "success" });
      }
      console.log(response);
      persistLogin(
        response.data.token,
        response.data.username,
        response.data.balance
      );

      History.push("/products");
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "warning" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "warning" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    const { username, password } = data;
    if (!username) {
      enqueueSnackbar("Username is missing", { variant: "warning" });
      return false;
    }
    if (!password) {
      enqueueSnackbar("password is required");
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userdata", JSON.stringify({ username, balance }));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <h1>Login</h1>
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handlechange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handlechange}
          />
          <Button onClick={handleslogin}>Login to Qkart"</Button>
          <p>
            dont have an account?<Link to="/register">Register Now</Link>
          </p>
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;
