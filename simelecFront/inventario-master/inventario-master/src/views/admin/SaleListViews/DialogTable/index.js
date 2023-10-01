import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify-icons/eva/eye-fill";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { MButton } from "src/theme";
import { useDispatch } from "react-redux";
import { setSelectedSeller } from "src/redux/slices/seller";
import Table from './Table';

// ----------------------------------------------------------------------

Index.propTypes = {
  products: PropTypes.array,
};

// ----------------------------------------------------------------------

function Index({ products }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Icon width={20} height={20} icon={eyeFill} />
      </IconButton>

      <Dialog open={open} maxWidth="md" fullWidth={true} onClose={handleClose}>
        <DialogTitle>Lista de productos de esta venta</DialogTitle>
        <DialogContent>
          <Table products={products} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Index;
