import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import AppCatalog from './pages/AppCatalog/AppCatalog';
import InstagramStats from './pages/InstagramStats/InstagramStats';
import Dashboard from './pages/Dashboard/Dashboard';
import NotificationManager from './components/Notifications/NotificationManager';
import { useAppDispatch, useAppSelector } from './redux/hooks/reduxHooks';
import { selectIsAuthenticated, setAuth } from './redux/slices/authSlice';
import { selectTheme } from './redux/slices/uiSlice';

// Theme configuration function
const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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

          <Route path="/analytics" element={
            <ProtectedRoute>
              <div>Analytics (Coming soon)</div>
            </ProtectedRoute>
          } />
        </Routes>
        <NotificationManager />
      </Router>
    </ThemeProvider>
  );
}

export default App;
