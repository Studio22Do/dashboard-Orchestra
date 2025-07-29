import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  notifications: [],
  drawer: {
    open: true,
  },
  modals: {
    profileModal: false,
    settingsModal: false,
  },
  theme: localStorage.getItem('theme') || 'light',
  density: (() => {
    const savedDensity = localStorage.getItem('density');
    const validDensities = ['compacta', 'normal', 'amplia'];
    return validDensities.includes(savedDensity) ? savedDensity : 'normal';
  })(), // compacta, normal, amplia
  loading: {
    global: false,
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notificaciones
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        duration: 5000, // duración por defecto: 5 segundos
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Drawer
    toggleDrawer: (state) => {
      state.drawer.open = !state.drawer.open;
    },
    setDrawerOpen: (state, action) => {
      state.drawer.open = action.payload;
    },
    
    // Modales
    openModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals[modalName] !== undefined) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const { modalName } = action.payload;
      if (state.modals[modalName] !== undefined) {
        state.modals[modalName] = false;
      }
    },
    
    // Tema
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    // Densidad
    setDensity: (state, action) => {
      state.density = action.payload;
      localStorage.setItem('density', action.payload);
    },
    cycleDensity: (state) => {
      const densities = ['compacta', 'normal', 'amplia'];
      const currentIndex = densities.indexOf(state.density);
      const nextIndex = (currentIndex + 1) % densities.length;
      state.density = densities[nextIndex];
      localStorage.setItem('density', state.density);
    },
    
    // Loading
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  toggleDrawer,
  setDrawerOpen,
  openModal,
  closeModal,
  toggleTheme,
  setTheme,
  setDensity,
  cycleDensity,
  setGlobalLoading,
} = uiSlice.actions;

// Selectores
export const selectNotifications = (state) => state.ui.notifications;
export const selectDrawerOpen = (state) => state.ui.drawer.open;
export const selectModals = (state) => state.ui.modals;
export const selectTheme = (state) => state.ui.theme;
export const selectDensity = (state) => state.ui.density;
export const selectGlobalLoading = (state) => state.ui.loading.global;

export default uiSlice.reducer; 