import clsx from "clsx";
import React, { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { Form, FormikProvider, useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import eyeFill from "@iconify-icons/eva/eye-fill";
import eyeOffFill from "@iconify-icons/eva/eye-off-fill";
import { Icon } from "@iconify/react";
import {
  Box,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import { updateSeller } from "src/redux/slices/seller";
import { MButton } from "src/theme";
import { emailError } from "src/utils/helpError";
import { validate } from 'rut.js';
import { ConstructionOutlined } from "@material-ui/icons";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  handleCloseCallback: PropTypes.func,
  seller: PropTypes.object,
};

function General({ className, handleCloseCallback, seller }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required("Este campo es obligatorio"),
    lastname: Yup.string().required("Este campo es obligatorio"),
    email: Yup.string()
      .email("Correo no válido")
      .required("Este campo es obligatorio"),
    rut: Yup.string().required("Este campo es obligatorio"),
    phone: Yup.string().required("Este campo es obligatorio"),
    address: Yup.string().required("Este campo es obligatorio"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: seller.name,
      lastname: seller.lastname,
      email: seller.email,
      password: '',
      rut: seller.rut,
      phone: seller.phone,
      address: seller.address,
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      if(validate(values.rut)) {
        values._id = seller._id;
        const response = await dispatch(updateSeller(values));
        if (!response) {
          handleCloseCallback();
          enqueueSnackbar("Se guardó correctamente", { variant: "success" });
          if (isMountedRef.current) {
            setSubmitting(false);
          }
        } else {
          if (response.body === "auth/email-already-in-use") {
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
      } else {
        enqueueSnackbar("El rut ingresado no es válido", { variant: "warning" });
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
                  <TextField
                    fullWidth
                    label="Nombre"
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    {...getFieldProps("lastname")}
                    error={Boolean(touched.lastname && errors.lastname)}
                    helperText={touched.lastname && errors.lastname}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correo"
                    {...getFieldProps("email")}
                    error={
                      Boolean(touched.email && errors.email) ||
                      emailError(errors.afterSubmit).error
                    }
                    helperText={
                      (touched.email && errors.email) ||
                      emailError(errors.afterSubmit).helperText
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
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
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Rut"
                    {...getFieldProps("rut")}
                    error={Boolean(touched.rut && errors.rut)}
                    helperText={touched.rut && errors.rut}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    {...getFieldProps("phone")}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    {...getFieldProps("address")}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.addresss}
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
