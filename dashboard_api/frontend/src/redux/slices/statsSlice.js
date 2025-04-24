import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Datos de ejemplo para estadísticas
const MOCK_STATS_DATA = {
  appUsage: [
    { id: 'instagram', name: 'Instagram Statistics', count: 245, color: '#E1306C' },
    { id: 'weather', name: 'Weather Forecast', count: 186, color: '#4A90E2' },
    { id: 'currency', name: 'Currency Converter', count: 125, color: '#5CB85C' },
    { id: 'stocks', name: 'Stock Market', count: 98, color: '#F7A35C' }
  ],
  totalApps: 6,
  totalQueries: 654,
  apiCalls: {
    thisWeek: 432,
    lastWeek: 389,
    percentChange: 11
  },
  activeUsers: 18,
  lastUpdated: new Date().toISOString()
};

// Estado inicial
const initialState = {
  appUsage: [],
  totalApps: 0,
  totalQueries: 0,
  apiCalls: {
    thisWeek: 0,
    lastWeek: 0,
    percentChange: 0
  },
  activeUsers: 0,
  lastUpdated: null,
  loading: false,
  error: null,
};

// Acciones asíncronas
export const fetchDashboardStats = createAsyncThunk(
  'stats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      // Simular una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return MOCK_STATS_DATA;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar las estadísticas');
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
        state.appUsage = action.payload.appUsage;
        state.totalApps = action.payload.totalApps;
        state.totalQueries = action.payload.totalQueries;
        state.apiCalls = action.payload.apiCalls;
        state.activeUsers = action.payload.activeUsers;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStats } = statsSlice.actions;

export const selectStats = (state) => state.stats;
export const selectAppUsage = (state) => state.stats.appUsage;
export const selectApiCalls = (state) => state.stats.apiCalls;
export const selectActiveUsers = (state) => state.stats.activeUsers;
export const selectTotalApps = (state) => state.stats.totalApps;
export const selectTotalQueries = (state) => state.stats.totalQueries;
export const selectLastUpdated = (state) => state.stats.lastUpdated;
export const selectStatsLoading = (state) => state.stats.loading;
export const selectStatsError = (state) => state.stats.error;

export default statsSlice.reducer; 