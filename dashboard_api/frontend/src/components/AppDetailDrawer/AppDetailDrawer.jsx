import React, { useState } from 'react';
import { Drawer, Box, Typography, Button, Divider, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseApp, selectCanUseApp, selectUserRequests, selectPurchasedApps, fetchAllApps, fetchPurchasedApps } from '../../redux/slices/appsSlice';
import { selectCreditsBalance } from '../../redux/slices/creditsSlice';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Apps as DefaultAppIcon } from '@mui/icons-material';

const AppDetailDrawer = ({ 
  open = false, 
  onClose = () => {}, 
  app = null 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
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

  // Funciones para el botón
  const getButtonVariant = () => {
    if (isAlreadyInToolbox) return 'outlined';
    return canUseApp ? 'contained' : 'outlined';
  };

  const getButtonColor = () => {
    if (isAlreadyInToolbox) return 'success';
    return canUseApp ? 'primary' : 'secondary';
  };

  const getButtonText = () => {
    if (isAlreadyInToolbox) return 'Abrir App';
    return canUseApp ? 'Abrir App' : 'Agregar';
  };

  const handleAction = async () => {
    if (!app) return;

    try {
      if (isAlreadyInToolbox) {
        // Navegar a la app
        navigate(app.route);
        onClose();
      } else {
        // Comprar/agregar la app
        await dispatch(purchaseApp(app.id)).unwrap();
        setNotification({
          open: true,
          message: 'App agregada exitosamente',
          severity: 'success'
        });
        // Recargar apps
        dispatch(fetchAllApps());
        dispatch(fetchPurchasedApps());
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Error al procesar la solicitud',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

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
            background: '#1a1530', 
            color: 'white',
            '&:focus': {
              outline: 'none'
            }
          } 
        }}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true
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
              API: {apiName}
            </Typography>
            {process.env.REACT_APP_MODE === 'beta_v2' && (
              <Typography variant="subtitle2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
                Créditos disponibles: {userCredits}
              </Typography>
            )}
            {isAlreadyInToolbox && (
              <Typography variant="subtitle2" sx={{ mb: 2, color: '#4caf50', fontWeight: 600 }}>
                ✓ Ya está en tu toolbox
              </Typography>
            )}
            <Button
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