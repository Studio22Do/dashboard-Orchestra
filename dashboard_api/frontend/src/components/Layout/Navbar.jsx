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
  Divider 
} from '@mui/material';
import { 
  Notifications, 
  Settings, 
  AccountCircle, 
  Lock, 
  Logout 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { logoutUser, selectUser } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  // Estado para controlar el menú de usuario
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
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
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, color: 'text.primary' }}
        >
          Sympho Console
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="large" color="default">
            <Notifications />
          </IconButton>
          <IconButton size="large" color="default">
            <Settings />
          </IconButton>
          
          {/* Avatar con menú desplegable */}
          <Avatar 
            onClick={handleOpenMenu}
            sx={{ 
              width: 40, 
              height: 40,
              cursor: 'pointer',
              bgcolor: 'primary.main',
              '&:hover': { opacity: 0.8 }
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
                mt: 1
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
            
            <Divider />
            
            <MenuItem onClick={() => handleMenuOption('profile')}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 