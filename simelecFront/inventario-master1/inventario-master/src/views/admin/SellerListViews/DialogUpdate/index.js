import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import editFill from "@iconify-icons/eva/edit-2-fill";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { MButton } from "src/theme";
import Form from "./Form";
import { useDispatch } from "react-redux";
import { setSelectedSeller } from "src/redux/slices/seller";

// ----------------------------------------------------------------------

Index.propTypes = {
  seller: PropTypes.object,
};

// ----------------------------------------------------------------------

function Index({ seller }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    dispatch(setSelectedSeller(seller));
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

      <Dialog open={open} maxWidth="md" onClose={handleClose}>
        <DialogTitle>Actualizar datos de vendedor</DialogTitle>
        <DialogContent>
          <Form handleCloseCallback={handleClose} seller={seller} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Index;
