import clsx from 'clsx';
import React from 'react';
import { sum } from 'lodash';
import Summary from './Summary';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import ProductList from './ProductList';
import Scrollbars from 'src/components/Scrollbars';
import EmptyContent from 'src/components/EmptyContent';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify-icons/eva/arrow-ios-back-fill';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from "notistack";
import {
  Box,
  Grid,
  Card,
  Button,
  CardHeader,
  Typography
} from '@material-ui/core';
import { resetCart, addInvoice } from 'src/redux/slices/invoice';
import { useDispatch, useSelector } from 'react-redux';
import { PATH_HOME } from "src/routes/paths";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

Cart.propTypes = {
  cart: PropTypes.array,
  client: PropTypes.object,
  total: PropTypes.number,
  subtotal: PropTypes.number,
  onDelete: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  className: PropTypes.string
};

function Cart({
  cart,
  client,
  total,
  subtotal,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
  className
}) {
  const classes = useStyles();
  const isEmptyCart = cart.length === 0;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const { user } = useSelector((state) => state.authJwt);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart, client: client },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      if(!values.client) {
        enqueueSnackbar("Seleccione un cliente", { variant: "warning" });
        setSubmitting(false);
      } else {
        values.seller = user._id;
        const response = await dispatch(addInvoice(values));
        if(response) {
          enqueueSnackbar("Sucedió algo, genere la venta nuevamente", { variant: "warning" });
          setErrors(response.body);
          setSubmitting(false);
        } else {
          setSubmitting(true);
          // dispatch(resetCart());
          history.push(PATH_HOME.invoiceview);
          enqueueSnackbar("Venta generada correctamente", { variant: "success" });
        }
      }
    }
  });

  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardHeader
                  title={
                    <Typography variant="h6">
                      Total
                      <Typography
                        component="span"
                        sx={{ color: 'text.secondary' }}
                      >
                        &nbsp;({totalItems} items)
                      </Typography>
                    </Typography>
                  }
                />

                {!isEmptyCart ? (
                  <Scrollbars>
                    <ProductList
                      formik={formik}
                      onDelete={onDelete}
                      onIncreaseQuantity={onIncreaseQuantity}
                      onDecreaseQuantity={onDecreaseQuantity}
                    />
                  </Scrollbars>
                ) : (
                  <EmptyContent
                    title="No hay ningún producto aún"
                    description="Seleccione los productos que desea agregar a esta venta"
                    img="/static/illustrations/illustration_empty_cart.svg"
                  />
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Summary
                total={total}
                subtotal={subtotal}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={values.products.length === 0}
              >
                Finalizar
              </Button>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default Cart;
