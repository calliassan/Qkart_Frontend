import { Search } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./ProductCard.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const isLoggedIn = Boolean(localStorage.getItem("userdata"));
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${config.endpoint}/api/v1/products`);
      setProducts(response.data);
    } catch {
      enqueueSnackbar("Failed to fetch products", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await axios.get(`${config.endpoint}/api/v1/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(generateCartItemsFrom(response.data, products));
    } catch {
      enqueueSnackbar("Error while fetching cart", { variant: "error" });
    }
  }, [enqueueSnackbar, isLoggedIn, products, token]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      try {
        const url =
          value.trim() === ""
            ? `${config.endpoint}/api/v1/products`
            : `${config.endpoint}/api/v1/products/search?value=${value}`;
        const response = await axios.get(url);
        setProducts(response.data);
      } catch {
        enqueueSnackbar("Search failed", { variant: "error" });
      }
    }, 500);

    setDebounceTimer(timer);
  };

  const isItemInCart = (productId) =>
    cartItems.some((item) => item.productId === productId);

  const addToCart = async (productId, qty) => {
    if (!isLoggedIn) {
      enqueueSnackbar("Login to add item to the cart", { variant: "warning" });
      return;
    }

    const isAddButton = qty === undefined;

    if (isAddButton && isItemInCart(productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }

    if (isAddButton) qty = 1;
    if (qty < 0) return;

    try {
      const response = await axios.post(
        `${config.endpoint}/api/v1/cart`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(generateCartItemsFrom(response.data, products));
    } catch {
      enqueueSnackbar("Failed to update cart", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length) fetchCart();
  }, [products, fetchCart]);

  return (
    <>
      <Header />

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        placeholder="Search for items/categories"
        value={searchText}
        onChange={handleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={isLoggedIn ? 9 : 12}>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} handleAddToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {isLoggedIn && (
          <Grid item xs={12} md={3}>
            <Cart items={cartItems} handleQuantity={addToCart} />
          </Grid>
        )}
      </Grid>

      <Footer />
    </>
  );
};

export default Products;
