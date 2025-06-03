import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks/reduxHooks';
import { registerWithGoogle } from '../redux/slices/authSlice';
import { addNotification } from '../redux/slices/uiSlice';
import { APP_CONFIG, MESSAGES } from '../config/constants';

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si Google OAuth está cargado
  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
      } else {
        // Reintentar después de un tiempo
        setTimeout(checkGoogleLoaded, 1000);
      }
    };

    checkGoogleLoaded();
  }, []);

  // Inicializar Google OAuth cuando esté disponible
  useEffect(() => {
    if (isGoogleLoaded && APP_CONFIG.GOOGLE_CLIENT_ID) {
      try {
        window.google.accounts.id.initialize({
          client_id: APP_CONFIG.GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (error) {
        console.error('Error al inicializar Google OAuth:', error);
      }
    }
  }, [isGoogleLoaded]);

  // Manejar la respuesta de Google
  const handleGoogleResponse = useCallback(async (response) => {
    if (!response.credential) {
      dispatch(addNotification({
        message: 'No se recibieron credenciales de Google',
        type: 'error'
      }));
      return;
    }

    setIsLoading(true);
    
    try {
      // Decodificar el JWT para obtener información del usuario
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Enviar el token al backend
      const resultAction = await dispatch(registerWithGoogle({
        google_token: response.credential,
        user_info: {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        }
      }));
      
      if (registerWithGoogle.fulfilled.match(resultAction)) {
        dispatch(addNotification({
          message: MESSAGES.SUCCESS.GOOGLE_AUTH,
          type: 'success'
        }));
      }
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      dispatch(addNotification({
        message: 'Error al procesar la autenticación con Google',
        type: 'error'
      }));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Función para mostrar el popup de Google
  const signInWithGoogle = useCallback(() => {
    if (!isGoogleLoaded) {
      dispatch(addNotification({
        message: MESSAGES.ERROR.GOOGLE_OAUTH_ERROR,
        type: 'error'
      }));
      return;
    }

    if (!APP_CONFIG.GOOGLE_CLIENT_ID) {
      dispatch(addNotification({
        message: 'Google OAuth no está configurado',
        type: 'error'
      }));
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Mostrar el popup de One Tap si no se muestra automáticamente
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
            }
          );
        }
      });
    } catch (error) {
      console.error('Error al mostrar Google Sign-In:', error);
      dispatch(addNotification({
        message: 'Error al inicializar Google Sign-In',
        type: 'error'
      }));
    }
  }, [isGoogleLoaded, dispatch]);

  // Función para renderizar el botón de Google
  const renderGoogleButton = useCallback((elementId) => {
    if (!isGoogleLoaded || !APP_CONFIG.GOOGLE_CLIENT_ID) return;

    try {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: '100%',
          logo_alignment: 'left',
        }
      );
    } catch (error) {
      console.error('Error al renderizar botón de Google:', error);
    }
  }, [isGoogleLoaded]);

  return {
    isGoogleLoaded,
    isLoading,
    signInWithGoogle,
    renderGoogleButton,
  };
};

export default useGoogleAuth; 