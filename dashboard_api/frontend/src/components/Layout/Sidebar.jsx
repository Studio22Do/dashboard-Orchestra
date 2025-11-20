import React, { useEffect } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import {
  Dashboard,
  Apps,
  Analytics
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/reduxHooks';
import { selectFavoriteApps, fetchFavoriteApps } from '../../redux/slices/appsSlice';
import StarIcon from '@mui/icons-material/Star';
import { selectUser } from '../../redux/slices/authSlice';

// Importar logos del dashboard para mantener consistencia
import picpulseicon from '../../assets/images/apps/icons/Picpulseicon.png';
import mediafyLogo from '../../assets/images/apps/icons/mediafyicon.png';
import perplexityLogo from '../../assets/images/apps/icons/perplexityicon.png';
import googleNewsLogo from '../../assets/images/apps/icons/googlenewsicon.png';
import wordCountLogo from '../../assets/images/apps/icons/wordcounticon.png';
import pdfToTextLogo from '../../assets/images/apps/icons/pdftotexticon.png';
import snapVideoLogo from '../../assets/images/apps/icons/snapvideoicon.png';
import genieAILogo from '../../assets/images/apps/icons/chatgpt4icon.png';
import aiSocialMediaLogo from '../../assets/images/apps/icons/contentcreatoricon.png';
import imageManipulationLogo from '../../assets/images/apps/icons/imagetransform-1.png';

import runwayMLLogo from '../../assets/images/apps/icons/runawayicon.png';
import prlabsLogo from '../../assets/images/apps/icons/chatgpt4icon.png';
import speechToTextLogo from '../../assets/images/apps/icons/speechtotexticon.png';
import qrGeneratorLogo from '../../assets/images/apps/icons/qrgeneratorcode.png';
import seoAnalyzerLogo from '../../assets/images/apps/icons/seoanalyzericon.png';
import similarWebLogo from '../../assets/images/apps/icons/similarwebicon.png';
import googleKeywordLogo from '../../assets/images/apps/icons/keywordinsightsicon.png';

import pageSpeedLogo from '../../assets/images/apps/icons/webauditicon.png';
import productDescriptionLogo from '../../assets/images/apps/icons/productdescriptionicon.png';
import sslCheckerLogo from '../../assets/images/apps/icons/SSLcheckericon.png';

import seoMastermindLogo from '../../assets/images/apps/icons/keywordsearchicon.png';
import whoisLookupLogo from '../../assets/images/apps/icons/Whoisicon.png';

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

// Mapeo de apps a logos del dashboard para mantener consistencia
const getAppIcon = (appId) => {
  const logoMap = {
    // Social Media & Content
    'instagram-stats': mediafyLogo,
    'ai-social-media': aiSocialMediaLogo,
    'social-media-content': aiSocialMediaLogo,

    // AI & Chat
    'genie-ai': genieAILogo,
    'perplexity': perplexityLogo,
    'prlabs': prlabsLogo,

    // Image & Video
    'picpulse': picpulseicon,
    'runwayml': runwayMLLogo,
    'snap-video': snapVideoLogo,
    'image-manipulation': imageManipulationLogo,
    'advanced-image': imageManipulationLogo,

    // Text & Documents
    'pdf-to-text': pdfToTextLogo,
    'word-count': wordCountLogo,
    'text-extract': wordCountLogo,
    'product-description': productDescriptionLogo,
    'ecommerce-description': productDescriptionLogo,

    // SEO & Analytics
    'seo-analyzer': seoAnalyzerLogo,
    'seo-mastermind': seoMastermindLogo,
    'similar-web': similarWebLogo,
    'google-keyword': googleKeywordLogo,

    'page-speed': pageSpeedLogo,



    // Google Services
    'google-news': googleNewsLogo,
    'google-keyword-insights': googleKeywordLogo,

    // Audio & Speech
    'speech-to-text': speechToTextLogo,

    'openai-tts': speechToTextLogo,

    // Security & Tools
    'ssl-checker': sslCheckerLogo,
    'whois-lookup': whoisLookupLogo,
    'qr-generator': qrGeneratorLogo,

    // File Conversion
    'file-converter': imageManipulationLogo,
    'file-converter-audio': speechToTextLogo,
    'file-converter-image': imageManipulationLogo,
    'file-converter-pdf': pdfToTextLogo,

    // Default fallback
    'default': <Apps />
  };

  return logoMap[appId] || logoMap['default'];
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const favoriteApps = useAppSelector(selectFavoriteApps);
  const user = useAppSelector(selectUser);

  // Obtener menú dinámico basado en el rol del usuario
  const getMenuItems = () => {
    const baseMenuItems = [
      { text: 'Apps', icon: <Dashboard />, path: '/' },
      { text: 'ToolBox', icon: <Apps />, path: '/apps' },
    ];

    // Solo mostrar Analytics para usuarios admin (con validación adicional)
    if (user && user.role && user.role === 'admin') {
      baseMenuItems.push({ text: 'Analytics', icon: <Analytics />, path: '/analytics' });
    }

    return baseMenuItems;
  };

  // Cargar apps favoritas cuando se monta el sidebar
  useEffect(() => {
    dispatch(fetchFavoriteApps());
  }, [dispatch]);

  // Remover duplicados basándose en app_id o id
  const uniqueFavoriteApps = favoriteApps.filter((app, index, self) => {
    const appId = app.app_id || app.id;
    return index === self.findIndex(a => (a.app_id || a.id) === appId);
  });

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Dashboard
        </Typography>
        <button
          onClick={() => navigate('/profile')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '4px 0',
            marginTop: '4px'
          }}
        >
          {user?.name || 'Usuario'}
        </button>
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Menú dinámico basado en rol */}
          {getMenuItems().map((item) => (
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
          {uniqueFavoriteApps.map((app) => {
            const appIcon = getAppIcon(app.app_id || app.id);
            const isImageIcon = typeof appIcon === 'string' || appIcon?.src;

            return (
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
                  {isImageIcon ? (
                    <img
                      src={appIcon}
                      alt={app.title}
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    appIcon
                  )}
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
            );
          })}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar; 