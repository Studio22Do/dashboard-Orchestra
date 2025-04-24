import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
};

// Acciones asíncronas
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Para simulación - esto sería una llamada API real
      if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const userData = {
          id: 1,
          name: 'Usuario de Prueba',
          email: TEST_CREDENTIALS.email,
          role: 'admin',
        };
        
        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('token', mockToken);
        
        return { user: userData, token: mockToken };
      } else {
        return rejectWithValue('Credenciales incorrectas');
      }
    } catch (error) {
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
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
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
      });
  },
});

export const { clearErrors, setAuth } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer; 