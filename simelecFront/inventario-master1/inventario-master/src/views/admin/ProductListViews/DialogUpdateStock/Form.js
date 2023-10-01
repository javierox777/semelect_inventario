import clsx from "clsx";
import React, { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { UploadSingleFile } from "src/components/Upload";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { Form, FormikProvider, useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import eyeFill from "@iconify-icons/eva/eye-fill";
import eyeOffFill from "@iconify-icons/eva/eye-off-fill";
import { Icon } from "@iconify/react";
import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { MButton } from "src/theme";
import { productError } from "src/utils/helpError";

// ----------------------------------------------------------------------

import { updateStockProduct } from "src/redux/slices/product";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  handleCloseCallback: PropTypes.func,
  product: PropTypes.object,
};

function General({ className, handleCloseCallback, product }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const UpdateUserSchema = Yup.object().shape({
    stock: Yup.number()
      .required("Este campo es obligatorio")
      .positive("Debe ser un número mayor a 0")
      .integer("Debe ser un número entero"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stock: product.stock,
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log(values);
      values._id = product._id;
      const response = await dispatch(updateStockProduct(values));

      if (!response) {
        handleCloseCallback();
        enqueueSnackbar("Se guardó correctamente", { variant: "success" });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } else {
        if (
          response.body === "product/sku-already-in-use" ||
          response.body === "product/name-already-in-use"
        ) {
          if (isMountedRef.current) {
            setSubmitting(false);
            setErrors({ afterSubmit: response.body });
          }
        } else {
          enqueueSnackbar("Algo sucedió", { variant: "warning" });
          if (isMountedRef.current) {
            setErrors({ afterSubmit: response.message });
            setSubmitting(false);
          }
        }
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Stock"
                    {...getFieldProps("stock")}
                    error={Boolean(touched.stock && errors.stock)}
                    helperText={touched.stock && errors.stock}
                  />
                </Grid>

              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <MButton
                  sx={{ mr: 1 }}
                  color="inherit"
                  type="button"
                  onClick={handleCloseCallback}
                >
                  Cancelar
                </MButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  pending={isSubmitting}
                >
                  Guardar
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default General;
