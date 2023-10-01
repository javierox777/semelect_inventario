import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
  className: PropTypes.string
};

function SearchNotFound({ searchQuery = '', className, ...other }) {
  return (
    <Box className={className} {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Sin resultados
      </Typography>
      <Typography variant="body2" align="center">
        No se encontraron coincidencias
      </Typography>
    </Box>
  );
}

export default SearchNotFound;
