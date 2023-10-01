import React, {useEffect} from 'react';
import Page from 'src/components/Page';
import { PATH_HOME } from 'src/routes/paths';
import { makeStyles } from '@material-ui/core/styles';
import { getSaleListBySeller } from "src/redux/slices/product";
import {useDispatch, useSelector} from 'react-redux';
import {
  Card,
  Grid,
  Container,
  CardHeader,
  CardContent
} from '@material-ui/core';
// ----------------------------------------------------------------------

import SaleColumnChart from './SaleColumnChart';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  cardContent: {
    height: 420,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

function Apexcharts() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.authJwt);

  useEffect(() => {
    dispatch(getSaleListBySeller(user._id));
  }, [dispatch]);

  return (
    <Page title="Inicio | Control de inventario" className={classes.root}>
      <Container maxWidth="lg">

        <Grid container spacing={3}>

          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title="Total de mis ventas por mes" />
              <CardContent dir="ltr">
                <SaleColumnChart />
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}

export default Apexcharts;
