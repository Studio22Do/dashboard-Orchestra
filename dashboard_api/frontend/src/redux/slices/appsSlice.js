import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_MODE = process.env.REACT_APP_MODE || 'beta_v1';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = `${API_URL}/${API_MODE}`;

// Datos de ejemplo para las apps (simulamos datos que vendrían del backend)
const MOCK_APPS_DATA = [
  // Social Listening
  {
    id: 'google-news',
    title: 'Google News API',
    description: 'Accede a noticias en tiempo real de todo el mundo con filtros por categoría e idioma',
    imageUrl: 'https://cdn.pixabay.com/photo/2015/11/03/09/03/google-1018443_960_720.jpg',
    category: 'Social Listening',
    route: '/apps/google-news',
    apiName: 'Google News API'
  },
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
    id: 'google-trends',
    title: 'Google Trends',
    description: 'Analiza tendencias de búsqueda en Google y obtén insights valiosos',
    imageUrl: 'https://cdn.pixabay.com/photo/2015/11/03/09/03/google-1018443_960_720.jpg',
    category: 'Social Listening',
    route: '/apps/trends',
    apiName: 'Google Trends API'
  },
  {
    id: 'instagram-realtime',
    title: 'Instagram Realtime',
    description: 'Monitorea en tiempo real la actividad de Instagram, hashtags y menciones',
    imageUrl: 'https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_960_720.jpg',
    category: 'Social Listening',
    route: '/instagram-realtime',
    apiName: 'Instagram Realtime API'
  },
  // Creative & Content
  {
    id: 'word-count',
    title: 'Word Count',
    description: 'Analiza y cuenta palabras, caracteres y párrafos en tus textos',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/word-count',
    apiName: 'Word Count API'
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text',
    description: 'Convierte documentos PDF a texto editable',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/pdf-to-text',
    apiName: 'PDF to Text API'
  },
  {
    id: 'snap-video',
    title: 'Snap Video',
    description: 'Crea y edita videos cortos con efectos y filtros',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/snap-video',
    apiName: 'Snap Video API'
  },
  {
    id: 'genie-ai',
    title: 'GenieAI',
    description: 'Asistente de IA basado en ChatGPT-3 para diversas tareas',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/genie-ai',
    apiName: 'GenieAI API'
  },
  {
    id: 'ai-social-media',
    title: 'AI Social Media',
    description: 'Genera contenido optimizado para redes sociales usando IA',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/ai-social-media',
    apiName: 'AI Social Media API'
  },
  {
    id: 'image-manipulation',
    title: 'Image Manipulation',
    description: 'Herramientas avanzadas para edición y manipulación de imágenes',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/advanced-image',
    apiName: 'Image Manipulation API'
  },
  {
    id: 'whisper-url',
    title: 'Whisper URL',
    description: 'Transcribe audio desde URLs usando el modelo Whisper',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/whisper-url',
    apiName: 'Whisper API'
  },
  {
    id: 'runwayml',
    title: 'RunwayML',
    description: 'Plataforma de IA para generación y edición de contenido multimedia',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/runway-ml',
    apiName: 'RunwayML API'
  },
  {
    id: 'prlabs',
    title: 'PR Labs',
    description: 'Suite de herramientas de IA para generación de texto e imágenes',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/prlabs',
    apiName: 'PR Labs API'
  },
  {
    id: 'speech-to-text',
    title: 'Speech to Text AI',
    description: 'Transcribe audio y video desde múltiples fuentes usando IA avanzada',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Creative & Content',
    route: '/apps/speech-to-text',
    apiName: 'Speech to Text AI'
  },
  // Web & SEO
  {
    id: 'similar-web',
    title: 'Similar Web Insights',
    description: 'Obtén insights detallados sobre el tráfico web y la competencia',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/similar-web',
    apiName: 'Similar Web API'
  },
  {
    id: 'google-keyword',
    title: 'Keyword Insights',
    description: 'Analiza palabras clave y tendencias de búsqueda',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/keyword-insights',
    apiName: 'Google Keyword API'
  },
  {
    id: 'domain-metrics',
    title: 'Domain Metrics',
    description: 'Verifica métricas y salud de dominios web',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/domain-metrics',
    apiName: 'Domain Metrics API'
  },
  {
    id: 'page-speed',
    title: 'Website Speed Test',
    description: 'Analiza la velocidad de carga y rendimiento de cualquier sitio web con métricas precisas',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/page-speed',
    apiName: 'Website Speed Test API'
  },
  {
    id: 'ecommerce-description',
    title: 'Product Description Generator',
    description: 'Genera descripciones optimizadas para productos de eCommerce',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/product-description',
    apiName: 'Product Description API'
  },
  {
    id: 'ssl-checker',
    title: 'SSL Checker',
    description: 'Verifica el estado y validez de certificados SSL',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/ssl-checker',
    apiName: 'SSL Checker API'
  },
  {
    id: 'website-status',
    title: 'Website Status',
    description: 'Monitorea el estado y disponibilidad de sitios web',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/website-status',
    apiName: 'Website Status API'
  },
  {
    id: 'seo-mastermind',
    title: 'SEO Mastermind',
    description: 'Genera keywords, meta tags y títulos optimizados con IA',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/seo-mastermind',
    apiName: 'SEO Mastermind API'
  },
  {
    id: 'whois-lookup',
    title: 'WHOIS Lookup Service',
    description: 'Consulta información detallada de registro para dominios, direcciones IP y números ASN',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/whois-lookup',
    apiName: 'WHOIS Lookup API'
  },
  {
    id: 'seo-analyzer',
    title: 'SEO Analyzer',
    description: 'Analiza y optimiza el SEO de tu sitio web con recomendaciones detalladas',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_960_720.jpg',
    category: 'Web & SEO',
    route: '/apps/seo-analyzer',
    apiName: 'SEO Analyzer API'
  }
];

// Thunks
export const fetchPurchasedApps = createAsyncThunk(
  'apps/fetchPurchasedApps',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/apps/user/apps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si no hay apps compradas o hay error, retornar todas las apps mock
      if (!response.data.apps || response.data.apps.length === 0) {
        return MOCK_APPS_DATA;
      }
      
      return response.data.apps;
    } catch (error) {
      // En caso de error, retornar todas las apps mock
      return MOCK_APPS_DATA;
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
    
    // Si estamos en modo mock o beta_v1, simular la compra
    if (isMockMode() || process.env.REACT_APP_MODE === 'beta_v1') {
      // Buscar la app en el mock o en allApps
      const app = MOCK_APPS_DATA.find(a => a.id === appId) || state.apps.allApps.find(a => a.id === appId);
      if (!app) return rejectWithValue('App no encontrada');
      
      // Simular la estructura de una app comprada
      return { 
        ...app, 
        app_id: app.id, 
        is_favorite: false, 
        purchased_at: new Date().toISOString() 
      };
    }
    
    // Si hay backend, llamar al endpoint real
    try {
      const response = await axios.post(`${API_BASE_URL}/apps/user/apps/${appId}/purchase`, {}, {
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
      const response = await axios.post(`${API_BASE_URL}/apps/user/apps/${appId}/favorite`, {}, {
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
      const response = await axios.get(`${API_BASE_URL}/apps`, {
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
  purchasedApps: JSON.parse(localStorage.getItem('purchasedApps') || '[]'),
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
export const selectAllApps = (state) => state.apps.allApps || state.apps.apps || [];

export default appsSlice.reducer; 