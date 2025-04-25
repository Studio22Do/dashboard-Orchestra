import React from 'react';
import { Container, Grid, Box, Typography, Paper } from '@mui/material';
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

const AnalyticsContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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

const Analytics = () => {
  // Datos de ejemplo - En producción estos vendrían de una API
  const metrics = {
    apiCalls: {
      value: '2,547',
      change: '+12.5%',
      label: 'Llamadas API',
      icon: Speed,
    },
    activeUsers: {
      value: '847',
      change: '+5.2%',
      label: 'Usuarios Activos',
      icon: People,
    },
    totalApps: {
      value: '12',
      change: '+2',
      label: 'Apps Activas',
      icon: AppsIcon,
    },
    successRate: {
      value: '99.8%',
      change: '+0.3%',
      label: 'Tasa de Éxito',
      icon: TrendingUp,
    },
  };

  return (
    <AnalyticsContainer maxWidth="xl">
      {/* Vista General */}
      <SectionTitle variant="h4" component="h1">
        Vista General
      </SectionTitle>
      <Grid container spacing={3} mb={6}>
        {Object.entries(metrics).map(([key, metric]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Uso de Herramientas y APIs */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <Timeline sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Uso de Herramientas</Typography>
            </Box>
            <UsageChart />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <Assessment sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Top Herramientas</Typography>
            </Box>
            {/* Aquí irá el componente de top herramientas */}
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Rendimiento de APIs y Métricas de Usuario */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <ShowChart sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Rendimiento de APIs</Typography>
            </Box>
            <ApiPerformance />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={3}>
              <People sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Métricas de Usuario</Typography>
            </Box>
            <UserMetrics />
          </StyledPaper>
        </Grid>
      </Grid>
    </AnalyticsContainer>
  );
};

export default Analytics; 