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
} from "src/redux/slices/invoice";
import { getProductWithStockList } from 'src/redux/slices/product';
import { getClientList } from 'src/redux/slices/client';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Box, Container, StepConnector } from "@material-ui/core";

// ----------------------------------------------------------------------

import Cart from "./Cart";
import AutocompleteProducts from "./AutocompleteProducts";
import AutocompleteClients from "./AutocompleteClients";

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
  const { checkout } = useSelector((state) => state.invoice);
  const { cart, total, subtotal, client } = checkout;

  useEffect(() => {
    dispatch(getProductWithStockList());
    dispatch(getClientList());
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
    <Page title="Nuevo presupuesto | Control de inventario" className={classes.root}>
      <Container>
        <AutocompleteClients />
        <AutocompleteProducts />
        <Cart
          cart={cart}
          total={total}
          client={client}
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
