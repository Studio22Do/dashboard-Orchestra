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
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Notifications, 
  Settings, 
  AccountCircle, 
  Lock, 
  Logout,
  Search
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { logoutUser, selectUser } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';

// AppBar estilizado con colores del diseño
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1a1625', // Fondo oscuro como en la imagen
  borderBottom: 'none',
  boxShadow: 'none',
  position: 'sticky',
  zIndex: theme.zIndex.drawer + 1,
}));

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
  
  // Estado para controlar el menú de usuario
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Estado para búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  
  // Controladores de eventos para el menú
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
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
    <StyledAppBar>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            color: 'white',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Marketing Intelligence Console
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          maxWidth: '800px',
          mx: 'auto',
          px: 2
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: { xs: 'none', md: 'block' } }}>
            Explora nuestra colección de aplicaciones que utilizan APIs de RapidAPI
          </Typography>
          
          <SearchField
            placeholder="Buscar Apps..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="medium" sx={{ color: 'white' }}>
            <Notifications />
          </IconButton>
          <IconButton size="medium" sx={{ color: 'white' }}>
            <Settings />
          </IconButton>
          
          {/* Avatar con menú desplegable */}
          <Avatar 
            onClick={handleOpenMenu}
            sx={{ 
              width: 36, 
              height: 36,
              cursor: 'pointer',
              bgcolor: '#837CF3', // Color morado claro
              '&:hover': { opacity: 0.9 }
            }}
          >
            {getUserInitials()}
          </Avatar>
          
          {/* Menú de usuario */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 3,
              sx: { 
                minWidth: 180,
                mt: 1,
                backgroundColor: '#242424',
                color: 'white'
              }
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.name || 'Usuario'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user?.email || 'usuario@ejemplo.com'}
              </Typography>
            </Box>
            
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <MenuItem onClick={() => handleMenuOption('profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            
            <MenuItem onClick={() => handleMenuOption('password')}>
              <ListItemIcon>
                <Lock fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </ListItemIcon>
              Cambiar Contraseña
            </MenuItem>
            
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <MenuItem onClick={() => handleMenuOption('logout')}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar; 