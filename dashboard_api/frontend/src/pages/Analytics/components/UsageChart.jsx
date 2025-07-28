import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.background.default,
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const UsageChart = ({ usageData = [] }) => {
  // Si no hay datos, mostrar mensaje
  if (!usageData || usageData.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body2" color="text.secondary">
          No hay datos de uso disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {usageData.map((item) => (
        <ProgressContainer key={item.name || item.id}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {item.usage || item.count || 0}%
            </Typography>
          </Box>
          <StyledLinearProgress
            variant="determinate"
            value={item.usage || item.count || 0}
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: item.color || '#2196F3',
              },
            }}
          />
        </ProgressContainer>
      ))}
    </Box>
  );
};

export default UsageChart; 