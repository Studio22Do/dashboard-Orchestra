import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import {
  NotificationsOutlined as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon,
  DoneAll as MarkReadIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

// Datos de ejemplo - Luego vendrán del Redux store
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'warning',
    title: 'Límite de uso',
    message: 'Has alcanzado el 80% de tu límite mensual de peticiones',
    timestamp: new Date(),
    read: false,
    category: 'usage'
  },
  {
    id: '2',
    type: 'info',
    title: 'Nueva funcionalidad',
    message: 'Se ha agregado soporte para nuevas APIs',
    timestamp: new Date(Date.now() - 86400000), // 1 día atrás
    read: true,
    category: 'system'
  }
];

const getIconByType = (type) => {
  switch (type) {
    case 'info':
      return <InfoIcon color="info" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'success':
      return <SuccessIcon color="success" />;
    default:
      return <InfoIcon />;
  }
};

const formatTimestamp = (date) => {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'Justo ahora';
};

const NotificationBell = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        aria-label={`${unreadCount} notificaciones sin leer`}
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            overflow: 'auto',
            mt: 1.5,
            backgroundColor: theme.palette.background.paper,
            '& .MuiDivider-root': {
              my: 1
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notificaciones</Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              title="Marcar todas como leídas"
            >
              <MarkReadIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              title="Borrar todas"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  button
                  onClick={() => handleNotificationClick(notification.id)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: notification.read ? 
                        alpha(theme.palette.primary.main, 0.05) : 
                        alpha(theme.palette.primary.main, 0.15)
                    }
                  }}
                >
                  <ListItemIcon>
                    {getIconByType(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell; 