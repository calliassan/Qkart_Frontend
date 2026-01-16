import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Products from "./components/Products";
import Thanks from "./components/Thanks";
import Checkout from "./components/checkout";

export const config = {
  endpoint: ipConfig.endpoint,
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/thanks">
          <Thanks />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
