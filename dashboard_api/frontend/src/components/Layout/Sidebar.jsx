import React, { useEffect } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import {
  Dashboard,
  Apps,
  Analytics,
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
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/reduxHooks';
import { selectFavoriteApps, fetchFavoriteApps } from '../../redux/slices/appsSlice';
import StarIcon from '@mui/icons-material/Star';
import { selectUser } from '../../redux/slices/authSlice';

const DRAWER_WIDTH = 240;

// Drawer estilizado con el fondo morado oscuro
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#2d1b69', // Color morado oscuro como en la imagen
    color: 'white',
    borderRight: 'none',
  },
}));

// Botón de navegación estilizado
const NavButton = styled(ListItemButton)(({ theme }) => ({
  margin: '4px 16px',
  borderRadius: 8,
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
}));

const staticMenuItems = [
  { text: 'Apps', icon: <Dashboard />, path: '/' },
  { text: 'ToolBox', icon: <Apps />, path: '/apps' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
];

// Mapeo de apps a iconos específicos
const getAppIcon = (appId) => {
  const iconMap = {
    'instagram-stats': <Instagram />,
    'instagram-realtime': <Instagram />,
    'google-news': <Article />,
    'google-keyword': <TrendingUp />,
    'google-review-link': <Link />,
    'google-trends': <TrendingUp />,
    'google-paid-search': <Paid />,
    'speech-to-text': <Mic />,
    'openai-tts': <RecordVoiceOver />,
    'whisper-url': <RecordVoiceOver />,
    'image-manipulation': <Image />,
    'ai-humanizer': <Psychology />,
    'ai-social-media': <ContentCopy />,
    'website-status': <Visibility />,
    'domain-metrics': <Assessment />,
    'genie-ai': <SmartToy />,
    'page-speed': <Speed />,
    'pdf-to-text': <PictureAsPdf />,
    'picpulse': <AutoAwesome />,
    'runwayml': <VideoLibrary />,
    'seo-analyzer': <Build />,
    'seo-mastermind': <Functions />,
    'similar-web': <Assessment />,
    'prlabs': <SmartToy />,
    'snap-video': <VideoLibrary />,
    'ssl-checker': <Security />,
    'whois-lookup': <Dns />,
    'word-count': <TextSnippet />,
    'ecommerce-description': <ShoppingCart />,
    'product-description': <ShoppingCart />,
    'advanced-image': <Image />,
    'social-media-content': <ContentCopy />,
    'file-converter': <Transform />,
    'qr-generator': <QrCode />,
    'text-extract': <TextFields />,
    'website-analyzer': <Assessment />,
    'ahrefs-dr': <TrendingUp />,
    'midjourney': <AutoAwesome />,
    'youtube-media': <YouTube />,
    'scraptik': <VideoLibrary />,
    'file-converter-audio': <MusicNote />,
    'file-converter-image': <Image />,
    'file-converter-pdf': <PictureAsPdf />,
    'file-converter-rar': <Cloud />,
  };
  
  return iconMap[appId] || <Apps />; // Icono por defecto
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const favoriteApps = useAppSelector(selectFavoriteApps) || [];
  // const user = useAppSelector(selectUser); // Ya no se usa aquí

  // Cargar apps favoritas cuando se monta el sidebar
  useEffect(() => {
    console.log('Cargando apps favoritas desde Sidebar...');
    dispatch(fetchFavoriteApps());
  }, [dispatch]);

  // Debug: mostrar información de las apps favoritas
  useEffect(() => {
    console.log('Sidebar - Favorite apps:', favoriteApps);
    console.log('Sidebar - Favorite apps length:', favoriteApps.length);
    if (favoriteApps.length > 0) {
      console.log('Sidebar - Favorite apps IDs:', favoriteApps.map(app => app.app_id || app.id));
    }
  }, [favoriteApps]);

  // Remover duplicados basándose en app_id o id
  const uniqueFavoriteApps = favoriteApps.filter((app, index, self) => {
    const appId = app.app_id || app.id;
    return index === self.findIndex(a => (a.app_id || a.id) === appId);
  });

  console.log('Sidebar - Unique favorite apps:', uniqueFavoriteApps.length);

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
          tabIndex={0}
          aria-label="Ir a inicio"
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
        >
          <img src="/maestro.png" alt="Logo Sympho" style={{ width: 120, marginBottom: 16, display: 'block' }} />
        </button>
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Menú estático siempre visible */}
          {staticMenuItems.map((item) => (
            <NavButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255, 255, 255, 0.7)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 400
                }}
              />
            </NavButton>
          ))}

          {/* Apps favoritas dinámicas */}
          {uniqueFavoriteApps.length > 0 && (
            <Box sx={{ mt: 3, mb: 2, px: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Favoritos
                </Typography>
              </Box>
              <Box sx={{ 
                height: '1px', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                mb: 2 
              }} />
            </Box>
          )}
          {uniqueFavoriteApps.map((app) => (
            <NavButton
              key={app.app_id || app.id}
              onClick={() => navigate(app.route)}
              selected={location.pathname === app.route}
              sx={{ 
                margin: '2px 16px',
                '& .MuiListItemIcon-root': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  minWidth: 36
                }
              }}
            >
              <ListItemIcon>
                {getAppIcon(app.app_id || app.id)}
              </ListItemIcon>
              <ListItemText 
                primary={app.title}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: location.pathname === app.route ? 600 : 400,
                  lineHeight: 1.2
                }}
              />
            </NavButton>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar; 