import { CreditCard } from "@mui/icons-material";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { generateCartItemsFrom, getTotalCartValue } from "./Cart";
import Footer from "./Footer";
import Header from "./Header";

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsRes = await axios.get(
          `${config.endpoint}/api/v1/products`
        );
        const cartRes = await axios.get(`${config.endpoint}/api/v1/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(generateCartItemsFrom(cartRes.data, productsRes.data));
      } catch {
        enqueueSnackbar("Failed to load checkout data", { variant: "error" });
      }
    };
    loadData();
  }, [enqueueSnackbar, token]);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box p={3}>
            <Typography variant="h4">Payment</Typography>
            <Divider />
            <Typography my={2}>Pay ${getTotalCartValue(items)}</Typography>
            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => history.push("/thanks")}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart items={items} readonly />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
