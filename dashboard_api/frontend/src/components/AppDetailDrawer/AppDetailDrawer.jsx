import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Box, Typography, Button, Divider, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectCanUseApp, selectUserRequests, selectPurchasedApps, fetchAllApps, fetchPurchasedApps } from '../../redux/slices/appsSlice';
import { selectCreditsBalance } from '../../redux/slices/creditsSlice';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Apps as DefaultAppIcon } from '@mui/icons-material';
import backgroundDrawer from '../../assets/images/apps/background/background-drawer.png';

const AppDetailDrawer = ({
  open = false,
  onClose = () => { },
  app = null
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const buttonRef = useRef(null);

  // Nueva lógica basada en requests
  const canUseApp = useSelector(state => selectCanUseApp(state, app?.id));
  const userRequests = useSelector(selectUserRequests);
  const purchasedApps = useSelector(selectPurchasedApps);
  const allApps = useSelector(state => state.apps.allApps);
  const appsLoading = useSelector(state => state.apps.loading);
  const appsError = useSelector(state => state.apps.error);
  const userCredits = useSelector(selectCreditsBalance);

  // Verificar si la app ya está en el toolbox (mover aquí arriba)
  const isAlreadyInToolbox = purchasedApps.some(purchasedApp =>
    purchasedApp.id === app?.id || purchasedApp.app_id === app?.id
  );

  // Extraer datos de la app
  const title = app?.title || 'App';
  const description = app?.description || 'Descripción no disponible';
  const category = app?.category || 'Sin categoría';
  const apiName = app?.api_name || 'API';
  const imageUrl = app?.image_url || app?.imageUrl;

  // Determinar si mostrar icono por defecto
  const shouldShowDefaultIcon = !imageUrl || imageError;

  // Obtener puntos requeridos basado en el ID de la app
  const getRequiredPoints = (appId) => {
    const pointsMap = {
      'whois-lookup': 1,
      'google-news': 1,
      'picpulse': 2,
      'mediafy-api': 1,
      'perplexity': 1,
      'advanced-image-manipulation': 1,

      'ai-social-media': 2,
      'ecommerce-description': 1,
      'seo-analyzer': 2,
      'chat-gpt-4': 1,
      'seo-keyword-research': 3,
      'website-status': 1,
      'qrcode-generator': 1,
      'text-extract': 1,
      'ssl-checker': 1,
      'domain-metrics': 1,
      'google-keyword': 3,
      'similar-web': 1,
      'runwayml': 3,
      'speech-to-text': 1,
      'snap-video': 1,
      'pdf-to-text': 1,
      'word-count': 2,
    };
    return pointsMap[appId] || 1;
  };

  const requiredPoints = getRequiredPoints(app?.id);

  // Funciones para el botón
  const getButtonVariant = () => {
    return 'contained';
  };

  const getButtonColor = () => {
    return 'primary';
  };

  const getButtonText = () => {
    return 'Abrir App';
  };

  const handleAction = async () => {
    if (!app) return;
    // Navegar directamente; el cobro lo maneja cada endpoint por puntos
    navigate(app.route);
    onClose();
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Manejar el foco correctamente para evitar warnings de accesibilidad
  useEffect(() => {
    if (open && buttonRef.current) {
      // Enfocar el botón cuando se abre el drawer
      setTimeout(() => buttonRef.current?.focus(), 100);
    } else if (!open) {
      // Remover el foco cuando se cierra el drawer
      if (document.activeElement === buttonRef.current) {
        buttonRef.current?.blur();
      }
    }
  }, [open]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 400,
            p: 0,
            background: `url(${backgroundDrawer})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            '&:focus': {
              outline: 'none'
            }
          }
        }}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 340 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {imageUrl && !imageError && (
                <img
                  src={imageUrl}
                  alt={title}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    marginRight: '16px',
                    objectFit: 'cover'
                  }}
                  onError={() => setImageError(true)}
                />
              )}
              {shouldShowDefaultIcon && (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    marginRight: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <DefaultAppIcon sx={{ fontSize: 32 }} />
                </Box>
              )}
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{description}</Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Categoría: {category}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Puntos requeridos: {requiredPoints}
            </Typography>
            {process.env.REACT_APP_MODE === 'beta_v2' && (
              <Typography variant="subtitle2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
                Puntos disponibles: {userCredits}
              </Typography>
            )}
            <Button
              ref={buttonRef}
              variant={getButtonVariant()}
              color={getButtonColor()}
              fullWidth
              disabled={appsLoading}
              sx={{ mt: 2 }}
              onClick={handleAction}
              autoFocus={false}
            >
              {appsLoading ? 'Procesando...' : getButtonText()}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

AppDetailDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  app: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    route: PropTypes.string,
    apiName: PropTypes.string,
  }),
};

export default AppDetailDrawer;