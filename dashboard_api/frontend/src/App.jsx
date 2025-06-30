import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import EmailVerification from './pages/Login/EmailVerification';
import AppCatalog from './pages/AppCatalog/AppCatalog';
import InstagramStats from './pages/InstagramStats/InstagramStats';
import InstagramRealtime from './pages/InstagramRealtime';
import ScrapTik from './pages/ScrapTik';
import YouTubeMedia from './pages/YouTubeMedia/YouTubeMedia';
import FileConverter from './pages/FileConverter/FileConverter';
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
import SSLChecker from './pages/SSLChecker/SSLChecker';
import WebsiteStatus from './pages/WebsiteStatus/WebsiteStatus';
import UrlShortener from './pages/UrlShortener/UrlShortener';
import SeoAnalyzer from './pages/SeoAnalyzer/SeoAnalyzer';
import SimilarWebInsights from './pages/SimilarWebInsights/SimilarWebInsights';
import GoogleKeywordInsights from './pages/GoogleKeywordInsights/GoogleKeywordInsights';
import DomainMetrics from './pages/DomainMetrics/DomainMetrics';
import AhrefsRankChecker from './pages/AhrefsRankChecker/AhrefsRankChecker';
import PageSpeedInsights from './pages/PageSpeedInsights/PageSpeedInsights';
import ProductDescriptionGenerator from './pages/ProductDescriptionGenerator/ProductDescriptionGenerator';
import SeoMastermind from './pages/SEOMastermind/SEOMastermind';
import MidjourneyExperience from './pages/MidjourneyExperience/MidjourneyExperience';
import WordCount from './pages/WordCount/WordCount';
import PdfToText from './pages/PdfToText/PdfToText';
import SnapVideo from './pages/SnapVideo/SnapVideo';
import OpenAITextToSpeech from './pages/OpenAITextToSpeech/OpenAITextToSpeech';
import GenieAI from './pages/GenieAI/GenieAI';
import AISocialMediaContent from './pages/AISocialMediaContent/AISocialMediaContent';
import AdvancedImageManipulation from './pages/AdvancedImageManipulation/AdvancedImageManipulation';
import WhisperFromURL from './pages/WhisperFromURL/WhisperFromURL';
import RunwayML from './pages/RunwayML/RunwayML';
import AIHumanizer from './pages/AIHumanizer/AIHumanizer';
import CategoryView from './pages/CategoryView/CategoryView';
import ImageOptimizer from './pages/ImageOptimizer/ImageOptimizer';
import theme from './theme';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import PRLabsDashboard from './pages/PRLabs/Dashboard';
import PRLabsChat from './pages/PRLabs/Chat';
import PRLabsImage from './pages/PRLabs/Image';
import PRLabsText from './pages/PRLabs/Text';
import PRLabsVoice from './pages/PRLabs/Voice';
import PRLabsChatbot from './pages/PRLabs/Chatbot';
import PRLabsTools from './pages/PRLabs/Tools';

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
      default: '#1a1625', // Actualizado al color de fondo oscuro
      paper: '#272038',   // Actualizado para las tarjetas
      dark: '#14121e',    // Versión más oscura
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
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif", // Ahora usando Poppins
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      fontSize: '0.95rem',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    body2: {
      fontSize: '0.85rem',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 500,
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
          backgroundColor: '#272038',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(131, 124, 242, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#272038',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1625',
          borderBottom: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
});

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  // const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }
  return <Layout>{children}</Layout>;
};

function App() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectTheme);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Forzar estado de autenticación a true para desarrollo
  useEffect(() => {
    // Establecer autenticación a true aunque no haya token
      // dispatch(setAuth(true));
  }, [dispatch]);
  
  // Crear tema basado en el modo seleccionado
  const theme = createAppTheme(themeMode);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Mostrar Login solo si no está autenticado */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login />
            }
          />
          
          {/* Ruta de registro */}
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Register />
            }
          />
          
          {/* Ruta de verificación de email */}
          <Route
            path="/verify-email"
            element={
              isAuthenticated ? <Navigate to="/" /> : <EmailVerification />
            }
          />
          
          {/* Rutas públicas de recuperación de contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
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

          <Route path="/youtube-media" element={
            <ProtectedRoute>
              <YouTubeMedia />
            </ProtectedRoute>
          } />
          
          <Route path="/file-converter" element={
            <ProtectedRoute>
              <FileConverter />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/ssl-checker" element={
            <ProtectedRoute>
              <SSLChecker />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/website-status" element={
            <ProtectedRoute>
              <WebsiteStatus />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/url-shortener" element={
            <ProtectedRoute>
              <UrlShortener />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/seo-analyzer" element={
            <ProtectedRoute>
              <SeoAnalyzer />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/similar-web" element={
            <ProtectedRoute>
              <SimilarWebInsights />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/keyword-insights" element={
            <ProtectedRoute>
              <GoogleKeywordInsights />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/domain-metrics" element={
            <ProtectedRoute>
              <DomainMetrics />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/ahrefs-rank" element={
            <ProtectedRoute>
              <AhrefsRankChecker />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/page-speed" element={
            <ProtectedRoute>
              <PageSpeedInsights />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/product-description" element={
            <ProtectedRoute>
              <ProductDescriptionGenerator />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/seo-mastermind" element={
            <ProtectedRoute>
              <SeoMastermind />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/midjourney" element={
            <ProtectedRoute>
              <MidjourneyExperience />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/word-count" element={
            <ProtectedRoute>
              <WordCount />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/pdf-to-text" element={
            <ProtectedRoute>
              <PdfToText />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/snap-video" element={
            <ProtectedRoute>
              <SnapVideo />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/openai-text-to-speech" element={
            <ProtectedRoute>
              <OpenAITextToSpeech />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/genie-ai" element={
            <ProtectedRoute>
              <GenieAI />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/ai-social-media" element={
            <ProtectedRoute>
              <AISocialMediaContent />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/advanced-image" element={
            <ProtectedRoute>
              <AdvancedImageManipulation />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/whisper-url" element={
            <ProtectedRoute>
              <WhisperFromURL />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/runway-ml" element={
            <ProtectedRoute>
              <RunwayML />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/ai-humanizer" element={
            <ProtectedRoute>
              <AIHumanizer />
            </ProtectedRoute>
          } />
          
          <Route path="/category" element={
            <ProtectedRoute>
              <CategoryView />
            </ProtectedRoute>
          } />
          
          <Route path="/apps/image-optimizer" element={
            <ProtectedRoute>
              <ImageOptimizer />
            </ProtectedRoute>
          } />
          
          {/* PR Labs Routes */}
          <Route path="/prlabs" element={<ProtectedRoute><PRLabsDashboard /></ProtectedRoute>} />
          <Route path="/prlabs/chat" element={<ProtectedRoute><PRLabsChat /></ProtectedRoute>} />
          <Route path="/prlabs/image" element={<ProtectedRoute><PRLabsImage /></ProtectedRoute>} />
          <Route path="/prlabs/text" element={<ProtectedRoute><PRLabsText /></ProtectedRoute>} />
          <Route path="/prlabs/voice" element={<ProtectedRoute><PRLabsVoice /></ProtectedRoute>} />
          <Route path="/prlabs/chatbot" element={<ProtectedRoute><PRLabsChatbot /></ProtectedRoute>} />
          <Route path="/prlabs/tools" element={<ProtectedRoute><PRLabsTools /></ProtectedRoute>} />
          
        </Routes>
        <NotificationManager />
      </Router>
    </ThemeProvider>
  );
}

export default App;
