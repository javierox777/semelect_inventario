import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import editFill from '@iconify-icons/eva/edit-2-fill';
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
import { useDispatch } from 'react-redux'
import { setSelectedProduct } from 'src/redux/slices/product';

// ----------------------------------------------------------------------

Index.propTypes = {
  product: PropTypes.object,
}

// ----------------------------------------------------------------------

function Index({product}) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    dispatch(setSelectedProduct(product));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Icon width={20} height={20} icon={editFill} />
      </IconButton>

      <Dialog open={open} maxWidth="sm" onClose={handleClose}>
        <DialogTitle>Actualizar información del producto</DialogTitle>
        <DialogContent>
          <Form handleCloseCallback={handleClose} product={product}  />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Index;
