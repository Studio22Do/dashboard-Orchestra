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

const UserMetrics = ({ metricsData = [] }) => {
  const safeMetrics = Array.isArray(metricsData) ? metricsData : [];
  // Si no hay datos, mostrar mensaje
  if (!safeMetrics || safeMetrics.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          No hay métricas de usuario disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {safeMetrics.map((metric, index) => (
        <Grid item xs={12} sm={6} key={metric.title || index}>
          <MetricBox>
            <IconBox color={metric.color || '#837cf2'}>
              {metric.icon === 'GroupAdd' && <GroupAdd />}
              {metric.icon === 'AccessTime' && <AccessTime />}
              {metric.icon === 'RepeatOne' && <RepeatOne />}
              {metric.icon === 'TrendingUp' && <TrendingUp />}
              {!metric.icon && <GroupAdd />}
            </IconBox>
            <Typography variant="h5" fontWeight="500">
              {metric.value || '0'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {metric.title || 'Métrica'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                color="success.main"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {metric.change || '0%'}
              </Typography>
              <Typography variant="body2" color="text.secondary" ml={1}>
                {metric.period || 'vs período anterior'}
              </Typography>
            </Box>
          </MetricBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserMetrics; 