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
    <StyledAppBar position="static">
      <NavbarContent>
        <Title>
          Marketing Intelligence Console
        </Title>
        <IconGroup>
          <IconButton size="medium" sx={{ color: 'white' }}>
            <Notifications />
          </IconButton>
          <IconButton size="medium" sx={{ color: 'white' }}>
            <Settings />
          </IconButton>
          <WhiteAvatar>
            <AccountCircle sx={{ fontSize: 30 }} />
          </WhiteAvatar>
        </IconGroup>
      </NavbarContent>
    </StyledAppBar>
  );
};

export default Navbar; 