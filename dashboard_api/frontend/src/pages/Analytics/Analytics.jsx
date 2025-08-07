import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  Speed,
  People,
  Apps as AppsIcon,
  Assessment,
  Timeline,
  ShowChart,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';
import MetricCard from './components/MetricCard';
import UsageChart from './components/UsageChart';
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

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#272038',
  color: 'white',
  borderRadius: 12,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#837cf2',
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
  const [expanded, setExpanded] = useState(false);

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

  // Datos simulados para las APIs (reemplazar con datos reales)
  const apiData = [
    { name: 'Instagram API', status: 'Operativo', responseTime: '120ms', uptime: '99.9%', lastCheck: '2 min ago' },
    { name: 'Google API', status: 'Operativo', responseTime: '85ms', uptime: '99.8%', lastCheck: '1 min ago' },
    { name: 'YouTube API', status: 'Operativo', responseTime: '200ms', uptime: '99.7%', lastCheck: '3 min ago' },
    { name: 'Twitter API', status: 'Advertencia', responseTime: '500ms', uptime: '98.5%', lastCheck: '5 min ago' },
    { name: 'Facebook API', status: 'Operativo', responseTime: '150ms', uptime: '99.9%', lastCheck: '1 min ago' },
  ];

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

      {/* Estado del Sistema - Ahora arriba para admin/superadmin */}
      {isAdmin && (
        <Box mb={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box display="flex" alignItems="center" mb={3}>
                  <Speed sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Estado del Sistema
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(131, 124, 242, 0.05)',
                    border: '1px solid rgba(131, 124, 242, 0.1)',
                    minHeight: 60
                  }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      APIs Operativas
                    </Typography>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50'
                    }} />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(131, 124, 242, 0.05)',
                    border: '1px solid rgba(131, 124, 242, 0.1)',
                    minHeight: 60
                  }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Base de Datos
                    </Typography>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50'
                    }} />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(131, 124, 242, 0.05)',
                    border: '1px solid rgba(131, 124, 242, 0.1)',
                    minHeight: 60
                  }}>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Servidor Web
                    </Typography>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50'
                    }} />
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Box display="flex" alignItems="center" mb={3}>
                  <TrendingUp sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Tendencias del Sistema
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Monitoreo de tendencias y patrones de uso del sistema.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#837cf2', fontWeight: 700 }}>
                      99.8%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de Éxito
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#6a4c93', fontWeight: 700 }}>
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Disponibilidad
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Vista General - Métricas principales mejoradas */}
      <SectionTitle variant="h5" component="h2" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
        {isAdmin ? 'Vista General del Sistema' : 'Mi Actividad'}
      </SectionTitle>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {Object.entries(metrics).map(([key, metric]) => {
            // Para usuarios normales, mostrar solo métricas personales
            if (!isAdmin && (key === 'activeUsers' || key === 'totalApps')) {
              return null;
            }
            
            return (
              <Grid item xs={12} sm={6} md={6} lg={3} key={key}>
                <StyledPaper 
                  sx={{ 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #2a1f3d 0%, #3a2a4d 100%)',
                    border: '1px solid rgba(131, 124, 242, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, #837cf2, #6a4c93)',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(131, 124, 242, 0.2)',
                      border: '1px solid rgba(131, 124, 242, 0.4)',
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
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
                        boxShadow: '0 4px 20px rgba(131, 124, 242, 0.3)',
                      }}
                    >
                      {React.createElement(getIconComponent(metric.icon), {
                        sx: { fontSize: 24, color: 'white' }
                      })}
                    </Box>
                    <Typography 
                      variant="h4" 
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
                        color: metric.change?.startsWith('+') ? '#4caf50' : '#ff9800',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}
                    >
                      {metric.change || '+0%'}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    background: 'rgba(131, 124, 242, 0.1)', 
                    borderRadius: 1, 
                    p: 1.5,
                    border: '1px solid rgba(131, 124, 242, 0.2)',
                    mt: 'auto'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {key === 'activeUsers' ? 'Usuarios Activos' :
                       key === 'apiCalls' ? 'Llamadas API' :
                       key === 'successRate' ? 'Tasa de Éxito' :
                       key === 'totalApps' ? 'Aplicaciones' : key}
                    </Typography>
                  </Box>
                </StyledPaper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Layout principal mejorado */}
      <Grid container spacing={3}>
        {/* Columna 1: Uso de Herramientas */}
        <Grid item xs={12} md={isAdmin ? 6 : 12}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <Timeline sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {isAdmin ? 'Uso de Herramientas' : 'Mis Herramientas'}
              </Typography>
            </Box>
            <UsageChart usageData={usage} />
          </StyledPaper>
        </Grid>

        {/* Columna 2: Rendimiento de APIs con menú desplegable (solo admin/superadmin) */}
        {isAdmin && (
          <Grid item xs={12} md={6}>
            <StyledAccordion 
              expanded={expanded} 
              onChange={() => setExpanded(!expanded)}
            >
              <StyledAccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <ShowChart sx={{ color: '#837cf2', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Rendimiento de APIs
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Chip 
                      label={`${apiData.filter(api => api.status === 'Operativo').length}/${apiData.length} Operativas`}
                      size="small"
                      sx={{ backgroundColor: '#4caf50', color: 'white' }}
                    />
                  </Box>
                </Box>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ p: 2 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>API</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tiempo</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Uptime</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData.map((api, index) => (
                          <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                            <TableCell sx={{ color: 'white' }}>{api.name}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getStatusIcon(api.status)}
                                <StatusChip label={api.status} status={api.status} size="small" />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>{api.responseTime}</TableCell>
                            <TableCell sx={{ color: 'white' }}>{api.uptime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          </Grid>
        )}
      </Grid>

      {/* Métricas de Usuario - Ahora en sección separada */}
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
    </AnalyticsContainer>
  );
};

export default Analytics; 