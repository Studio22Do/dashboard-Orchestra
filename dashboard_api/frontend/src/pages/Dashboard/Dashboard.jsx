import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Avatar,
  LinearProgress,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  People,
  Apps as AppsIcon,
  Notifications,
  Speed,
  MoreVert,
  KeyboardArrowRight,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/reduxHooks';
import { 
  fetchDashboardStats, 
  selectAppUsage, 
  selectApiCalls, 
  selectTotalApps, 
  selectTotalQueries, 
  selectActiveUsers, 
  selectLastUpdated,
  selectStatsLoading
} from '../../redux/slices/statsSlice';

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Seleccionar datos del estado
  const appUsage = useAppSelector(selectAppUsage);
  const apiCalls = useAppSelector(selectApiCalls);
  const totalApps = useAppSelector(selectTotalApps);
  const totalQueries = useAppSelector(selectTotalQueries);
  const activeUsers = useAppSelector(selectActiveUsers);
  const lastUpdated = useAppSelector(selectLastUpdated);
  const loading = useAppSelector(selectStatsLoading);
  
  // Cargar datos al montar
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="500">
          Dashboard
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" color="text.secondary" mr={1}>
            Última actualización: {formatDate(lastUpdated) || 'Cargando...'}
          </Typography>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <CalendarToday fontSize="small" />
          </Avatar>
        </Box>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Llamadas a API
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={60} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                ) : (
                  <Typography variant="h4" fontWeight="medium">
                    {apiCalls?.thisWeek || 0}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" mt={0.5}>
                  <TrendingUp fontSize="small" />
                  <Typography variant="body2" ml={0.5}>
                    +{apiCalls?.percentChange || 0}% vs. semana anterior
                  </Typography>
                </Box>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  p: 1
                }}
              >
                <Speed />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'success.light',
              color: 'success.contrastText',
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Apps Disponibles
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={60} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                ) : (
                  <Typography variant="h4" fontWeight="medium">
                    {totalApps}
                  </Typography>
                )}
                <Typography variant="body2" mt={0.5}>
                  {totalQueries} consultas totales
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  p: 1
                }}
              >
                <AppsIcon />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'warning.light',
              color: 'warning.contrastText', 
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Usuarios Activos
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width={60} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                ) : (
                  <Typography variant="h4" fontWeight="medium">
                    {activeUsers}
                  </Typography>
                )}
                <Typography variant="body2" mt={0.5}>
                  En las últimas 24 horas
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  p: 1
                }}
              >
                <People />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'info.light',
              color: 'info.contrastText',
              height: '100%'
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Notificaciones
                </Typography>
                <Typography variant="h4" fontWeight="medium">
                  3
                </Typography>
                <Typography variant="body2" mt={0.5}>
                  2 nuevas desde ayer
                </Typography>
              </Box>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  p: 1
                }}
              >
                <Notifications />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Uso de Apps y Quick Access */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Uso de APIs</Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            ) : (
              appUsage.map((app, index) => (
                <Box key={app.id} mb={index < appUsage.length - 1 ? 2 : 0}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2">{app.name}</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {app.count} llamadas
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(app.count / Math.max(...appUsage.map(a => a.count))) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: app.color,
                      },
                    }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" mb={2}>
              Acceso Rápido
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box>
              {[
                { name: 'Instagram Statistics', route: '/apps/instagram', color: '#E1306C', icon: '📊' },
                { name: 'Catálogo de Apps', route: '/apps', color: '#2196f3', icon: '📱' },
                { name: 'Mi Perfil', route: '/profile', color: '#5CB85C', icon: '👤' },
              ].map((item, index) => (
                <Card 
                  key={index} 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    borderLeft: '4px solid',
                    borderColor: item.color,
                    '&:last-child': { mb: 0 }
                  }}
                >
                  <CardActionArea onClick={() => navigate(item.route)}>
                    <CardContent sx={{ py: 1.5 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <Typography variant="h5" mr={1.5} component="span">
                            {item.icon}
                          </Typography>
                          <Typography variant="body1">
                            {item.name}
                          </Typography>
                        </Box>
                        <KeyboardArrowRight color="action" />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 