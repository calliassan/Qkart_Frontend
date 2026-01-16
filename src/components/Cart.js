import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "./cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];
  return cartData
    .map((item) => {
      const product = productsData.find((p) => p._id === item.productId);
      return product
        ? {
            productId: item.productId,
            name: product.name,
            image: product.image,
            cost: product.cost,
            qty: item.qty,
          }
        : null;
    })
    .filter(Boolean);
};

export const getTotalCartValue = (items = []) =>
  items.reduce((sum, item) => sum + item.cost * item.qty, 0);

const ItemQuantity = ({ value, handleAdd, handleDelete, readonly }) => {
  if (readonly) return <Box>Qty: {value}</Box>;
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box px={1}>{value}</Box>
      <IconButton size="small" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const Cart = ({ items = [], handleQuantity, readonly = false }) => {
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <Box key={item.productId} display="flex" p={2}>
          <Box className="image-container">
            <img src={item.image} alt={item.name} width="100%" />
          </Box>

          <Box flexGrow={1} px={2}>
            <div>{item.name}</div>
            <Box display="flex" justifyContent="space-between">
              <ItemQuantity
                value={item.qty}
                readonly={readonly}
                handleAdd={() => handleQuantity(item.productId, item.qty + 1)}
                handleDelete={() =>
                  handleQuantity(item.productId, item.qty - 1)
                }
              />
              <Box fontWeight={700}>${item.cost}</Box>
            </Box>
          </Box>
        </Box>
      ))}

      <Box p={2} display="flex" justifyContent="space-between">
        <Box>Order total</Box>
        <Box fontWeight={700} data-testid="cart-total">
          ${getTotalCartValue(items)}
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
