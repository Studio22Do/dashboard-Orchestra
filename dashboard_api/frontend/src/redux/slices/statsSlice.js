import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axios';

// Estado inicial
const initialState = {
  metrics: {
    apiCalls: { value: '0', change: '0%', label: 'Llamadas API', icon: 'Speed' },
    activeUsers: { value: '0', change: '0%', label: 'Usuarios Activos', icon: 'People' },
    totalApps: { value: '0', change: '0', label: 'Apps Activas', icon: 'AppsIcon' },
    successRate: { value: '0%', change: '0%', label: 'Tasa de Éxito', icon: 'TrendingUp' },
  },
  usage: [],
  userMetrics: [],
  apiPerformance: [],
  loading: false,
  error: null,
};

// Acciones asíncronas
export const fetchDashboardStats = createAsyncThunk(
  'stats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/beta_v2/stats/dashboard');

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Error al cargar las estadísticas'
      );
    }
  }
);

// Slice
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStats: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics || state.metrics;
        state.usage = action.payload.usage || [];
        state.userMetrics = action.payload.userMetrics || [];
        state.apiPerformance = action.payload.apiPerformance || [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStats } = statsSlice.actions;

// Selectores
export const selectStats = (state) => state.stats;
export const selectMetrics = (state) => state.stats.metrics;
export const selectUsage = (state) => state.stats.usage;
export const selectUserMetrics = (state) => state.stats.userMetrics;
export const selectApiPerformance = (state) => state.stats.apiPerformance;
export const selectStatsLoading = (state) => state.stats.loading;
export const selectStatsError = (state) => state.stats.error;

export default statsSlice.reducer; 