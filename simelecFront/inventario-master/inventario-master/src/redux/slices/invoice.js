import { sum, map, filter, uniqBy } from 'lodash';
import axios from 'src/utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { generalConfig } from '../../config';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    client: null,
  },
  invoiceList: [],
  selectedInvoice: null,
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(
        cart.map((product) => product.price * product.quantity)
      );
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product._id === product._id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], '_id');
    },

    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => {
        return item._id !== action.payload;
      });

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
      state.checkout.client = null;
    },

    addClient(state, action) {
      state.checkout.client = action.payload;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    changeQuantity(state, action) {
      const productId = action.payload.productId;
      const quantity = action.payload.quantity;

      const updateCart = map(state.checkout.cart, (product) => {
        if(product._id === productId) {
          return {
            ...product,
            quantity: quantity
          }
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product._id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product._id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total =
        state.checkout.subtotal - state.checkout.discount + shipping;
    },

    setProduct(state, action) {
      state.isLoading = false;
      state.products = [...state.products, action.payload];
    },
    updateProduct(state, action) {
      const product = action.payload;
      state.isLoading = false;

      const copyList = state.products;
      const index = copyList.findIndex(x => x._id === product._id);
      copyList.splice(index, 1);

      const newList = [
        ...copyList,
        product
      ];
      state.products = newList;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    removeProduct(state, action) {
      const id = action.payload;
      state.isLoading = false;

      const copyList = state.products;
      const index = copyList.findIndex(x => x._id === id);
      copyList.splice(index, 1);

      state.products = copyList;
    },
    setProductWithStockList(state, action) {
      state.isLoading = false;
      state.productWithStockList = action.payload;
    },
    setInvoiceList(state, action) {
      state.isLoading = false;
      state.invoiceList = action.payload;
    },
    updateInvoice(state, action) {
      const invoice = action.payload;
      state.selectedInvoice = invoice;
      state.invoiceList = [...state.invoiceList, invoice];
    },
    removeInvoice(state, action) {
      const id = action.payload;
      state.isLoading = false;

      const copyList = state.invoiceList;
      const index = copyList.findIndex(x => x._id === id);
      copyList.splice(index, 1);

      state.invoiceList = copyList;
    },
    setSelectedInvoice(state, action) {
      state.selectedInvoice = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  changeQuantity,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
  setSelectedProduct,
  addClient,
  setSelectedInvoice
} = slice.actions;

// ----------------------------------------------------------------------

export function getInvoiceListBySeller(uuid) {
  const accessToken = window.localStorage.getItem('accessToken');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const query = await fetch(`${generalConfig.baseUrl}/api/invoice/allinvoicesid/${uuid}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${accessToken}`
        },
      });
      const response = await query.json();
      console.log('bandera');
      console.log(response);
      dispatch(slice.actions.setInvoiceList(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export const addInvoice = (values) => async (dispatch) => {
  const invoice = {
    taxes: 0,
    discount: 0,
    status: 'paid',
    invoiceFrom: {
      name: 'Tupaz',
      address: 'Dirección a asignar',
      company: 'Venta de desechables por menor',
      email: 'nerio.lorona@gmail.com',
      phone: '971927522',
    },
    invoiceTo: {
      name: values.client.name,
      address: 'Sin dirección',
      company: values.client.rut,
      email: 'nerio.lorona@gmail.com',
      phone: values.client.phone,
    },
    items: values.products,
    seller: values.seller,
  }

  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/invoice/createinvoice`, {
      method: 'POST',
      body: JSON.stringify(invoice),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
    });
    const response = await query.json();
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.updateInvoice(response.body));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export const removeInvoice = (id) => async (dispatch) => {
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/invoice/deleteinvoice/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
    })
    const response = await query.json();
    console.log(response);
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.removeInvoice(id));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}