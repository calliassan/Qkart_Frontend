import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Box, Button, IconButton, Stack } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import "./cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData || !productsData) return [];
  return cartData
    .map((item) => {
      const product = productsData.find((p) => p._id === item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        qty: item.qty,
        name: product.name,
        cost: product.cost,
        image: product.image,
      };
    })
    .filter(Boolean);
};

export const getTotalCartValue = (items = []) =>
  items.reduce((sum, item) => sum + item.cost * item.qty, 0);

export const getTotalItems = (items = []) =>
  items.reduce((sum, item) => sum + item.qty, 0);

const ItemQuantity = ({ value, onAdd, onRemove, readonly }) =>
  readonly ? (
    <Box>Qty: {value}</Box>
  ) : (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={onRemove}>
        <RemoveOutlined />
      </IconButton>
      <Box px={1}>{value}</Box>
      <IconButton size="small" onClick={onAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );

const Cart = ({ items = [], handleQuantity, readonly = false }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined />
        <Box>Cart is empty</Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <Box key={item.productId} display="flex" p={1}>
          <img src={item.image} alt={item.name} width="80" />
          <Box px={1} flexGrow={1}>
            <div>{item.name}</div>
            <ItemQuantity
              value={item.qty}
              readonly={readonly}
              onAdd={() => handleQuantity(item.productId, item.qty + 1)}
              onRemove={() => handleQuantity(item.productId, item.qty - 1)}
            />
          </Box>
          <Box fontWeight="700">${item.cost}</Box>
        </Box>
      ))}

      <Box p={1} fontWeight="700">
        Order Total: ${getTotalCartValue(items)}
      </Box>

      {!readonly && (
        <Button
          fullWidth
          variant="contained"
          onClick={() => history.push("/checkout")}
        >
          Checkout
        </Button>
      )}
    </Box>
  );
};

export default Cart;
