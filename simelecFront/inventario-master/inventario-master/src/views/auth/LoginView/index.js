import React, { useState } from "react";
import * as Yup from "yup";
import Section from "./Section";
import { useFormik } from "formik";
import LoginForm from "./LoginForm";
import { Icon } from "@iconify/react";
import Page from "src/components/Page";
import Logo from "./img/logo.jpeg";
import SocialLogin from "./SocialLogin";
import useAuth from "src/hooks/useAuth";
import { useSnackbar } from "notistack";
import { PATH_PAGE } from "src/routes/paths";
import closeFill from "@iconify-icons/eva/close-fill";
import { Link as RouterLink } from "react-router-dom";
import useIsMountedRef from "src/hooks/useIsMountedRef";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Link,
  Alert,
  Hidden,
  Tooltip,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { MIconButton } from "src/theme";
import { WhereToVote } from "@material-ui/icons";
import moment from "moment";
import LazySize from "src/components/LazySize";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  header: {
    top: 0,
    zIndex: 9,
    lineHeight: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "absolute",
    padding: theme.spacing(3),
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      alignItems: "flex-start",
      padding: theme.spacing(7, 5, 0, 7),
    },
  },
  content: {
    maxWidth: 480,
    margin: "auto",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(12, 0),
  },
}));

// ----------------------------------------------------------------------

function LoginView() {
  const classes = useStyles();
  const { method, login } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingrese un correo válido")
      .required("Campo requerido"),
    password: Yup.string().required("Campo requerido"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      const response = await login({
        email: values.email,
        password: values.password,
      });
      if (response.message === "error") {
        if (response.body !== "auth/user-whithout-suscription") {
          if (isMountedRef.current) {
            setSubmitting(false);
            setErrors({ afterSubmit: response.body });
          }
        } else {
          if (isMountedRef.current) {
            setSubmitting(false);
            setErrors({ afterSubmit: response.body });
          }
        }
      } else {
        enqueueSnackbar("Login success", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    },
  });

  return (
    <Page title="Ingreso | Control de inventario" className={classes.root}>
      <Container maxWidth="sm">
        <div className={classes.content}>
          <Box sx={{ mb: 5, display: "flex", alignItems: "center"}}>
            <Box sx={{ flexGrow: 1 }}>
              <LazySize
                alt="logo"
                src="/static/images/logo.png"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1.5,
                  
                }}
              />
              <Typography variant="h5" gutterBottom align="center">
                Controla tus productos de manera eficiente
              </Typography>
            </Box>
          </Box>

          <LoginForm formik={formik} />
        </div>
      </Container>
    </Page>
  );
}

export default LoginView;
