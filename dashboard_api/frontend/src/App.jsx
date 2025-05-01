import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import AppCatalog from './pages/AppCatalog/AppCatalog';
import InstagramStats from './pages/InstagramStats/InstagramStats';
import InstagramRealtime from './pages/InstagramRealtime';
import ScrapTik from './pages/ScrapTik';
import GoogleTrends from './pages/GoogleTrends/GoogleTrends';
import GooglePaidSearch from './pages/GooglePaidSearch/GooglePaidSearch';
import Dashboard from './pages/Dashboard/Dashboard';
import NotificationManager from './components/Notifications/NotificationManager';
import { useAppDispatch, useAppSelector } from './redux/hooks/reduxHooks';
import { selectIsAuthenticated, setAuth } from './redux/slices/authSlice';
import { selectTheme } from './redux/slices/uiSlice';
import Analytics from './pages/Analytics/Analytics';
import Profile from './pages/Profile/Profile';
import ChangePassword from './pages/Profile/ChangePassword';

// Theme configuration function
const createAppTheme = (mode) => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#837cf2', // Color morado principal
      light: '#a59ff5', // Versión más clara
      dark: '#6158d3', // Versión más oscura
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2196f3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a1a',
      paper: '#242424',
      dark: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    action: {
      active: '#837cf2',
      hover: 'rgba(131, 124, 242, 0.08)',
      selected: 'rgba(131, 124, 242, 0.16)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#837cf2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0 0 10px rgba(131, 124, 242, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #6158d3 30%, #837cf2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #837cf2 30%, #a59ff5 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#242424',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(131, 124, 242, 0.2)',
            borderColor: '#837cf2',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#242424',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
});

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  
  // Verificar si hay token guardado en localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setAuth(true));
    }
  }, [dispatch]);
  
  // Crear tema basado en el modo seleccionado
  const theme = createAppTheme(themeMode);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/apps" element={
            <ProtectedRoute>
              <AppCatalog />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/instagram" element={
            <ProtectedRoute>
              <InstagramStats />
            </ProtectedRoute>
          } />
          
          <Route path="/instagram-realtime" element={
            <ProtectedRoute>
              <InstagramRealtime />
            </ProtectedRoute>
          } />
          
          <Route path="/tiktok" element={
            <ProtectedRoute>
              <ScrapTik />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/trends" element={
            <ProtectedRoute>
              <GoogleTrends />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/paid-search" element={
            <ProtectedRoute>
              <GooglePaidSearch />
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          
          {/* Rutas de perfil de usuario */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
        </Routes>
        <NotificationManager />
      </Router>
    </ThemeProvider>
  );
}

export default App;
