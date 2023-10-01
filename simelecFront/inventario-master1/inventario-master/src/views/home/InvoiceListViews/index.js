import React, { useState, useEffect, useCallback } from "react";
import { filter } from "lodash";
import HeadTable from "./HeadTable";
import Page from "src/components/Page";
import { sum } from 'lodash';
import { Icon } from "@iconify/react";
import ToolbarTable from "./ToolbarTable";
import { PATH_HOME } from "src/routes/paths";
import { sentenceCase } from "change-case";
import Scrollbars from "src/components/Scrollbars";
import { visuallyHidden } from "@material-ui/utils";
import { useDispatch, useSelector } from "react-redux";
import SearchNotFound from "src/components/SearchNotFound";
import { HeaderDashboard } from "src/layouts/Common";
import moreVerticalFill from "@iconify-icons/eva/more-vertical-fill";
import editFill from "@iconify-icons/eva/edit-2-fill";
import trashFill from "@iconify-icons/eva/trash-2-fill";
import eyeFill from "@iconify-icons/eva/eye-fill";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { fCurrency } from 'src/utils/formatNumber';
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Hidden,
} from "@material-ui/core";
import { MLabel, MButton } from "src/theme";
import {
  getInvoiceListBySeller,
  setSelectedInvoice,
} from "src/redux/slices/invoice";
import DialogRemove from "./DialogRemove";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import moment from "moment";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "Número", alignRight: false },
  { id: "client", label: "Cliente", alignRight: false },
  { id: "date", label: "Fecha", alignRight: false },
  { id: "total", label: "Total", alignRight: false },
  { id: "" },
];

const useStyles = makeStyles((theme) => ({
  root: {},
  sortSpan: visuallyHidden,
}));

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "asc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    array = filter(array, (invoice) => {
      return invoice._id.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return array;
  }
  return stabilizedThis.map((el) => el[0]);
}

function StudentListView() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("_id");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const history = useHistory();

  const { invoiceList } = useSelector((state) => state.invoice);
  const { user } = useSelector((state) => state.authJwt);

  useEffect(() => {
    dispatch(getInvoiceListBySeller(user._id));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = invoiceList.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleClickPreview = (row) => {
    dispatch(setSelectedInvoice(row));
    history.push(PATH_HOME.invoiceview);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - invoiceList.length) : 0;

  const filteredUsers = applySortFilter(
    invoiceList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Vendedores | Control de inventario" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading="Lista de presupuestos"
          links={[
            { _id: "Inicio", href: PATH_HOME.root },
            { _id: "Presupuestos" },
          ]}
          action={
            <Link component={RouterLink} to={PATH_HOME.invoice}>
              <MButton variant="contained" color="primary">
                Crear nuevo presupuesto
              </MButton>
            </Link>
          }
        />

        <Card className={classes.card}>
          <ToolbarTable
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbars>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <HeadTable
                  order={order}
                  classes={classes}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invoiceList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { _id, date, items, invoiceTo } = row;
                      const isItemSelected = selected.indexOf(_id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          className={classes.row}
                        >
                          {/*  <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onClick={(event) => handleClick(event, _id)}
                            />
                          </TableCell> */}
                          <TableCell component="th" scope="row" padding="none">
                            {/* <Box
                              sx={{
                                py: 2,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                component={Avatar}
                                alt={_id}
                                src={"/static/images/avatars/avatar_default.jpg"}
                                sx={{ mx: 2 }}
                              />
                            </Box> */}
                            <Typography variant="subtitle2" noWrap>
                              {_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {invoiceTo.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {moment(date).format("LLLL")}
                          </TableCell>
                          <TableCell align="left">{fCurrency(sum(items.map((item) => item.price * item.quantity)))}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleClickPreview(row)}>
                              <Icon width={20} height={20} icon={eyeFill} />
                            </IconButton>
                            <DialogRemove id={_id} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbars>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={invoiceList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default StudentListView;
