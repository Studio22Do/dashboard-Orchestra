import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Interceptor para actualizar créditos automáticamente
axios.interceptors.response.use(
  (response) => {
    if (response && response.data && response.data.credits_info) {
      import('../store')
        .then(({ default: store }) =>
          import('./creditsSlice').then(({ setBalance }) => {
            store.dispatch(setBalance(response.data.credits_info.remaining));
          })
        )
        .catch(() => {});
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Thunks
export const fetchCreditsBalance = createAsyncThunk(
  'credits/fetchBalance',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_BASE_URL}/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener balance de créditos');
    }
  }
);

export const deductCredits = createAsyncThunk(
  'credits/deduct',
  async (amount, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No hay token de autenticación');
      }
      
      const response = await axios.post(`${API_BASE_URL}/credits/deduct`, 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al descontar créditos');
    }
  }
);

export const addCredits = createAsyncThunk(
  'credits/add',
  async ({ amount, user_id = null }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No hay token de autenticación');
      }
      
      const payload = { amount };
      if (user_id) {
        payload.user_id = user_id;
      }
      
      const response = await axios.post(`${API_BASE_URL}/credits/add`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al agregar créditos');
    }
  }
);

// Estado inicial
const initialState = {
  balance: 0,
  loading: false,
  error: null,
  lastUpdated: null
};

// Slice
const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchCreditsBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditsBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.credits;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCreditsBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deduct credits
      .addCase(deductCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deductCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.remaining_credits;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deductCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add credits
      .addCase(addCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.new_balance;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, setBalance } = creditsSlice.actions;

export const selectCreditsBalance = (state) => state.credits.balance;
export const selectCreditsLoading = (state) => state.credits.loading;
export const selectCreditsError = (state) => state.credits.error;
export const selectCreditsLastUpdated = (state) => state.credits.lastUpdated;

export default creditsSlice.reducer;
