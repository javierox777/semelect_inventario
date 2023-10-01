import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@material-ui/core";
import { MButton } from "src/theme";
import { Icon } from "@iconify/react";
import trashFill from "@iconify-icons/eva/trash-2-fill";
import { useDispatch, useSelector } from "react-redux";
import { removeSeller } from "src/redux/slices/seller";
import { useSnackbar } from "notistack";
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

DialogRemove.propTypes = {
  id: PropTypes.string,
}

// ----------------------------------------------------------------------

function DialogRemove({id}) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setOpen(false);
    const response = await dispatch(removeSeller(id))
    if(response) {
      enqueueSnackbar("Algo sucedió", { variant: "warning" });
    }
    enqueueSnackbar("Se eliminó correctamente", { variant: "success" });
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Icon width={20} height={20} icon={trashFill} />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Eliminar usuario"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea eliminar de sus registros a este vendedor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Salir</Button>
          <Button onClick={handleConfirm} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogRemove;
