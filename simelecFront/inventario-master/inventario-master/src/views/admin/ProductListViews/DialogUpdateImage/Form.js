import clsx from "clsx";
import React, { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import useAuth from "src/hooks/useAuth";
import { UploadSingleFile } from "src/components/Upload";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { Form, FormikProvider, useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { MButton } from "src/theme";
import LazySize from "src/components/LazySize";
import { generalConfig } from "src/config";

// ----------------------------------------------------------------------

import { updateImageProduct } from "src/redux/slices/product";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object,
  handleCloseCallback: PropTypes.func,
};

function General({ className, product, handleCloseCallback }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const UpdateUserSchema = Yup.object().shape({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      if (!file) {
        enqueueSnackbar("Selecciona una imágen", { variant: "warning" });
      } else {
        const formdata = new FormData();
        formdata.append("image", file.file);
        const response = await dispatch(updateImageProduct(product._id, formdata));
        if (!response) {
          handleCloseCallback();
          enqueueSnackbar("Se actualizó correctamente", { variant: "success" });
          if (isMountedRef.current) {
            setSubmitting(false);
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
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1 }}>Imagen actual</Typography>
                  <LazySize
                    alt="imagen de producto"
                    src={generalConfig.baseUrl + product.path}
                    sx={{
                      maxWidth: "100%",
                      height: 'auto',
                      borderRadius: 1.5,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ mb: 1 }}>Imagen nueva</Typography>
                  <UploadSingleFile value={file} onChange={setFile} />
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
