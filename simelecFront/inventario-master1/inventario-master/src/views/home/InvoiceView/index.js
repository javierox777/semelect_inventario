import faker from 'faker';
import React from 'react';
import { sum } from 'lodash';
import Toolbar from './Toolbar';
import Page from 'src/components/Page';
import { PATH_HOME } from 'src/routes/paths';
import { fCurrency } from 'src/utils/formatNumber';
import Scrollbars from 'src/components/Scrollbars';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  Table,
  Divider,
  TableRow,
  Container,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer
} from '@material-ui/core';
import { MLabel } from 'src/theme';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  tableHead: {
    borderBottom: `solid 1px ${theme.palette.divider}`,
    '& th': {
      backgroundColor: 'transparent'
    }
  },
  row: {
    borderBottom: `solid 1px ${theme.palette.divider}`
  },
  rowResult: {
    '& td': {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  }
}));

// ----------------------------------------------------------------------

function InvoiceView() {
  const classes = useStyles();
  const { selectedInvoice } = useSelector((state) => state.invoice);
  const subTotal = sum(selectedInvoice.items.map((item) => item.price * item.quantity));
  const total = subTotal - selectedInvoice.discount + selectedInvoice.taxes;

  const INVOICE = {
    id: selectedInvoice._id,
    taxes: selectedInvoice.taxes,
    discount: selectedInvoice.discount,
    status: selectedInvoice.status,
    invoiceFrom: {
      name: selectedInvoice.invoiceFrom.name,
      address: selectedInvoice.invoiceFrom.address,
      company: selectedInvoice.invoiceFrom.company,
      email: selectedInvoice.invoiceFrom.emaill,
      phone: selectedInvoice.invoiceFrom.phone
    },
    invoiceTo: {
      name: selectedInvoice.invoiceTo.name,
      address: selectedInvoice.invoiceTo.address,
      company: selectedInvoice.invoiceTo.company,
      email: selectedInvoice.invoiceTo.email,
      phone: selectedInvoice.invoiceTo.phone
    },
    items: selectedInvoice.items.map((item) => {
      return {
        id: item._id,
        title: item.name,
        description: item.description,
        qty: item.quantity,
        price: item.price
      };
    })
  };

  return (
    <Page
      title="Presupuesto | Control de inventario"
      className={classes.root}
    >
      <Container>
  {/*       <HeaderDashboard
          heading="Detalles de Presupuesto"
          links={[
            { name: 'Dashboard', href: PATH_HOME.root },
            { name: 'Presupuesto' }
          ]}
        /> */}

        <Toolbar invoice={INVOICE} />

        <Card sx={{ pt: 5, px: 5 }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Box
                component="img"
                alt="logo"
                src="/static/images/logo.png"
                sx={{ height: 48 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Box sx={{ textAlign: { sm: 'right' } }}>
                {/* <MLabel
                  color="success"
                  sx={{ textTransform: 'uppercase', mb: 1 }}
                >
                  {INVOICE.status}
                </MLabel> */}
                <Typography variant="h6">Nº {INVOICE.id}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography
                paragraph
                variant="overline"
                sx={{ color: 'text.disabled' }}
              >
                De:
              </Typography>
              <Typography variant="body2">
                {INVOICE.invoiceFrom.name}
              </Typography>
              <Typography variant="body2">
                {INVOICE.invoiceFrom.address}
              </Typography>
              <Typography variant="body2">
                Teléfono: {INVOICE.invoiceFrom.phone}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography
                paragraph
                variant="overline"
                sx={{ color: 'text.disabled' }}
              >
                Para:
              </Typography>
              <Typography variant="body2">{INVOICE.invoiceTo.name}</Typography>
              <Typography variant="body2">
                {INVOICE.invoiceTo.address}
              </Typography>
              <Typography variant="body2">
                Teléfono: {INVOICE.invoiceTo.phone}
              </Typography>
            </Grid>
          </Grid>

          <Scrollbars>
            <TableContainer sx={{ minWidth: 960 }}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell width={40}>#</TableCell>
                    <TableCell align="left">Descripción</TableCell>
                    <TableCell align="left">Cantidad</TableCell>
                    <TableCell align="right">Precio unitario</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {INVOICE.items.map((row, index) => (
                    <TableRow key={index} className={classes.row}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="left">
                        <Box sx={{ maxWidth: 560 }}>
                          <Typography variant="subtitle2">
                            {row.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                            noWrap
                          >
                            {row.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left">{row.qty}</TableCell>
                      <TableCell align="right">
                        {fCurrency(row.price)}
                      </TableCell>
                      <TableCell align="right">
                        {fCurrency(row.price * row.qty)}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className={classes.rowResult}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Box sx={{ mt: 2 }} />
                      <Typography variant="body1">Subtotal</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Box sx={{ mt: 2 }} />
                      <Typography variant="body1">
                        {fCurrency(subTotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow className={classes.rowResult}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="body1">Descuento</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Typography sx={{ color: 'error.main' }}>
                        {fCurrency(-INVOICE.discount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.rowResult}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="body1">Taxes</Typography>
                    </TableCell>
                    <TableCell align="right" width={120}>
                      <Typography variant="body1">
                        {fCurrency(INVOICE.taxes)}
                      </Typography>
                    </TableCell>
                  </TableRow> */}
                  <TableRow className={classes.rowResult}>
                    <TableCell colSpan={3} />
                    <TableCell align="right">
                      <Typography variant="h6">Total</Typography>
                    </TableCell>
                    <TableCell align="right" width={140}>
                      <Typography variant="h6">{fCurrency(total)}</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbars>

          <Divider sx={{ mt: 5 }} />

          <Grid container>
            <Grid item xs={12} md={9} sx={{ py: 3 }}>
              <Typography variant="subtitle2">NOTAS</Typography>
              <Typography variant="body2">
                En Tupaz, distribuidora de productos desechables agradecemos su preferencia, y vuelva pronto.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
              <Typography variant="subtitle2">¿Tienes alguna duda?</Typography>
              <Typography variant="body2">support@tupaz.cl</Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}

export default InvoiceView;
