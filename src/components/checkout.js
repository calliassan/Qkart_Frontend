import { CreditCard, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
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

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });

  const fetchProducts = async () => {
    const res = await axios.get(`${config.endpoint}/api/v1/products`);
    setProducts(res.data);
    return res.data;
  };

  const fetchCart = async () => {
    const res = await axios.get(`${config.endpoint}/api/v1/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  const fetchAddresses = async () => {
    const res = await axios.get(`${config.endpoint}/api/v1/user/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses({ all: res.data, selected: "" });
  };

  const validateRequest = () => {
    const balance = Number(localStorage.getItem("balance"));
    if (getTotalCartValue(items) > balance) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }
    if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }
    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateRequest()) return;
    try {
      await axios.post(
        `${config.endpoint}/api/v1/cart/checkout`,
        { addressId: addresses.selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar("Order placed successfully", {
        variant: "success",
      });
      history.push("/thanks");
    } catch {
      enqueueSnackbar("Checkout failed", { variant: "error" });
    }
  };

  useEffect(() => {
    if (!token) {
      history.push("/");
      return;
    }
    (async () => {
      const productsData = await fetchProducts();
      const cartData = await fetchCart();
      setItems(generateCartItemsFrom(cartData, productsData));
      fetchAddresses();
    })();
  }, []);

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9} p={2}>
          <Typography variant="h4">Shipping</Typography>
          <Divider />
          {addresses.all.map((addr) => (
            <Box
              key={addr._id}
              onClick={() => setAddresses({ ...addresses, selected: addr._id })}
            >
              <Typography>{addr.address}</Typography>
            </Box>
          ))}

          <Divider />
          <Typography>Payment</Typography>
          <Typography>Pay ${getTotalCartValue(items)} from wallet</Typography>

          <Button
            startIcon={<CreditCard />}
            variant="contained"
            onClick={placeOrder}
          >
            PLACE ORDER
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Cart items={items} readonly />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
