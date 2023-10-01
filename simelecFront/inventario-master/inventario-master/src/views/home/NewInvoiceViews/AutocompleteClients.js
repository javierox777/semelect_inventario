import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Card,
  Button,
  CardHeader,
  Typography,
  Autocomplete,
  TextField
} from '@material-ui/core';
import { addClient } from 'src/redux/slices/invoice';

// ----------------------------------------------------------------------

function AutocompleteProducts() {
  const dispatch = useDispatch();
  const { clientList } = useSelector((state) => state.client);

  const handleChangeValue = (event, value) => {
    if(value) {
      dispatch(addClient(value));
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{p: 3, mb: 2}} >
          <Typography variant="h6" sx={{mb: 2}} >
            Busca y selecciona un cliente
          </Typography>
          <Autocomplete
            fullWidth
            options={clientList}
            onChange={handleChangeValue}
            getOptionLabel={(option) => `[${option.rut}] ${option.name}`}
            renderInput={(params) => (
              <TextField {...params} label="Cliente" />
            )}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default AutocompleteProducts;
