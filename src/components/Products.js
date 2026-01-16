import { Search } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
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

  const isloggedin = Boolean(localStorage.getItem("userdata"));
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/api/v1/products`);
      setProducts(response.data);
    } catch {
      enqueueSnackbar("Failed to fetch products", { variant: "error" });
    }
  };

  const fetchSearchedProducts = async (query) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/api/v1/products/search?value=${query}`
      );
      setProducts(response.data);
    } catch (error) {
      if (error.response?.status === 404) setProducts([]);
      else enqueueSnackbar("Search failed", { variant: "error" });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      value.trim() === "" ? fetchProducts() : fetchSearchedProducts(value);
    }, 500);

    setDebounceTimer(timer);
  };
  const fetchCart = async () => {
    const url = `${config.endpoint}/api/v1/cart`;
    try {
      const response = await axios(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const mergeddata = generateCartItemsFrom(response.data, products);

      setCartItems(mergeddata);
    } catch (error) {
      enqueueSnackbar("Error while fetching", { variant: "error" });
    }
  };

  //check if item is in cart
  const isIteminCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };
  const addtoCart = async (productId, qty) => {
    if (!isloggedin) {
      enqueueSnackbar("Login to add item to the cart", {
        variant: "warning",
      });
      return;
    }

    const isAddButtonClick = qty === undefined;

    // ✅ ONLY block duplicates for ADD button
    if (isAddButtonClick) {
      if (isIteminCart(productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning", preventDuplicate: true }
        );
        return;
      }
      qty = 1;
    }

    // ✅ allow qty = 0 (remove item), block negatives
    if (qty < 0) return;

    try {
      const response = await axios.post(
        `${config.endpoint}/api/v1/cart`,
        { productId, qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mergeditems = generateCartItemsFrom(response.data, products);
      setCartItems(mergeditems);
    } catch {
      enqueueSnackbar("Failed to update cart", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (products.length && isloggedin) {
      fetchCart();
    }
  }, [products]);

  return (
    <div>
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

      {/* MAIN LAYOUT */}
      <Grid container spacing={2}>
        {/* PRODUCTS */}
        <Grid item xs={12} md={isloggedin ? 9 : 12}>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} handleAddToCart={addtoCart} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* CART */}
        {isloggedin && (
          <Grid item xs={12} md={3}>
            <Cart
              products={products}
              items={cartItems}
              handleQuantity={addtoCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
