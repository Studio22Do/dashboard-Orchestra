import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  styled,
  Paper
} from '@mui/material';
import { CheckCircle, Email, Refresh } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { verifyEmail, resendVerificationEmail, selectAuth, clearErrors } from '../../redux/slices/authSlice';
import { addNotification } from '../../redux/slices/uiSlice';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#837CF3',
  borderRadius: 12,
  padding: '12px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#9256E2',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: '2rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}));

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { loading, error, isAuthenticated } = useAppSelector(selectAuth);
  
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (token) {
      handleVerifyEmail(token);
    } else {
      setVerificationStatus('error');
    }
    
    dispatch(clearErrors());
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleVerifyEmail = async (token) => {
    try {
      const resultAction = await dispatch(verifyEmail({ token }));
      
      if (verifyEmail.fulfilled.match(resultAction)) {
        setVerificationStatus('success');
        dispatch(addNotification({
          message: '¡Email verificado exitosamente! Bienvenido.',
          type: 'success'
        }));
        
        // Redirigir al dashboard después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      setVerificationStatus('error');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      dispatch(addNotification({
        message: 'No se encontró el email para reenviar la verificación',
        type: 'error'
      }));
      return;
    }

    const resultAction = await dispatch(resendVerificationEmail({ email }));
    
    if (resendVerificationEmail.fulfilled.match(resultAction)) {
      dispatch(addNotification({
        message: 'Email de verificación reenviado. Revisa tu bandeja de entrada.',
        type: 'success'
      }));
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#837CF3', mb: 3 }} />
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Verificando tu email...
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Por favor espera mientras verificamos tu cuenta
          </Typography>
        </Box>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 3 }} />
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            ¡Email Verificado!
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
            Tu cuenta ha sido verificada exitosamente. Serás redirigido al dashboard en unos segundos.
          </Typography>
          <StyledButton
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Ir al Dashboard
          </StyledButton>
        </Box>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Email sx={{ fontSize: 80, color: '#f44336', mb: 3 }} />
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Error de Verificación
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
            El enlace de verificación es inválido o ha expirado.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {email && (
              <StyledButton
                onClick={handleResendVerification}
                disabled={loading}
                startIcon={<Refresh />}
              >
                Reenviar Verificación
              </StyledButton>
            )}
            <Button
              onClick={() => navigate('/login')}
              sx={{ 
                color: '#837CF3', 
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(131, 124, 243, 0.1)' }
              }}
            >
              Volver al Login
            </Button>
          </Box>
        </Box>
      );
    }

    return null;
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
        <img src="/maestro.png" alt="Logo Sympho" style={{ width: 200, marginBottom: 24 }} />
      </Box>
      
      <StyledPaper sx={{ maxWidth: 500, width: '100%' }}>
        {renderContent()}
      </StyledPaper>
    </Box>
  );
};

export default EmailVerification; 