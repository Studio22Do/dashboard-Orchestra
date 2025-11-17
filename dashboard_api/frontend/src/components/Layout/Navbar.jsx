import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Switch
} from '@mui/material';
import { 
  Settings, 
  AccountCircle, 
  Lock, 
  Logout,
  Search,
  Person,
  Palette,
  Language,
  ViewCompact,
  // Iconos para las aplicaciones
  Instagram,
  Google,
  YouTube,
  Description,
  Psychology,
  ChatBubble,
  Image,
  TextFields,
  Mic,
  SmartToy,
  Build,
  TrendingUp,
  Paid,
  Article,
  MusicNote,
  Transform,
  Security,
  Language as LanguageIcon,
  Dns,
  Analytics,
  Speed,
  ShoppingCart,
  Settings as SettingsIcon,
  Functions,
  PictureAsPdf,
  VideoLibrary,
  AutoAwesome,
  ContentCopy,
  Translate,
  Link,
  Assessment,
  Cloud,
  RecordVoiceOver,
  TextSnippet,
  ShortText,
  QrCode,
  Visibility
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { logoutUser, selectUser } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import NotificationBell from '../NotificationBell/NotificationBell';
import CreditsDisplay from '../CreditsDisplay/CreditsDisplay';
import wordCountLogo from '../../assets/images/apps/icons/wordcounticon.png';
import googleNewsLogo from '../../assets/images/apps/icons/googlenewsicon.png';
import perplexityLogo from '../../assets/images/apps/icons/perplexityicon.png';
import mediafyLogo from '../../assets/images/apps/icons/mediafyicon.png';
import picpulseLogo from '../../assets/images/apps/icons/Picpulseicon.png';
import snapVideoLogo from '../../assets/images/apps/icons/snapvideoicon.png';
import contentGeneratorLogo from '../../assets/images/apps/icons/contentcreatoricon.png';
import similarWebLogo from '../../assets/images/apps/icons/similarwebicon.png';
import speechToTextLogo from '../../assets/images/apps/icons/speechtotexticon.png';
import imageTransformLogo from '../../assets/images/apps/icons/imagetransform-1.png';
import sslCheckerLogo from '../../assets/images/apps/icons/SSLcheckericon.png';
import keywordSearchLogo from '../../assets/images/apps/icons/keywordsearchicon.png';

// AppBar estilizado con colores del diseño
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#231c36', // Morado oscuro
  boxShadow: 'none',
  borderBottom: 'none',
  height: 72, // Ajusta la altura
  justifyContent: 'center',
}));

const NavbarContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0 40px', // Padding horizontal generoso
  height: '72px',
});

const Title = styled(Typography)({
  color: '#fff',
  fontWeight: 400,
  fontSize: 22,
  letterSpacing: 0.5,
  fontFamily: 'inherit',
});

// Header dinámico con logo y título
const DynamicHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

const AppIcon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '& svg': {
    fontSize: 24,
  },
});

const AppTitle = styled(Typography)({
  color: '#fff',
  fontWeight: 500,
  fontSize: 20,
  letterSpacing: 0.3,
});

const AppSubtitle = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: 14,
  fontWeight: 400,
});

const IconGroup = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 18,
});

const WhiteAvatar = styled(Avatar)({
  backgroundColor: '#fff',
  color: '#231c36',
  width: 40,
  height: 40,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  cursor: 'pointer',
});

// Campo de búsqueda estilizado
const SearchField = styled(TextField)(({ theme }) => ({
  maxWidth: '500px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
    color: 'white',
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  // Estados para los menús
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const open = Boolean(anchorEl);
  const settingsOpen = Boolean(settingsAnchor);
  
  // Estados para las configuraciones
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Datos de las aplicaciones con iconos específicos
  const getAppData = (pathname) => {
    const appsData = {
      '/': {
        title: 'Marketing Intelligence Console',
        icon: null,
        subtitle: null
      },
      '/apps': {
        title: 'Catálogo de Apps',
        icon: null,
        subtitle: null
      },
      '/analytics': {
        title: 'Analytics',
        icon: Analytics,
        subtitle: null
      },
      '/prlabs': {
        title: 'sinfonIA AI Suite',
        icon: Psychology,
        subtitle: 'Suite completa de herramientas de IA'
      },
      '/prlabs/chat': {
        title: 'sinfonIA Chat',
        icon: ChatBubble,
        subtitle: 'Chat inteligente con IA'
      },
      '/prlabs/image': {
        title: 'sinfonIA Image Generation',
        icon: Image,
        subtitle: 'Generación de imágenes con IA'
      },
      '/prlabs/text': {
        title: 'sinfonIA Text Processing',
        icon: TextFields,
        subtitle: 'Procesamiento de texto inteligente'
      },
      '/prlabs/voice': {
        title: 'sinfonIA Voice Features',
        icon: Mic,
        subtitle: 'Funciones de voz con IA'
      },
      '/prlabs/chatbot': {
        title: 'sinfonIA Custom Chatbots',
        icon: SmartToy,
        subtitle: 'Chatbots personalizados'
      },
      '/prlabs/tools': {
        title: 'sinfonIA AI Tools',
        icon: Build,
        subtitle: 'Herramientas de IA avanzadas'
      },
      '/apps/instagram': {
        title: 'Instagram Statistics',
        icon: Instagram,
        subtitle: 'API de estadísticas de Instagram'
      },
      '/apps/mediafy': {
        title: 'Mediafy',
        icon: null,
        image: mediafyLogo,
        subtitle: 'Análisis completo de Instagram'
      },
      '/apps/perplexity': {
        title: 'Perplexity',
        icon: null,
        image: perplexityLogo,
        subtitle: 'API de búsqueda inteligente'
      },

      '/apps/google-trends': {
        title: 'Google Trends',
        icon: TrendingUp,
        subtitle: 'Tendencias de búsqueda'
      },
      '/apps/google-paid-search': {
        title: 'Google Paid Search',
        icon: Paid,
        subtitle: 'Búsqueda de pago'
      },
      '/apps/google-news': {
        title: 'Google News',
        icon: null,
        image: googleNewsLogo,
        subtitle: 'Noticias en tiempo real'
      },
      '/apps/tiktok': {
        title: 'ScrapTik Analytics',
        icon: MusicNote,
        subtitle: 'Análisis de TikTok'
      },
      '/apps/youtube-media': {
        title: 'YouTube Media Downloader',
        icon: YouTube,
        subtitle: 'Descarga de medios'
      },
      '/apps/file-converter': {
        title: 'All-in-One File Converter',
        icon: Transform,
        subtitle: 'Conversor de archivos'
      },
      '/apps/ssl-checker': {
        title: 'SSL Checker',
        icon: null,
        image: sslCheckerLogo,
        subtitle: 'Verificación de certificados SSL'
      },
      '/apps/website-status': {
        title: 'Website Status',
        icon: LanguageIcon,
        subtitle: 'Estado de sitios web'
      },
      '/apps/whois-lookup': {
        title: 'WHOIS',
        icon: Dns,
        subtitle: 'Consulta de información de dominio'
      },
      '/apps/seo-analyzer': {
        title: 'SEO Analyzer',
        icon: Analytics,
        subtitle: 'Análisis de SEO'
      },
      '/apps/similar-web': {
        title: 'SimilarWeb',
        icon: null,
        image: similarWebLogo,
        subtitle: 'Análisis de competencia'
      },
      '/apps/keyword-insights': {
        title: 'Keyword Insights',
        icon: Google,
        subtitle: 'Análisis de palabras clave'
      },
      '/apps/domain-metrics': {
        title: 'Domain Metrics',
        icon: Assessment,
        subtitle: 'Métricas de dominio'
      },
      '/apps/page-speed': {
        title: 'Page Speed Insights',
        icon: Speed,
        subtitle: 'Análisis de velocidad'
      },
      '/apps/product-description': {
        title: 'Product Description',
        icon: ShoppingCart,
        subtitle: 'Generador de descripciones'
      },
      '/apps/seo-mastermind': {
        title: 'Keyword Search',
        icon: null,
        image: keywordSearchLogo,
        subtitle: 'Generador de keywords y meta tags'
      },
      '/apps/word-count': {
        title: 'Word Count',
        icon: null,
        image: wordCountLogo,
        subtitle: 'Contador de palabras'
      },
      '/apps/pdf-to-text': {
        title: 'PDF to Text',
        icon: PictureAsPdf,
        subtitle: 'Conversor de PDF a texto'
      },
      '/apps/snap-video': {
        title: 'SnapVideo',
        icon: null,
        image: snapVideoLogo,
        subtitle: 'Descarga de medios'
      },
      '/apps/genie-ai': {
        title: 'ChatGPT4',
        icon: AutoAwesome,
        subtitle: 'ChatGPT4'
      },
      '/apps/ai-social-media': {
        title: 'Content Generator',
        icon: null,
        image: contentGeneratorLogo,
        subtitle: 'Generador de contenido'
      },
      '/apps/advanced-image': {
        title: 'Image Transform',
        icon: null,
        image: imageTransformLogo,
        subtitle: 'Manipulación avanzada de imágenes'
      },
      '/apps/picpulse': {
        title: 'PicPulse',
        icon: null,
        image: picpulseLogo,
        subtitle: 'Análisis de imágenes'
      },
      '/apps/whisper-url': {
        title: 'Whisper from URL',
        icon: Cloud,
        subtitle: 'Transcripción de audio'
      },
      '/apps/runway-ml': {
        title: 'Runway',
        icon: Psychology,
        subtitle: 'Plataforma de IA multimedia'
      },
      '/apps/speech-to-text': {
        title: 'Speech to Text',
        icon: null,
        image: speechToTextLogo,
        subtitle: 'Conversión de voz a texto'
      },
      '/apps/ai-humanizer': {
        title: 'AI Humanizer',
        icon: Translate,
        subtitle: 'Humanización de texto con IA'
      },
      '/apps/url-shortener': {
        title: 'URL Shortener',
        icon: Link,
        subtitle: 'Acortador de URLs'
      },
      '/apps/ahrefs-rank': {
        title: 'Ahrefs Rank Checker',
        icon: Assessment,
        subtitle: 'Verificación de ranking'
      },
      '/profile': {
        title: 'Mi Perfil',
        icon: Person,
        subtitle: null
      },
      '/login': {
        title: 'Iniciar Sesión',
        icon: null,
        subtitle: null
      },
      '/register': {
        title: 'Registro',
        icon: null,
        subtitle: null
      },
      '/verify-email': {
        title: 'Verificar Email',
        icon: null,
        subtitle: null
      },
      '/forgot-password': {
        title: 'Recuperar Contraseña',
        icon: null,
        subtitle: null
      },
      '/reset-password': {
        title: 'Restablecer Contraseña',
        icon: null,
        subtitle: null
      }
    };

    // Buscar la ruta exacta primero
    if (appsData[pathname]) {
      return appsData[pathname];
    }

    // Si no encuentra la ruta exacta, buscar rutas que contengan el pathname
    for (const [route, data] of Object.entries(appsData)) {
      if (pathname.startsWith(route) && route !== '/') {
        return data;
      }
    }

    // Si no encuentra nada, devolver el título por defecto
    return {
      title: 'Marketing Intelligence Console',
      icon: null,
      subtitle: null
    };
  };

  // Obtener los datos de la aplicación actual
  const currentApp = getAppData(location.pathname);
  
  // Controladores para el menú de usuario
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Controladores para el menú de configuración
  const handleSettingsOpen = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  // Manejadores de configuración
  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí iría la lógica para cambiar el tema
    dispatch(addNotification({
      message: `Tema cambiado a ${!isDarkMode ? 'oscuro' : 'claro'}`,
      type: 'info'
    }));
  };

  const handleLanguageChange = () => {
    // Aquí iría la lógica para cambiar el idioma
    dispatch(addNotification({
      message: 'Cambio de idioma próximamente',
      type: 'info'
    }));
  };

  // Manejador de opciones del menú
  const handleMenuOption = (option) => {
    handleCloseMenu();
    
    switch (option) {
      case 'profile':
        navigate('/profile');
        break;
      case 'password':
        navigate('/profile/change-password');
        break;
      case 'logout':
        dispatch(logoutUser())
          .then(() => {
            dispatch(addNotification({
              message: 'Sesión cerrada exitosamente',
              type: 'success'
            }));
            navigate('/login');
          });
        break;
      default:
        break;
    }
  };

  // Obtener iniciales del usuario para mostrar en el Avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <StyledAppBar position="static">
      <NavbarContent>
        <DynamicHeader>
          {(currentApp.icon || currentApp.image) && (
            <AppIcon
              sx={
                currentApp.image
                  ? { backgroundColor: 'transparent', p: 0 }
                  : undefined
              }
            >
              {currentApp.image ? (
                <Box
                  component="img"
                  src={currentApp.image}
                  alt={`${currentApp.title} logo`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <currentApp.icon />
              )}
            </AppIcon>
          )}
          <Box>
            <AppTitle>
              {currentApp.title}
            </AppTitle>
            {currentApp.subtitle && (
              <AppSubtitle>
                {currentApp.subtitle}
              </AppSubtitle>
            )}
          </Box>
        </DynamicHeader>
        <IconGroup>
          <CreditsDisplay />
          <NotificationBell />
          <IconButton 
            size="medium" 
            sx={{ color: 'white' }}
            onClick={handleSettingsOpen}
          >
            <Settings />
          </IconButton>
          <WhiteAvatar onClick={handleOpenMenu}>
            {getUserInitials()}
          </WhiteAvatar>

          {/* Menú de Usuario existente */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleMenuOption('profile')}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={() => handleMenuOption('password')}>
              <ListItemIcon>
                <Lock fontSize="small" />
              </ListItemIcon>
              Cambiar Contraseña
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleMenuOption('logout')}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>

          {/* Nuevo Menú de Configuración */}
          <Menu
            anchorEl={settingsAnchor}
            open={settingsOpen}
            onClose={handleSettingsClose}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 280,
                maxHeight: 400,
                overflow: 'auto',
              },
            }}
          >
            {/* Sección de Apariencia */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Apariencia
              </Typography>
            </Box>
            <MenuItem onClick={handleThemeChange}>
              <ListItemIcon>
                <Palette fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Tema"
                secondary={isDarkMode ? "Modo Oscuro" : "Modo Claro"}
              />
              <Switch checked={isDarkMode} />
            </MenuItem>
            
            <MenuItem onClick={handleLanguageChange}>
              <ListItemIcon>
                <Language fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Idioma"
                secondary="Español"
              />
            </MenuItem>

            {/* Sección de Interfaz */}
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Interfaz
              </Typography>
            </Box>
            <MenuItem onClick={handleSettingsClose}>
              <ListItemIcon>
                <ViewCompact fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Densidad"
                secondary="Normal"
              />
            </MenuItem>
          </Menu>
        </IconGroup>
      </NavbarContent>
    </StyledAppBar>
  );
};

export default Navbar; 