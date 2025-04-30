import { Box, Card, CardContent, Typography, Avatar, Divider, Button } from '@mui/material';
import { useAppSelector } from '../../redux/hooks/reduxHooks';
import { selectUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  // Función para obtener iniciales
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>
      
      <Card sx={{ mb: 4, overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3
              }}
            >
              {getUserInitials()}
            </Avatar>
            
            <Box>
              <Typography variant="h5" gutterBottom>
                {user?.name || 'Usuario'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email || 'usuario@ejemplo.com'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Rol: {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile/change-password')}
              sx={{ mr: 2 }}
            >
              Cambiar Contraseña
            </Button>
            
            <Button
              variant="contained"
              onClick={() => alert('Esta funcionalidad se implementará próximamente')}
            >
              Editar Perfil
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile; 