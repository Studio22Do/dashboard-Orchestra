import React, { useEffect } from 'react';
import { Container, Grid, Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  Speed,
  People,
  Apps as AppsIcon,
  Assessment,
  Timeline,
  ShowChart,
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
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
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

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, user]);

  // Si no es admin/superadmin, mostrar mensaje de permisos
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
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

  return (
    <AnalyticsContainer maxWidth="xl">
      {/* Vista General */}
      <SectionTitle variant="h4" component="h1">
        Vista General
      </SectionTitle>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(metrics).map(([key, metric]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <MetricCard 
              {...metric} 
              icon={getIconComponent(metric.icon)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Layout principal con 3 columnas */}
      <Grid container spacing={3}>
        {/* Columna 1: Uso de Herramientas */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={2}>
              <Timeline sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Uso de Herramientas</Typography>
            </Box>
            <UsageChart usageData={usage} />
          </StyledPaper>
        </Grid>

        {/* Columna 2: Rendimiento de APIs (solo admin/superadmin) */}
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Box display="flex" alignItems="center" mb={2}>
                <ShowChart sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h5">Rendimiento de APIs</Typography>
              </Box>
              <ApiPerformance apiData={apiPerformance} />
            </StyledPaper>
          </Grid>
        )}

        {/* Columna 3: Métricas de Usuario */}
        <Grid item xs={12} md={user && (user.role === 'admin' || user.role === 'superadmin') ? 4 : 8}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={2}>
              <People sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Métricas de Usuario</Typography>
            </Box>
            <UserMetrics metricsData={userMetrics} />
          </StyledPaper>
        </Grid>
      </Grid>
    </AnalyticsContainer>
  );
};

export default Analytics; 