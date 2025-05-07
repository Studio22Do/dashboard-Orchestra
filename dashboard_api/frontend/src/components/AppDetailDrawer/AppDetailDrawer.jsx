import React from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { purchaseApp, selectPurchasedApps } from '../../redux/slices/appsSlice';
import { useNavigate } from 'react-router-dom';

const AppDetailDrawer = ({ open, onClose, app }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const purchasedApps = useSelector(selectPurchasedApps);
  if (!app) return null;

  const isPurchased = purchasedApps.some(a => a.id === app.id || a.app_id === app.id);

  const handleAction = () => {
    if (isPurchased) {
      navigate(app.route);
      onClose();
    } else {
      dispatch(purchaseApp(app.id));
      onClose();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400, p: 0, background: '#1a1530', color: 'white' } }}>
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
            {app.imageUrl && (
              <img src={app.imageUrl} alt={app.title} style={{ width: 56, height: 56, borderRadius: 12, marginRight: 16 }} />
            )}
            <Typography variant="h5" sx={{ fontWeight: 600 }}>{app.title}</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>{app.description}</Typography>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
            Categoría: {app.category}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
            API: {app.apiName}
          </Typography>
          <Button
            variant={isPurchased ? 'contained' : 'outlined'}
            color={isPurchased ? 'primary' : 'success'}
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleAction}
          >
            {isPurchased ? 'Abrir' : 'Agregar'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AppDetailDrawer; 