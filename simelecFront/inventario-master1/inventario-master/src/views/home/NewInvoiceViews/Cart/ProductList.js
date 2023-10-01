import clsx from "clsx";
import React, {useState} from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import LazySize from "src/components/LazySize";
import getColorName from "src/utils/getColorName";
import { fCurrency } from "src/utils/formatNumber";
import plusFill from "@iconify-icons/eva/plus-fill";
import minusFill from "@iconify-icons/eva/minus-fill";
import trash2Fill from "@iconify-icons/eva/trash-2-fill";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TextField
} from "@material-ui/core";
import { MIconButton } from "src/theme";
import { generalConfig } from "../../../../config";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { changeQuantity } from "src/redux/slices/invoice";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  quantity: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(0.5, 0.75),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
  },
}));

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  _id: PropTypes.string,
  stock: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ _id, stock, quantity, onIncrease, onDecrease }) {
  const [value, setValue] = useState(quantity);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleChangeValue = (event) => {
    const newValue = event.target.value;
    if (newValue <= stock) {
      setValue(event.target.value);
      dispatch(changeQuantity({ productId: _id, quantity: parseInt(newValue) }));
    } else {
      enqueueSnackbar("La cantidad ingresada no puede ser 0 ni mayor al stock", {
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ width: 96, textAlign: "right" }}>
      <div className={classes.quantity}>
        <TextField value={value} onChange={handleChangeValue} />
        {/* <MIconButton
          size="small"
          color="inherit"
          onClick={onDecrease}
          disabled={quantity <= 1}
        >
          <Icon icon={minusFill} width={16} height={16} />
        </MIconButton>
        {quantity}
        <MIconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= stock}
        >
          <Icon icon={plusFill} width={16} height={16} />
        </MIconButton> */}
      </div>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Stock: {stock}
      </Typography>
    </Box>
  );
}

ProductList.propTypes = {
  formik: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
  className: PropTypes.string,
};

function ProductList({
  formik,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
  className,
}) {
  const classes = useStyles();
  const { products } = formik.values;

  return (
    <div className={clsx(classes.root, className)}>
      <TableContainer sx={{ minWidth: 720, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="left">Precio</TableCell>
              <TableCell align="left">Cantidad</TableCell>
              <TableCell align="right">Precio Total</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => {
              const {
                _id,
                name,
                price,
                quantity,
                stock,
                description,
                path,
                subtotal,
              } = product;
              return (
                <TableRow key={_id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LazySize
                        alt="product image"
                        src={generalConfig.baseUrl + path}
                        sx={{
                          mr: 2,
                          width: 64,
                          height: 64,
                          borderRadius: 1.5,
                        }}
                      />
                      <Box>
                        <Typography
                          noWrap
                          variant="subtitle2"
                          sx={{ maxWidth: 240 }}
                        >
                          {name}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2">{description}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="left">{fCurrency(price)}</TableCell>

                  <TableCell align="left">
                    <Incrementer
                      _id={_id}
                      quantity={quantity}
                      stock={stock}
                      onDecrease={() => onDecreaseQuantity(_id)}
                      onIncrease={() => onIncreaseQuantity(_id)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    {fCurrency(price * quantity)}
                  </TableCell>

                  <TableCell align="right">
                    <MIconButton onClick={() => onDelete(_id)}>
                      <Icon icon={trash2Fill} width={20} height={20} />
                    </MIconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ProductList;
