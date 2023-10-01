import React, { useState } from 'react';
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton
} from '@material-ui/core';
import { MButton } from 'src/theme';
import Form from './Form';
import { PATH_HOME } from 'src/routes/paths';
import { Icon } from "@iconify/react";
import trashFill from "@iconify-icons/eva/trash-2-fill";
import PropTypes from "prop-types";

DialogRemove.propTypes = {
  sale: PropTypes.object,
};

// ----------------------------------------------------------------------

function DialogRemove({sale}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Icon width={20} height={20} icon={trashFill} />
      </IconButton>

      <Dialog open={open} maxWidth="md" onClose={handleClose}>
        <DialogTitle>Ingrese la contraseña de administrador para eliminar esta venta</DialogTitle>
        <DialogContent>
          <Form handleCloseCallback={handleClose} sale={sale} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DialogRemove;
