import React, { useState } from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseApp, selectCanUseApp } from '../../redux/slices/appsSlice';
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
  
  // Nueva lógica basada en requests
  const canUseApp = useSelector(state => selectCanUseApp(state, app?.id));
  const userCredits = useSelector(selectCreditsBalance);

  // Reset image error when app changes
  React.useEffect(() => {
    setImageError(false);
  }, [app?.id]);

  if (!app) return null;

  const {
    id = '',
    title = 'Sin título',
    description = 'Sin descripción',
    imageUrl = '',
    category = 'Sin categoría',
    route = '/',
    apiName = 'Sin API'
  } = app;

  const handleAction = () => {
    if (canUseApp) {
      navigate(route);
      onClose();
    } else {
      // En beta_v2, mostrar plan o comprar requests
      dispatch(purchaseApp(id));
      onClose();
    }
  };

  const getButtonText = () => {
    if (canUseApp) {
      return 'Abrir';
    } else {
      return 'Agregar';
    }
  };

  const getButtonVariant = () => {
    return canUseApp ? 'contained' : 'outlined';
  };

  const getButtonColor = () => {
    return canUseApp ? 'primary' : 'success';
  };

  const shouldShowDefaultIcon = !imageUrl || imageError;

  return (
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
          <Button
            variant={getButtonVariant()}
            color={getButtonColor()}
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAction}
            autoFocus={false}
          >
            {getButtonText()}
          </Button>
        </Box>
      </Box>
    </Drawer>
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