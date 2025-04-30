import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  AccessTime,
  GroupAdd,
  RepeatOne
} from '@mui/icons-material';

const MetricBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  backgroundColor: `${color}20`,
  borderRadius: '50%',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: color,
    fontSize: 20,
  },
}));

const UserMetrics = () => {
  // Datos de ejemplo - En producción vendrían de una API
  const metrics = [
    {
      title: 'Usuarios Activos',
      value: '847',
      change: '+12%',
      period: 'vs mes anterior',
      icon: GroupAdd,
      color: '#837cf2'
    },
    {
      title: 'Tiempo Promedio',
      value: '24m',
      change: '+5%',
      period: 'por sesión',
      icon: AccessTime,
      color: '#2196F3'
    },
    {
      title: 'Tasa de Retorno',
      value: '68%',
      change: '+3%',
      period: 'usuarios recurrentes',
      icon: RepeatOne,
      color: '#FF9800'
    },
    {
      title: 'Crecimiento',
      value: '32%',
      change: '+8%',
      period: 'nuevos usuarios',
      icon: TrendingUp,
      color: '#E91E63'
    }
  ];

  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} key={metric.title}>
          <MetricBox>
            <IconBox color={metric.color}>
              <metric.icon />
            </IconBox>
            <Typography variant="h5" fontWeight="500">
              {metric.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {metric.title}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                color="success.main"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {metric.change}
              </Typography>
              <Typography variant="body2" color="text.secondary" ml={1}>
                {metric.period}
              </Typography>
            </Box>
          </MetricBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserMetrics; 