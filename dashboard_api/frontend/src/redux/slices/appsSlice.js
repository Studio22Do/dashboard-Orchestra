import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Datos de ejemplo para las apps (simulamos datos que vendrían del backend)
const MOCK_APPS_DATA = [
  {
    id: 'instagram-stats',
    title: 'Instagram Statistics',
    description: 'Analiza perfiles de Instagram, obtén estadísticas y monitorea crecimiento',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
    category: 'Social Media',
    route: '/apps/instagram',
    apiName: 'Instagram Statistics API'
  },
  {
    id: 'weather-forecast',
    title: 'Weather Forecast',
    description: 'Consulta el pronóstico del tiempo en cualquier ubicación del mundo',
    imageUrl: 'https://cdn.pixabay.com/photo/2013/04/01/09/22/clouds-98536_960_720.png',
    category: 'Weather',
    route: '/apps/weather',
    apiName: 'Weather Forecast API'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convierte divisas con tasas de cambio en tiempo real',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/23/13/44/currency-exchange-2672531_960_720.png',
    category: 'Finance',
    route: '/apps/currency',
    apiName: 'Currency Exchange API'
  },
  {
    id: 'stock-tracker',
    title: 'Stock Market Tracker',
    description: 'Sigue el rendimiento de acciones y mercados financieros en tiempo real',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/11/27/07/02/financial-2980349_960_720.jpg',
    category: 'Finance',
    route: '/apps/stocks',
    apiName: 'Stock Market API'
  },
  {
    id: 'news-aggregator',
    title: 'News Aggregator',
    description: 'Recopila noticias de diferentes fuentes en un solo lugar',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg',
    category: 'News',
    route: '/apps/news',
    apiName: 'News API'
  },
  {
    id: 'covid-tracker',
    title: 'COVID-19 Tracker',
    description: 'Monitorea estadísticas y tendencias de COVID-19 en todo el mundo',
    imageUrl: 'https://cdn.pixabay.com/photo/2020/04/21/00/40/coronavirus-5071045_960_720.jpg',
    category: 'Health',
    route: '/apps/covid',
    apiName: 'COVID-19 Statistics API'
  }
];

// Thunks
export const fetchPurchasedApps = createAsyncThunk(
  'apps/fetchPurchasedApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apps/user/apps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.apps;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener apps compradas');
    }
  }
);

export const fetchFavoriteApps = createAsyncThunk(
  'apps/fetchFavoriteApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apps/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.apps;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener apps favoritas');
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
  async (appId, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('token');
    // Si estamos en modo mock, simular la compra
    if (isMockMode()) {
      // Buscar la app en el mock
      const app = MOCK_APPS_DATA.find(a => a.id === appId);
      if (!app) return rejectWithValue('App no encontrada en mock');
      // Simular la estructura de una app comprada
      return { ...app, app_id: app.id, is_favorite: false, purchased_at: new Date().toISOString() };
    }
    // Si hay backend, llamar al endpoint real
    try {
      const response = await axios.post(`${API_URL}/apps/user/apps/${appId}/purchase`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.app;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al comprar app');
    }
  }
);

export const toggleFavoriteApp = createAsyncThunk(
  'apps/toggleFavoriteApp',
  async (appId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/apps/user/apps/${appId}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.app;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar favorito');
    }
  }
);

// Thunk para obtener todas las apps disponibles (con fallback a mock)
export const fetchAllApps = createAsyncThunk(
  'apps/fetchAllApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/apps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Si la respuesta es vacía, usar el mock
      if (!response.data.apps || response.data.apps.length === 0) {
        return MOCK_APPS_DATA;
      }
      return response.data.apps;
    } catch (error) {
      // Si hay error de red o backend, usar el mock
      return MOCK_APPS_DATA;
    }
  }
);

// Estado inicial
const initialState = {
  allApps: [],
  purchasedApps: [],
  favoriteApps: [],
  loading: false,
  error: null,
};

// Acciones asíncronas
export const fetchApps = createAsyncThunk(
  'apps/fetchApps',
  async (_, { rejectWithValue }) => {
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Extraer categorías únicas
      const categories = ['All', ...Array.from(new Set(MOCK_APPS_DATA.map(app => app.category)))];
      
      return { apps: MOCK_APPS_DATA, categories };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar las apps');
    }
  }
);

export const fetchAppDetails = createAsyncThunk(
  'apps/fetchAppDetails',
  async (appId, { rejectWithValue }) => {
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const app = MOCK_APPS_DATA.find(a => a.id === appId);
      
      if (!app) {
        return rejectWithValue('App no encontrada');
      }
      
      return app;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar los detalles de la app');
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
        state.favoriteApps = action.payload;
      })
      .addCase(fetchFavoriteApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Purchase app
      .addCase(purchaseApp.fulfilled, (state, action) => {
        state.purchasedApps.push(action.payload);
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
          state.favoriteApps.push(action.payload);
        } else {
          state.favoriteApps = state.favoriteApps.filter(app => app.app_id !== action.payload.app_id && app.id !== action.payload.app_id);
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
export const selectAllApps = (state) => state.apps.allApps;

export default appsSlice.reducer; 