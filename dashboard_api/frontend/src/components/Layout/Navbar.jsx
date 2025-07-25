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
  ViewCompact
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { logoutUser, selectUser } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import NotificationBell from '../NotificationBell/NotificationBell';

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
        <Title>
          Marketing Intelligence Console
        </Title>
        <IconGroup>
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
            <MenuItem>
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