import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL de la API
const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Credenciales para desarrollo
const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'test123',
};

// Estado inicial
const initialState = {
  user: null,
  token: "null", // Token falso para desarrollo
  isAuthenticated: false, // Siempre autenticado para desarrollo
  loading: false,
  error: null,
  passwordChangeSuccess: false,
  registrationSuccess: false,
  emailVerificationSent: false,
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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
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

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Realizar petición al backend para registro
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error en el registro');
      }
      return rejectWithValue(error.message || 'Error al registrar usuario');
    }
  }
);

export const registerWithGoogle = createAsyncThunk(
  'auth/registerWithGoogle',
  async ({ google_token, user_info }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google-register`, {
        google_token,
        user_info
      });
      const { user, access_token } = response.data;
      localStorage.setItem('token', access_token);
      setAuthToken(access_token);
      return { user, token: access_token };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error en el registro con Google');
      }
      return rejectWithValue(error.message || 'Error al registrar con Google');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token }, { rejectWithValue }) => {
    try {
      // Verificar el email con el token
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        verification_token: token
      });
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error al verificar el email');
      }
      return rejectWithValue(error.message || 'Error al verificar el email');
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerificationEmail',
  async ({ email }, { rejectWithValue }) => {
    try {
      // Reenviar email de verificación
      const response = await axios.post(`${API_URL}/auth/resend-verification`, {
        email
      });
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error al reenviar el email');
      }
      return rejectWithValue(error.message || 'Error al reenviar el email');
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

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('No hay token de autenticación');
      }
      
      setAuthToken(token);
      
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error al obtener información del usuario');
      }
      return rejectWithValue(error.message || 'Error al obtener información del usuario');
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
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.emailVerificationSent = false;
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
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationSuccess = true;
        state.emailVerificationSent = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })
      // Register with Google
      .addCase(registerWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerificationSent = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
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
      })
      // Fetch User Info
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, setAuth, clearPasswordChangeStatus, clearRegistrationStatus } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectPasswordChangeStatus = (state) => state.auth.passwordChangeSuccess;
export const selectRegistrationStatus = (state) => state.auth.registrationSuccess;
export const selectEmailVerificationStatus = (state) => state.auth.emailVerificationSent;

export default authSlice.reducer; 