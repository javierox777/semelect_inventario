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
import { removeSale } from "src/redux/slices/product";
import { MButton } from "src/theme";
import { passwordError } from "src/utils/helpError";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  handleCloseCallback: PropTypes.func,
  sale: PropTypes.object,
};

function General({ className, handleCloseCallback, sale }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    password: Yup.string().required("Este campo es obligatorio"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      const response = await dispatch(removeSale(values, sale));
      if (!response) {
        handleCloseCallback();
        enqueueSnackbar("Se eliminó correctamente", { variant: "success" });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } else {
        if (response.body === "auth/wrong-password") {
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
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    {...getFieldProps("password")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      Boolean(touched.password && errors.password) ||
                      passwordError(errors.afterSubmit).error
                    }
                    helperText={
                      (touched.password && errors.password) ||
                      passwordError(errors.afterSubmit).helperText
                    }
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
                  Eliminar
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
