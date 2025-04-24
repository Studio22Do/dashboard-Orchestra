import { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/reduxHooks';
import { selectNotifications, removeNotification } from '../../redux/slices/uiSlice';

const NotificationManager = () => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  // Auto-eliminación de notificaciones
  useEffect(() => {
    if (notifications.length > 0) {
      const { id, duration } = notifications[0];
      const timer = setTimeout(() => {
        dispatch(removeNotification(id));
      }, duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  const { id, message, type, duration } = notifications[0];

  return (
    <Snackbar
      open={true}
      autoHideDuration={duration || 5000}
      onClose={() => handleClose(id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => handleClose(id)}
        severity={type || 'info'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationManager; 