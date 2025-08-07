import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Helper para determinar si el usuario puede usar una app
const canUseApp = (user, mode) => {
  // En beta_v1, siempre disponible (demo)
  if (mode === 'beta_v1') {
    return true;
  }
  
  // En beta_v2, verificar requests disponibles
  if (mode === 'beta_v2') {
    // Si no hay usuario, no puede usar
    if (!user) return false;
    
    // Por ahora, asumimos que tiene requests disponibles
    // TODO: Implementar lógica real de requests
    return true;
  }
  
  return false;
};

// Thunks
export const fetchPurchasedApps = createAsyncThunk(
  'apps/fetchPurchasedApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/apps/user/apps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si no hay apps compradas, retornar array vacío
      if (!response.data.apps || response.data.apps.length === 0) {
        return [];
      }
      
      return response.data.apps;
    } catch (error) {
      // En caso de error, retornar array vacío
      return [];
    }
  }
);

export const fetchFavoriteApps = createAsyncThunk(
  'apps/fetchFavoriteApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/apps/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // El backend devuelve { favorites: [...], by_category: {...}, total: number }
      if (!response.data.favorites || response.data.favorites.length === 0) {
        return [];
      }
      
      // Remover duplicados antes de retornar
      const uniqueFavorites = response.data.favorites.filter((app, index, self) => {
        const appId = app.app_id || app.id;
        return index === self.findIndex(a => (a.app_id || a.id) === appId);
      });
      
      return uniqueFavorites;
    } catch (error) {
      // En caso de error, retornar array vacío
      return [];
    }
  }
);

// Helper para saber si estamos en modo mock (no hay backend o la respuesta es vacía)
const isMockMode = () => {
  // Si no hay backend o la respuesta de /apps es MOCK_APPS_DATA
  return !window.localStorage.getItem('useRealBackend');
};

export const purchaseApp = createAsyncThunk(
  'apps/purchaseApp',
  async (appId, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('token');
    
    // Solo usar peticiones reales al backend
    try {
      const response = await axios.post(`${API_BASE_URL}/apps/user/apps/${appId}/purchase`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Después de una compra exitosa, recargar las apps compradas
      await dispatch(fetchPurchasedApps());
      
      return response.data.app;
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        return rejectWithValue('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 422) {
        return rejectWithValue('Error de validación. Verifica tu sesión.');
      } else if (error.response?.status === 404) {
        return rejectWithValue('Aplicación no encontrada.');
      } else if (error.response?.status === 403) {
        return rejectWithValue('No tienes permisos para realizar esta acción.');
      } else if (!error.response) {
        return rejectWithValue('Error de conexión con el servidor.');
      } else {
        return rejectWithValue(error.response?.data?.message || 'Error al comprar app');
      }
    }
  }
);

export const toggleFavoriteApp = createAsyncThunk(
  'apps/toggleFavoriteApp',
  async (appId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      const response = await axios.post(`${API_BASE_URL}/apps/user/apps/${appId}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Después de cambiar el favorito, recargar las apps favoritas
      await dispatch(fetchFavoriteApps());
      
      return response.data.app;
    } catch (error) {
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        return rejectWithValue('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 422) {
        return rejectWithValue('Error de validación. Verifica tu sesión.');
      } else if (error.response?.status === 404) {
        return rejectWithValue('Aplicación no encontrada.');
      } else if (error.response?.status === 403) {
        return rejectWithValue('Debes comprar la app antes de marcarla como favorita.');
      } else if (!error.response) {
        return rejectWithValue('Error de conexión con el servidor.');
      } else {
        return rejectWithValue(error.response?.data?.message || 'Error al actualizar favorito');
      }
    }
  }
);

// Thunk para obtener todas las apps disponibles (con fallback a mock)
export const fetchAllApps = createAsyncThunk(
  'apps/fetchAllApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/apps/`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Si la respuesta es vacía, usar array vacío
      if (!response.data.apps || response.data.apps.length === 0) {
        return [];
      }
      
      return response.data.apps;
    } catch (error) {
      // Si hay error de red o backend, devolver error
      return rejectWithValue('Error al cargar las aplicaciones desde el backend');
    }
  }
);

// Estado inicial
const initialState = {
  allApps: [],
  purchasedApps: JSON.parse(localStorage.getItem('purchasedApps') || '[]'),
  favoriteApps: [],
  loading: false,
  error: null,
};

// Acciones asíncronas
export const fetchApps = createAsyncThunk(
  'apps/fetchApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/apps/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si la respuesta es vacía, usar array vacío
      if (!response.data.apps || response.data.apps.length === 0) {
        return { apps: [], categories: ['All'] };
      }
      
      // Extraer categorías únicas de las apps reales
      const categories = ['All', ...Array.from(new Set(response.data.apps.map(app => app.category)))];
      
      return { apps: response.data.apps, categories };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar las apps');
    }
  }
);

export const fetchAppDetails = createAsyncThunk(
  'apps/fetchAppDetails',
  async (appId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/apps/${appId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar los detalles de la app');
    }
  }
);

// Slice
const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    clearCurrentApp: (state) => {
      state.currentApp = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchApps
      .addCase(fetchApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload.apps;
        state.categories = action.payload.categories;
      })
      .addCase(fetchApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchAppDetails
      .addCase(fetchAppDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApp = action.payload;
      })
      .addCase(fetchAppDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch purchased apps
      .addCase(fetchPurchasedApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchasedApps.fulfilled, (state, action) => {
        state.loading = false;
        state.purchasedApps = action.payload;
      })
      .addCase(fetchPurchasedApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch favorite apps
      .addCase(fetchFavoriteApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteApps.fulfilled, (state, action) => {
        state.loading = false;
        // Limpiar y reemplazar las apps favoritas para evitar duplicados
        state.favoriteApps = action.payload;
      })
      .addCase(fetchFavoriteApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Purchase app
      .addCase(purchaseApp.fulfilled, (state, action) => {
        state.purchasedApps.push(action.payload);
        // Guardar en localStorage
        const purchasedApps = [...state.purchasedApps];
        localStorage.setItem('purchasedApps', JSON.stringify(purchasedApps));
      })
      // Toggle favorite
      .addCase(toggleFavoriteApp.fulfilled, (state, action) => {
        // Actualiza el estado de favorito en purchasedApps
        const idx = state.purchasedApps.findIndex(app => app.app_id === action.payload.app_id || app.id === action.payload.app_id);
        if (idx !== -1) {
          state.purchasedApps[idx].is_favorite = action.payload.is_favorite;
        }
        // Actualiza la lista de favoritas
        if (action.payload.is_favorite) {
          // Verificar si ya existe antes de agregar
          const exists = state.favoriteApps.some(app => 
            (app.app_id || app.id) === (action.payload.app_id || action.payload.id)
          );
          if (!exists) {
            state.favoriteApps.push(action.payload);
          }
        } else {
          state.favoriteApps = state.favoriteApps.filter(app => 
            (app.app_id || app.id) !== (action.payload.app_id || action.payload.id)
          );
        }
      })
      .addCase(fetchAllApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApps.fulfilled, (state, action) => {
        state.loading = false;
        state.allApps = action.payload;
      })
      .addCase(fetchAllApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentApp, clearErrors } = appsSlice.actions;

export const selectApps = (state) => state.apps.apps;
export const selectCategories = (state) => state.apps.categories;
export const selectCurrentApp = (state) => state.apps.currentApp;
export const selectPurchasedApps = (state) => state.apps.purchasedApps;
export const selectFavoriteApps = (state) => state.apps.favoriteApps;
export const selectAppsLoading = (state) => state.apps.loading;
export const selectAppsError = (state) => state.apps.error;
export const selectAllApps = (state) => state.apps.allApps || state.apps.apps || [];

// Nuevos selectores para la lógica de requests
export const selectCanUseApp = (state, appId) => {
  const user = state.auth.user;
  const mode = process.env.REACT_APP_MODE || 'beta_v1';
  return canUseApp(user, mode);
};

export const selectUserRequests = (state) => {
  const user = state.auth.user;
  const mode = process.env.REACT_APP_MODE || 'beta_v1';
  
  // En beta_v1, requests ilimitados (demo)
  if (mode === 'beta_v1') {
    return 999;
  }
  
  // En beta_v2, usar créditos del slice de créditos
  if (mode === 'beta_v2') {
    // Priorizar créditos del slice de créditos si está disponible
    if (state.credits && state.credits.balance !== undefined) {
      return state.credits.balance;
    }
    
    // Fallback a créditos del usuario si están disponibles
    if (user && user.credits !== undefined) {
      return user.credits;
    }
  }
  
  // Fallback si no hay usuario o créditos
  return 0;
};

export default appsSlice.reducer; 