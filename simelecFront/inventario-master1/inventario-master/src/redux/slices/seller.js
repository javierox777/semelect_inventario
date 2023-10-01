import { createSlice } from '@reduxjs/toolkit';
import { generalConfig } from '../../config';

const initialState = {
  isLoading: false,
  error: false,
  seller: null,
  selectedSeller: null,
  sellerList: [],
}

const slice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSeller(state, action) {
      state.isLoading = false;
      state.sellerList = [...state.sellerList, action.payload];
    },
    setSellerList(state, action) {
      state.isLoading = false;
      state.sellerList = action.payload;
    },
    setSelectedSeller(state, action) {
      state.isLoading = false;
      const id = action.payload;
      const index = state.sellerList.findIndex(x => x._id === id);
      const selected = state.sellerList[index];
      state.selectedSeller = selected;
    },
    updateSeller(state, action) {
      const seller = action.payload;

      const copyList = state.sellerList;

      const index = copyList.findIndex(x => x._id === seller._id);

      copyList.splice(index, 1);

      const newList = [
        ...copyList,
        seller,
      ]
      state.sellerList = newList;
    },
    removeSeller(state, action) {
      const id = action.payload;

      const copyList = state.sellerList;

      const index = copyList.findIndex(x => x.id === id);

      copyList.splice(index, 1);

      state.sellerList = copyList;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedSeller } = slice.actions;

// ----------------------------------------------------------------------

export const addSeller = (values) => async (dispatch) => {
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/user/signup`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
    });
    const response = await query.json();
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.setSeller(response.body));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export const updateSeller = (values) => async (dispatch) => {
  console.log(values);
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/user/updateseller/${values._id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${accessToken}`
      },
    });
    const response = await query.json();
    console.log(response);
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.updateSeller(response.body));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export const removeSeller = (id) => async (dispatch) => {
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/user/deleteseller/${id}`, {
      method: 'DELETE',
    })
    const response = await query.json();
    console.log(response);
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.removeSeller(id));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export function getSellerList() {
  const accessToken = window.localStorage.getItem('accessToken');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const query = await fetch(`${generalConfig.baseUrl}/api/user/allsellers`);
      const response = await query.json();
      
      dispatch(slice.actions.setSellerList(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
