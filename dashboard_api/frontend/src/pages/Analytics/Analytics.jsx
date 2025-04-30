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
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.entries(metrics).map(([key, metric]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <MetricCard {...metric} />
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
            <UsageChart />
          </StyledPaper>
        </Grid>

        {/* Columna 2: Rendimiento de APIs */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={2}>
              <ShowChart sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h5">Rendimiento de APIs</Typography>
            </Box>
            <ApiPerformance />
          </StyledPaper>
        </Grid>

        {/* Columna 3: Métricas de Usuario */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={2}>
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