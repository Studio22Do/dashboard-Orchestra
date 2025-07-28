import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton,
  useTheme,
  Alert,
  CircularProgress,
  styled,
  Divider,
  Chip
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Email, Person } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { registerUser, registerWithGoogle, selectAuth, clearErrors } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import { VALIDATION, MESSAGES, APP_CONFIG } from '../../config/constants';
import useGoogleAuth from '../../hooks/useGoogleAuth';

// Componentes estilizados para el nuevo diseño
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: '#837CF3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#837CF3',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#837CF3',
  borderRadius: 12,
  padding: '12px 0',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#9256E2',
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4285F4',
  color: 'white',
  borderRadius: 12,
  padding: '12px 0',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  '&:hover': {
    backgroundColor: '#3367D6',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
  },
}));

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(selectAuth);
  const { isGoogleLoaded, signInWithGoogle } = useGoogleAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_CONFIG.ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // Limpiar errores al montar/desmontar
  useEffect(() => {
    dispatch(clearErrors());
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al cambiar los campos
    if (error) {
      dispatch(clearErrors());
    }
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name.trim()) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.NAME_REQUIRED,
        type: 'error'
      }));
      return false;
    }
    
    if (name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
      dispatch(addNotification({
        message: `El nombre debe tener al menos ${VALIDATION.NAME_MIN_LENGTH} caracteres`,
        type: 'error'
      }));
      return false;
    }
    
    if (!email.trim()) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.EMAIL_REQUIRED,
        type: 'error'
      }));
      return false;
    }
    
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.INVALID_EMAIL,
        type: 'error'
      }));
      return false;
    }
    
    if (!password) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.PASSWORD_REQUIRED,
        type: 'error'
      }));
      return false;
    }
    
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.PASSWORD_TOO_SHORT,
        type: 'error'
      }));
      return false;
    }
    
    if (password !== confirmPassword) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.PASSWORDS_DONT_MATCH,
        type: 'error'
      }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const { name, email, password } = formData;
    
    // Enviar acción de registro
    const resultAction = await dispatch(registerUser({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password 
    }));
    
    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(addNotification({
        message: MESSAGES.SUCCESS.REGISTRATION,
        type: 'success'
      }));
      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        navigate(APP_CONFIG.ROUTES.LOGIN);
      }, 2000);
    }
  };

  const handleGoogleRegister = async () => {
    if (!isGoogleLoaded) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.GOOGLE_OAUTH_ERROR,
        type: 'error'
      }));
      return;
    }

    if (!APP_CONFIG.GOOGLE_CLIENT_ID) {
      dispatch(addNotification({
        message: 'Google OAuth no está configurado en el sistema',
        type: 'error'
      }));
      return;
    }

    // Usar el hook para manejar Google OAuth
    signInWithGoogle();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #05041B 0%, #7A62BA 100%)',
        p: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <img src="/maestro.png" alt="Logo Sympho" style={{ width: 250, marginBottom: 16 }} />
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
          Crear Cuenta
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Únete a nuestra plataforma de herramientas digitales
        </Typography>
      </Box>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Registro con Google */}
        <GoogleButton
          fullWidth
          variant="contained"
          onClick={handleGoogleRegister}
          disabled={loading || !isGoogleLoaded}
          startIcon={
            <Box
              component="img"
              src="/google.svg"
              alt="Google"
              sx={{
                width: 20,
                height: 20,
                
              }}
            />
          }
          sx={{
            mb: 2,
            boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)',
          }}
        >
          {!isGoogleLoaded ? 'Cargando Google...' : 'Continuar con Google'}
        </GoogleButton>

        {/* Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Divider sx={{ flex: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Chip 
            label="o" 
            sx={{ 
              mx: 2, 
              bgcolor: 'transparent', 
              color: 'rgba(255, 255, 255, 0.7)',
              border: 'none'
            }} 
          />
          <Divider sx={{ flex: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        </Box>

        {/* Formulario de registro */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box>
            <Typography sx={{ mb: 1, color: 'white' }}>Nombre completo</Typography>
            <StyledTextField
              fullWidth
              placeholder="Ingresa tu nombre completo"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                inputProps: {
                  style: { padding: '16px' }
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: 'white' }}>Correo electrónico</Typography>
            <StyledTextField
              fullWidth
              placeholder="Ingresa tu correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                inputProps: {
                  style: { padding: '16px' }
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: 'white' }}>Contraseña</Typography>
            <StyledTextField
              fullWidth
              placeholder="Crea una contraseña segura"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                inputProps: {
                  style: { padding: '16px' }
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography sx={{ mb: 1, color: 'white' }}>Confirmar contraseña</Typography>
            <StyledTextField
              fullWidth
              placeholder="Confirma tu contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                inputProps: {
                  style: { padding: '16px' }
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              boxShadow: '0 4px 10px rgba(131, 124, 243, 0.3)',
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Crear Cuenta'}
          </StyledButton>
        </Box>

        {/* Link al login */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link 
              to={APP_CONFIG.ROUTES.LOGIN}
              style={{ 
                color: '#837CF3', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              Iniciar Sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register; 