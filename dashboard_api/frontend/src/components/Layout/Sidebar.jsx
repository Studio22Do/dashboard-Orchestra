import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { 
  Dashboard, 
  Apps, 
  Instagram, 
  Analytics, 
  TrendingUp, 
  MonetizationOn, 
  YouTube,
  Transform,
  Language
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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

// Logo estilizado
const LogoWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginBottom: theme.spacing(3),
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

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Apps', icon: <Apps />, path: '/apps' },
  { text: 'Instagram Stats', icon: <Instagram />, path: '/apps/instagram' },
  { text: 'Google Trends', icon: <TrendingUp />, path: '/apps/trends' },
  { text: 'Google Paid Search', icon: <MonetizationOn />, path: '/apps/paid-search' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'YouTube Media', icon: <YouTube />, path: '/youtube-media' },
  { text: 'File Converter', icon: <Transform />, path: '/file-converter' },
  { text: 'Web & SEO', icon: <Language />, path: '/apps?preselectedCategory=Web & SEO' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent">
      <LogoWrapper>
        <Typography 
          variant="h3" 
      sx={{
            fontWeight: 600, 
            fontSize: '2rem',
            color: 'white',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Sympho.
        </Typography>
      </LogoWrapper>
      
      <List>
        {menuItems.map((item) => (
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
      </List>
    </StyledDrawer>
  );
};

export default Sidebar; 