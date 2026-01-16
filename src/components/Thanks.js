import { Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Thanks = () => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Box
        minHeight="70vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" gutterBottom>
          🎉 Order Placed Successfully!
        </Typography>
        <Typography gutterBottom>Thank you for shopping with QKart.</Typography>
        <Button variant="contained" onClick={() => history.push("/products")}>
          Continue Shopping
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Thanks;
