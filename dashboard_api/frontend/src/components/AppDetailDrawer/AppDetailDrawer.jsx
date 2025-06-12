import React from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseApp, selectPurchasedApps } from '../../redux/slices/appsSlice';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AppDetailDrawer = ({ 
  open = false, 
  onClose = () => {}, 
  app = null 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchasedApps = useSelector(selectPurchasedApps);

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

  const isPurchased = purchasedApps.some(a => a.id === id || a.app_id === id);

  const handleAction = () => {
    if (isPurchased) {
      navigate(route);
      onClose();
    } else {
      dispatch(purchaseApp(id));
      onClose();
    }
  };

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
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={title} 
                style={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 12, 
                  marginRight: 16,
                  objectFit: 'cover'
                }} 
              />
            )}
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{title}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>{description}</Typography>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
            Categoría: {category}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
            API: {apiName}
          </Typography>
          <Button
            variant={isPurchased ? 'contained' : 'outlined'}
            color={isPurchased ? 'primary' : 'success'}
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAction}
            autoFocus={false}
          >
            {isPurchased ? 'Abrir' : 'Agregar'}
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
    apiName: PropTypes.string
  })
};

export default AppDetailDrawer; 