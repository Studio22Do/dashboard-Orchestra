import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,

  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Tooltip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  Speed,
  People,
  Apps as AppsIcon,
  Assessment,
  Timeline,

  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,

  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';
import MetricCard from './components/MetricCard';
import UsageChart from './components/UsageChart';
import UsageChartModal from './components/UsageChartModal';
import ApiPerformance from './components/ApiPerformance';
import UserMetrics from './components/UserMetrics';
import { useAppSelector, useAppDispatch } from '../../redux/hooks/reduxHooks';
import { selectUser } from '../../redux/slices/authSlice';
import { 
  selectMetrics, 
  selectUsage, 
  selectUserMetrics, 
  selectApiPerformance,
  selectStatsLoading, 
  selectStatsError,
  fetchDashboardStats 
} from '../../redux/slices/statsSlice';

const AnalyticsContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: '#272038',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1530 0%, #272038 100%)',
  borderRadius: 16,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #837cf2, #6a4c93, #837cf2)',
  },
}));

const MetricsGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
}));



const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status === 'Operativo' ? '#4caf50' : 
                  status === 'Advertencia' ? '#ff9800' : 
                  status === 'Error' ? '#f44336' : '#2196f3',
  color: 'white',
  fontWeight: 600,
  '& .MuiChip-label': {
    color: 'white',
  },
}));

const Analytics = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const metrics = useAppSelector(selectMetrics);
  const usage = useAppSelector(selectUsage);
  const userMetrics = useAppSelector(selectUserMetrics);
  const apiPerformance = useAppSelector(selectApiPerformance);
  const loading = useAppSelector(selectStatsLoading);
  const error = useAppSelector(selectStatsError);

  const [openApiModal, setOpenApiModal] = useState(false);
  const [openMetricsModal, setOpenMetricsModal] = useState(false);
  const [openUsageModal, setOpenUsageModal] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, user]);

  // Si no hay usuario, mostrar mensaje de permisos
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          No tienes permisos para ver esta sección
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Si crees que esto es un error, contacta con el administrador del sistema.
        </Typography>
      </Container>
    );
  }

  // Mostrar loading
  if (loading) {
    return (
      <AnalyticsContainer maxWidth="xl">
        <LoadingContainer>
          <CircularProgress size={60} />
        </LoadingContainer>
      </AnalyticsContainer>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <AnalyticsContainer maxWidth="xl">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </AnalyticsContainer>
    );
  }

  // Mapear los iconos desde strings a componentes
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Speed': Speed,
      'People': People,
      'AppsIcon': AppsIcon,
      'TrendingUp': TrendingUp,
    };
    return iconMap[iconName] || Speed;
  };

  // Determinar si es admin/superadmin
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');



  const getStatusIcon = (status) => {
    switch (status) {
      case 'Operativo':
        return <CheckCircle sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'Advertencia':
        return <Warning sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'Error':
        return <Error sx={{ color: '#f44336', fontSize: 16 }} />;
      default:
        return <Info sx={{ color: '#2196f3', fontSize: 16 }} />;
    }
  };

  return (
    <AnalyticsContainer maxWidth="xl" sx={{ mt: 3 }}>
      {/* Header mejorado para admin/superadmin */}
      {isAdmin ? (
        <HeaderSection>
          <Box display="flex" alignItems="center" mb={2}>
            <AnalyticsIcon sx={{ color: '#837cf2', mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                Dashboard de Analytics
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                Vista general de todas las métricas del sistema
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">Panel de Control</Typography>
            </Box>
            <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Última actualización: {new Date().toLocaleString('es-ES')}
            </Typography>
          </Box>
        </HeaderSection>
      ) : (
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
            Mis Estadísticas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Resumen de tu actividad y uso de herramientas
          </Typography>
        </Box>
      )}

      {/* Estado del Sistema - Versión compacta para admin/superadmin */}
      {isAdmin && apiPerformance && apiPerformance.length > 0 && (
        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center">
                  <Speed sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Estado de las APIs
                  </Typography>
                </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenApiModal(true)}
                    sx={{ 
                      color: '#837cf2', 
                      borderColor: '#837cf2',
                      '&:hover': { borderColor: '#AC9DFB' }
                    }}
                  >
                    Ver Todas ({apiPerformance.length})
                  </Button>
                </Box>
                
                {/* Resumen compacto */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Badge 
                      badgeContent={apiPerformance.filter(api => api.status === 'Operativo').length} 
                      color="success"
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}
                    >
                  <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        backgroundColor: '#4caf50',
                    display: 'flex', 
                    alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 1
                      }}>
                        <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </Badge>
                    <Typography variant="body2" color="text.secondary">
                      Operativas
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Badge 
                      badgeContent={apiPerformance.filter(api => api.status === 'Sin datos').length} 
                      color="warning"
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}
                    >
                    <Box sx={{ 
                        width: 40, 
                        height: 40, 
                      borderRadius: '50%', 
                        backgroundColor: '#ff9800',
                    display: 'flex', 
                    alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 1
                      }}>
                        <Warning sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    </Badge>
                    <Typography variant="body2" color="text.secondary">
                      Sin Datos
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#837cf2', fontWeight: 700 }}>
                      {metrics.successRate?.value || '0%'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Éxito
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Box display="flex" alignItems="center">
                  <TrendingUp sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      Resumen del Sistema
                  </Typography>
                </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenMetricsModal(true)}
                    sx={{ 
                      color: '#837cf2', 
                      borderColor: '#837cf2',
                      '&:hover': { borderColor: '#AC9DFB' },
                      ml: 2
                    }}
                  >
                    Ver Métricas
                  </Button>
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, px: 1 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#837cf2', fontWeight: 700 }}>
                      {metrics.apiCalls?.value || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Llamadas
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: '#6a4c93', fontWeight: 700 }}>
                      {metrics.totalApps?.value || '0'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aplicaciones
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Vista General - Métricas principales compactas */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <SectionTitle variant="h5" component="h2" sx={{ color: 'white', mb: 0, fontWeight: 600 }}>
        {isAdmin ? 'Vista General del Sistema' : 'Mi Actividad'}
      </SectionTitle>
        </Box>
      
        <Grid container spacing={4}>
          {Object.entries(metrics).map(([key, metric]) => {
            // Para usuarios normales, mostrar solo métricas personales
            if (!isAdmin && (key === 'activeUsers' || key === 'totalApps')) {
              return null;
            }
            
            return (
              <Grid item xs={12} sm={6} md={6} lg={6} key={key}>
                <Card 
                  sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #2a1f3d 0%, #3a2a4d 100%)',
                    border: '1px solid rgba(131, 124, 242, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    width: 200,
                    height: 200,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(131, 124, 242, 0.2)',
                      border: '1px solid rgba(131, 124, 242, 0.4)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #837cf2, #6a4c93)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        boxShadow: '0 4px 15px rgba(131, 124, 242, 0.3)',
                      }}
                    >
                      {React.createElement(getIconComponent(metric.icon), {
                        sx: { fontSize: 24, color: 'white' }
                      })}
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'block',
                        mb: 1
                      }}
                    >
                      {key === 'activeUsers' ? 'Usuarios' :
                       key === 'apiCalls' ? 'Llamadas' :
                       key === 'successRate' ? 'Éxito' :
                       key === 'totalApps' ? 'Apps' : key}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.change?.startsWith('+') ? '#4caf50' : '#ff9800',
                        fontWeight: 600,
                        display: 'block',
                        mt: 'auto'
                      }}
                    >
                      {metric.change || '+0%'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Layout principal mejorado */}
      <Grid container spacing={3}>
        {/* Uso de Herramientas - Ocupa todo el ancho */}
        <Grid item xs={12}>
          <StyledPaper>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center">
              <Timeline sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {isAdmin ? 'Uso de Herramientas' : 'Mis Herramientas'}
              </Typography>
            </Box>
              {usage && usage.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenUsageModal(true)}
                  sx={{ 
                    color: '#837cf2', 
                    borderColor: '#837cf2',
                    '&:hover': { borderColor: '#AC9DFB' }
                  }}
                >
                  Ver Gráfico
                </Button>
              )}
            </Box>
            
            {usage && usage.length > 0 ? (
            <UsageChart usageData={usage} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Timeline sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 48, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay datos de uso disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Usa las herramientas para generar estadísticas
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Grid>



      </Grid>

      {/* Métricas de Usuario - Solo si hay datos disponibles */}
      {userMetrics && userMetrics.length > 0 && (
      <Box mt={4}>
        <SectionTitle variant="h5" component="h2" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          {isAdmin ? 'Métricas de Usuario' : 'Mi Rendimiento'}
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <UserMetrics metricsData={userMetrics} />
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
      )}

      {/* Sección adicional para usuarios normales */}
      {!isAdmin && (
        <Box mt={4}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <Assessment sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Resumen de Actividad
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              Aquí puedes ver un resumen de tu actividad reciente y el uso de las herramientas disponibles.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Usa las herramientas para generar datos de uso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Monitorea tu rendimiento y tiempo de uso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Revisa las métricas de tus herramientas favoritas
            </Typography>
          </StyledPaper>
        </Box>
      )}

        {/* Modal para Estado de APIs */}
        <Dialog 
          open={openApiModal} 
          onClose={() => setOpenApiModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#272038',
              color: 'white',
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Estado de todas las APIs</Typography>
              <Chip 
                label={`${apiPerformance?.filter(api => api.status === 'Operativo').length || 0}/${apiPerformance?.length || 0} Operativas`}
                color="success"
                size="small"
              />
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>API</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tiempo Respuesta</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Uptime</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Última Verificación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiPerformance?.map((api, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                      <TableCell sx={{ color: 'white' }}>{api.api}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(api.status)}
                          <StatusChip label={api.status} status={api.status} size="small" />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {api.responseTime > 0 ? `${api.responseTime}ms` : '-'}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{api.uptime}%</TableCell>
                      <TableCell sx={{ color: 'white' }}>{api.lastCheck}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
            <Button onClick={() => setOpenApiModal(false)} sx={{ color: '#837cf2' }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para Métricas Detalladas */}
        <Dialog 
          open={openMetricsModal} 
          onClose={() => setOpenMetricsModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#272038',
              color: 'white',
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5">Métricas Detalladas del Sistema</Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {Object.entries(metrics).map(([key, metric]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #837cf2, #6a4c93)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          {React.createElement(getIconComponent(metric.icon), {
                            sx: { fontSize: 20, color: 'white' }
                          })}
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>
                            {key === 'activeUsers' ? 'Usuarios Activos' :
                             key === 'apiCalls' ? 'Llamadas API' :
                             key === 'successRate' ? 'Tasa de Éxito' :
                             key === 'totalApps' ? 'Aplicaciones' : key}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.change || '+0%'} vs período anterior
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h4" sx={{ color: '#837cf2', fontWeight: 700, textAlign: 'center' }}>
                        {metric.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
            <Button onClick={() => setOpenMetricsModal(false)} sx={{ color: '#837cf2' }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para Uso de Herramientas */}
        <Dialog 
          open={openUsageModal} 
          onClose={() => setOpenUsageModal(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#272038',
              color: 'white',
              borderRadius: 2,
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              📊 Gráficos de Uso de Herramientas
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 2 }}>
            <UsageChartModal usageData={usage} />
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
            <Button onClick={() => setOpenUsageModal(false)} sx={{ color: '#837cf2' }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
    </AnalyticsContainer>
  );
};

export default Analytics; 