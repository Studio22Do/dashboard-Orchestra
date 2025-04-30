import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL de la API
const API_URL = 'http://localhost:5000/api';

// Credenciales para desarrollo
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'test123',
};

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: localStorage.getItem('token') ? true : false,
  loading: false,
  error: null,
  passwordChangeSuccess: false,
};

// Configuración de axios con token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Acciones asíncronas
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Realizar petición al backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { user, access_token } = response.data;
        
        // Guardar en localStorage para persistencia
      localStorage.setItem('token', access_token);
      
      // Configurar token para futuras peticiones
      setAuthToken(access_token);
        
      return { user, token: access_token };
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Credenciales incorrectas');
      }
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Eliminar token del localStorage
      localStorage.removeItem('token');
      // Limpiar token de axios
      setAuthToken(null);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword, confirmPassword }, { rejectWithValue, getState }) => {
    try {
      // Obtener token del estado
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Usuario no autenticado');
      }
      
      // Configurar token para la petición
      setAuthToken(token);
      
      // Realizar petición al backend
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      return response.data;
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error al cambiar la contraseña');
      }
      return rejectWithValue(error.message || 'Error al cambiar la contraseña');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearPasswordChangeStatus: (state) => {
      state.passwordChangeSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeSuccess = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.passwordChangeSuccess = false;
      });
  },
});

export const { clearErrors, setAuth, clearPasswordChangeStatus } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectPasswordChangeStatus = (state) => state.auth.passwordChangeSuccess;

export default authSlice.reducer; 