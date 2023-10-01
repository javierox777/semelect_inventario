import Cart from "./Cart";
import { Icon } from "@iconify/react";
import Page from "src/components/Page";
import React, { useEffect } from "react";
import { PATH_HOME } from "src/routes/paths";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import checkmarkFill from "@iconify-icons/eva/checkmark-fill";
import {
  getCart,
  resetCart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
  getProductWithStockList
} from "src/redux/slices/product";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box, Container, StepConnector } from "@material-ui/core";

// ----------------------------------------------------------------------

import AutocompleteProducts from "./AutocompleteProducts";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
}));

// ----------------------------------------------------------------------

function Checkout() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.product);
  const { cart, total, subtotal } = checkout;

  useEffect(() => {
    dispatch(getProductWithStockList());
  }, [dispatch]);

  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
    }
    return () => {
      dispatch(resetCart());
    }
  }, [dispatch, isMountedRef, cart]);

  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  return (
    <Page title="Nueva venta | Control de inventario" className={classes.root}>
      <Container>
        <AutocompleteProducts />
        <Cart
          cart={cart}
          total={total}
          subtotal={subtotal}
          onDelete={handleDeleteCart}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
        />
      </Container>
    </Page>
  );
}

export default Checkout;
