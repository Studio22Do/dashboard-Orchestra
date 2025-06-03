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
  styled
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { loginUser, selectAuth, clearErrors } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';
import { fetchPurchasedApps, fetchFavoriteApps } from '../../redux/slices/appsSlice';

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

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(selectAuth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;
    
    if (!email || !password) {
      dispatch(addNotification({
        message: 'Por favor completa todos los campos',
        type: 'error'
      }));
      return;
    }
    
    // Enviar acción de login
    const resultAction = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(resultAction)) {
      dispatch(addNotification({
        message: '¡Inicio de sesión exitoso!',
        type: 'success'
      }));
      // Fetch apps del usuario
      dispatch(fetchPurchasedApps());
      dispatch(fetchFavoriteApps());
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(180deg, #7A62BA 0%, #05041B 100%)', // Degradado claro arriba, oscuro abajo
        background: 'linear-gradient(180deg, #05041B 0%, #7A62BA 100%)', // Degradado oscuro arriba, claro abajo
        p: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <img src="/logo1.png" alt="Logo Sympho" style={{ width: 290, marginBottom: 24 }} />
      </Box>
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box>
          <Typography sx={{ mb: 1, color: 'white' }}>Correo</Typography>
          <StyledTextField
            fullWidth
            placeholder="Ingresa tu correo"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              inputProps: {
                style: { padding: '16px' }
              }
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ mb: 1, color: 'white' }}>Contraseña</Typography>
          <StyledTextField
            fullWidth
            placeholder="Ingresa tu contraseña"
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
          {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
        </StyledButton>

        {/* Link al registro */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#837CF3', 
                textDecoration: 'none', 
                fontWeight: 500 
              }}
            >
              Crear Cuenta
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login; 