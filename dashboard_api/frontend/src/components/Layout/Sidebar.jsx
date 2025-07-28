import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import {
  Dashboard,
  Apps,
  Analytics
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { selectFavoriteApps } from '../../redux/slices/appsSlice';
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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const favoriteApps = useAppSelector(selectFavoriteApps) || [];
  // const user = useAppSelector(selectUser); // Ya no se usa aquí

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
          {favoriteApps.length > 0 && (
            <Box sx={{ mt: 2, mb: 1, px: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Favoritos
              </Typography>
            </Box>
          )}
          {favoriteApps.map((app) => (
            <NavButton
              key={app.app_id || app.id}
              onClick={() => navigate(app.route)}
              selected={location.pathname === app.route}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#FFD700' }}>
                <StarIcon />
              </ListItemIcon>
              <ListItemText 
                primary={app.title}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === app.route ? 600 : 400
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