import { createSlice } from '@reduxjs/toolkit';
import { generalConfig } from '../../config';

const initialState = {
  isLoading: false,
  error: false,
  client: null,
  selectedClient: null,
  clientList: [],
}

const slice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setClient(state, action) {
      state.isLoading = false;
      state.clientList = [...state.clientList, action.payload];
    },
    setClientList(state, action) {
      state.isLoading = false;
      state.clientList = action.payload;
    },
    setSelectedClient(state, action) {
      state.isLoading = false;
      const id = action.payload;
      const index = state.clientList.findIndex(x => x._id === id);
      const selected = state.clientList[index];
      state.selectedClient = selected;
    },
    updateClient(state, action) {
      const client = action.payload;

      const copyList = state.clientList;

      const index = copyList.findIndex(x => x._id === client._id);

      copyList.splice(index, 1);

      const newList = [
        ...copyList,
        client,
      ]
      state.clientList = newList;
    },
    removeClient(state, action) {
      const id = action.payload;

      const copyList = state.clientList;

      const index = copyList.findIndex(x => x.id === id);

      copyList.splice(index, 1);

      state.clientList = copyList;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { setSelectedClient } = slice.actions;


// ----------------------------------------------------------------------

export function getClientList() {
  const accessToken = window.localStorage.getItem('accessToken');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const query = await fetch(`${generalConfig.baseUrl}/api/client/allclients`);
      const response = await query.json();
      
      dispatch(slice.actions.setClientList(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export const addClient = (values) => async (dispatch) => {
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/client/createclient`, {
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
    dispatch(slice.actions.setClient(response.body));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export const updateClient = (values) => async (dispatch) => {
  console.log(values);
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/client/updateclient/${values._id}`, {
      method: 'PUT',
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
    dispatch(slice.actions.updateClient(response.body));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export const removeClient = (id) => async (dispatch) => {
  const accessToken = window.localStorage.getItem('accessToken');
  dispatch(slice.actions.startLoading());
  try {
    const query = await fetch(`${generalConfig.baseUrl}/api/client/deleteclient/${id}`, {
      method: 'DELETE',
    })
    const response = await query.json();
    console.log(response);
    if (response.message === 'error') {
      return response;
    }
    dispatch(slice.actions.removeClient(id));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------
