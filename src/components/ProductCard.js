import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt={product.name}
        height={140}
        image={product.image}
      ></CardMedia>
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography>{product.cost}</Typography>
        <Typography>{<Rating value={product.rating} />}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleAddToCart(product._id)}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};
export default ProductCard;
