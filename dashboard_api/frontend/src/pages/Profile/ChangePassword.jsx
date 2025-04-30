import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { 
  changePassword, 
  selectAuth, 
  clearErrors, 
  clearPasswordChangeStatus 
} from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, passwordChangeSuccess } = useAppSelector(selectAuth);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Limpiar estados al montar/desmontar
  useEffect(() => {
    dispatch(clearErrors());
    dispatch(clearPasswordChangeStatus());
    
    // Limpiar al desmontar
    return () => {
      dispatch(clearErrors());
      dispatch(clearPasswordChangeStatus());
    };
  }, [dispatch]);
  
  // Efecto para manejar éxito en el cambio de contraseña
  useEffect(() => {
    if (passwordChangeSuccess) {
      dispatch(addNotification({
        message: 'Contraseña actualizada correctamente',
        type: 'success'
      }));
      
      // Limpiar formulario
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Opcional: redirigir después de un tiempo
      const timer = setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [passwordChangeSuccess, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al cambiar
    if (error) {
      dispatch(clearErrors());
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica client-side
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      dispatch(addNotification({
        message: 'Todos los campos son obligatorios',
        type: 'error'
      }));
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      dispatch(addNotification({
        message: 'Las contraseñas nuevas no coinciden',
        type: 'error'
      }));
      return;
    }
    
    if (formData.newPassword.length < 6) {
      dispatch(addNotification({
        message: 'La contraseña debe tener al menos 6 caracteres',
        type: 'error'
      }));
      return;
    }
    
    // Enviar solicitud de cambio de contraseña
    await dispatch(changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4, px: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Cambiar Contraseña
        </Typography>
      </Box>
      
      <Card>
        <CardContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {passwordChangeSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Contraseña actualizada correctamente. Redirigiendo...
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Contraseña Actual"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              type={showPasswords.current ? 'text' : 'password'}
              fullWidth
              required
              disabled={loading || passwordChangeSuccess}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                      disabled={loading || passwordChangeSuccess}
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              label="Nueva Contraseña"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              type={showPasswords.new ? 'text' : 'password'}
              fullWidth
              required
              disabled={loading || passwordChangeSuccess}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                      disabled={loading || passwordChangeSuccess}
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showPasswords.confirm ? 'text' : 'password'}
              fullWidth
              required
              disabled={loading || passwordChangeSuccess}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                      disabled={loading || passwordChangeSuccess}
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined"
                onClick={() => navigate('/profile')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || passwordChangeSuccess}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword; 